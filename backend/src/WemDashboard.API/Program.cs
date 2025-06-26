using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text;
using WemDashboard.API.Middleware;
using WemDashboard.Application;
using WemDashboard.Application.Mappings;
using WemDashboard.Application.Services;
using WemDashboard.Application.Validators;
using WemDashboard.Infrastructure;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Infrastructure.Services;
using WemDashboard.Shared.Constants;
using System.Net.WebSockets;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// FORCE SQLITE CONFIGURATION
Console.WriteLine("=== WEM DASHBOARD CONFIGURATION ===");
var connectionString = "Data Source=wemdashboard-dev.db;";
var databaseProvider = "SQLite";

builder.Configuration["DatabaseProvider"] = databaseProvider;
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

Console.WriteLine($"✅ Database Provider: {databaseProvider}");
Console.WriteLine($"✅ Connection String: {connectionString}");
Console.WriteLine("==================================");

// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/wemdashboard-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger/OpenAPI configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WEM Dashboard API",
        Version = "v1",
        Description = "WEM Dashboard API for energy management",
        Contact = new OpenApiContact
        {
            Name = "WEM Dashboard Support",
            Email = "support@wemdashboard.com"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Application services
builder.Services.AddApplication();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddValidatorsFromAssemblyContaining<CreateSiteValidator>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Key") ?? 
    throw new InvalidOperationException("JWT Key is required"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidateAudience = true,
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Authorization policies
builder.Services.AddAuthorization();

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("GlobalLimit", limiterOptions =>
    {
        limiterOptions.PermitLimit = 1000;
        limiterOptions.Window = TimeSpan.FromHours(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 100;
    });
});

// Enhanced CORS with WebSocket support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:3000", 
                "https://localhost:5173",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("*");
    });
});

// Health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<WemDashboardDbContext>();

// Response caching
builder.Services.AddResponseCaching();

var app = builder.Build();

// Configure the HTTP request pipeline.
// ALWAYS enable Swagger (not just in development)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WEM Dashboard API v1");
    c.RoutePrefix = string.Empty; // Serve Swagger UI at root
});

// Enable WebSocket support with options
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2),
    ReceiveBufferSize = 4 * 1024
};

app.UseWebSockets(webSocketOptions);

// Basic hello endpoint for testing
app.MapGet("/api/hello", () => new { message = "WEM Dashboard API is running!", timestamp = DateTime.UtcNow });

// Middleware pipeline - CORRECTED ORDER
app.UseCors("AllowFrontend");

// Remove HTTPS redirection in development to avoid issues
// app.UseHttpsRedirection();

app.UseRateLimiter();
app.UseResponseCaching();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready");
app.MapHealthChecks("/health/live");

// Enhanced WebSocket endpoint with better error handling
app.MapGet("/ws/energy-data", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        Console.WriteLine($"🔌 WebSocket connection request from: {context.Connection.RemoteIpAddress}");
        Console.WriteLine($"🔌 Origin: {context.Request.Headers["Origin"]}");
        Console.WriteLine($"🔌 User-Agent: {context.Request.Headers["User-Agent"]}");
        
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleWebSocketConnection(webSocket, context);
    }
    else
    {
        Console.WriteLine($"❌ Non-WebSocket request to WebSocket endpoint from: {context.Connection.RemoteIpAddress}");
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("WebSocket connection required. Use ws://localhost:5000/ws/energy-data");
    }
});

// Database initialization with seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WemDashboardDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    
    try
    {
        Console.WriteLine("🔨 Initializing database...");
        
        // Delete and recreate database to ensure clean state
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
        
        Console.WriteLine("📊 Seeding database with sample data...");
        await seeder.SeedAsync();
        
        Log.Information("Database initialized and seeded successfully");
        Console.WriteLine("✅ Database ready with sample data!");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while initializing the database");
        Console.WriteLine($"❌ DATABASE ERROR: {ex.Message}");
        throw;
    }
}

Log.Information("Starting WEM Dashboard API on {Environment}", app.Environment.EnvironmentName);

Console.WriteLine("🚀 WEM Dashboard API is running!");
Console.WriteLine("📚 Swagger: http://localhost:5000");
Console.WriteLine("🏥 Health: http://localhost:5000/health");
Console.WriteLine("🧪 Test: http://localhost:5000/api/hello");
Console.WriteLine("🔄 WebSocket: ws://localhost:5000/ws/energy-data");
Console.WriteLine("⚠️  If WebSocket fails, run debug-websocket.bat for troubleshooting");

app.Run();

// Enhanced WebSocket handler with better error handling and logging
static async Task HandleWebSocketConnection(WebSocket webSocket, HttpContext context)
{
    var connectionId = Guid.NewGuid().ToString("N")[..8];
    var clientInfo = $"{context.Connection.RemoteIpAddress}:{context.Connection.RemotePort}";
    
    Console.WriteLine($"🔌 [{connectionId}] New WebSocket connection from {clientInfo}");
    
    var buffer = new byte[1024 * 4];
    
    try
    {
        // Send initial welcome message
        await SendWelcomeMessage(webSocket, connectionId);
        
        // Send initial data immediately
        await SendEnergyData(webSocket, connectionId);
        
        // Keep connection alive and send data every 5 seconds
        while (webSocket.State == WebSocketState.Open)
        {
            try
            {
                // Check for incoming messages with short timeout
                var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(100));
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);
                
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine($"🔌 [{connectionId}] Client requested close");
                    break;
                }
                
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"📥 [{connectionId}] Received: {message}");
                    
                    // Handle ping/pong for keep-alive
                    if (message.Contains("ping"))
                    {
                        await SendPongMessage(webSocket, connectionId);
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Timeout is normal - just continue
            }
            catch (WebSocketException wsEx) when (wsEx.WebSocketErrorCode == WebSocketError.ConnectionClosedPrematurely)
            {
                Console.WriteLine($"🔌 [{connectionId}] Client disconnected prematurely");
                break;
            }
            
            // Send data every 5 seconds
            await Task.Delay(5000);
            
            if (webSocket.State == WebSocketState.Open)
            {
                await SendEnergyData(webSocket, connectionId);
            }
        }
    }
    catch (WebSocketException ex)
    {
        Console.WriteLine($"🔌 [{connectionId}] WebSocket error: {ex.Message} (Code: {ex.WebSocketErrorCode})");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ [{connectionId}] WebSocket handler error: {ex.Message}");
    }
    finally
    {
        if (webSocket.State == WebSocketState.Open)
        {
            try
            {
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    "Server closing",
                    CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [{connectionId}] Error closing WebSocket: {ex.Message}");
            }
        }
        Console.WriteLine($"✅ [{connectionId}] WebSocket connection closed");
    }
}

static async Task SendWelcomeMessage(WebSocket webSocket, string connectionId)
{
    if (webSocket.State != WebSocketState.Open) return;
    
    try
    {
        var welcomeMessage = new
        {
            type = "welcome",
            message = "Connected to WEM Dashboard WebSocket",
            connectionId = connectionId,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        };

        var json = JsonSerializer.Serialize(welcomeMessage);
        var bytes = Encoding.UTF8.GetBytes(json);

        await webSocket.SendAsync(
            new ArraySegment<byte>(bytes),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
        
        Console.WriteLine($"📤 [{connectionId}] Sent welcome message");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ [{connectionId}] Error sending welcome message: {ex.Message}");
    }
}

static async Task SendPongMessage(WebSocket webSocket, string connectionId)
{
    if (webSocket.State != WebSocketState.Open) return;
    
    try
    {
        var pongMessage = new
        {
            type = "pong",
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        };

        var json = JsonSerializer.Serialize(pongMessage);
        var bytes = Encoding.UTF8.GetBytes(json);

        await webSocket.SendAsync(
            new ArraySegment<byte>(bytes),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
        
        Console.WriteLine($"📤 [{connectionId}] Sent pong response");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ [{connectionId}] Error sending pong: {ex.Message}");
    }
}

static async Task SendEnergyData(WebSocket webSocket, string connectionId)
{
    if (webSocket.State != WebSocketState.Open) return;
    
    try
    {
        var energyData = new
        {
            type = "energy-overview",
            totalSites = 6,
            onlineSites = Random.Shared.Next(4, 7),
            totalCapacity = 292.7,
            currentOutput = Math.Round(180 + Random.Shared.NextDouble() * 80, 1),
            efficiency = Math.Round(85 + Random.Shared.NextDouble() * 12, 1),
            alerts = Random.Shared.Next(0, 4),
            lastUpdated = DateTime.UtcNow.ToString("O"),
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            connectionId = connectionId
        };

        var json = JsonSerializer.Serialize(energyData);
        var bytes = Encoding.UTF8.GetBytes(json);

        await webSocket.SendAsync(
            new ArraySegment<byte>(bytes),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
        
        Console.WriteLine($"📤 [{connectionId}] Sent: {energyData.efficiency}% efficiency, {energyData.currentOutput} MW, {energyData.alerts} alerts");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ [{connectionId}] Error sending energy data: {ex.Message}");
    }
}
