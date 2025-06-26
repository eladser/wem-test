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

// CORS with WebSocket support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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

// Enable WebSocket support
app.UseWebSockets();

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

// WebSocket endpoint for real-time data
app.MapGet("/ws/energy-data", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleWebSocketConnection(webSocket);
    }
    else
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("WebSocket connection required");
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

app.Run();

// Simplified WebSocket handler
static async Task HandleWebSocketConnection(WebSocket webSocket)
{
    Console.WriteLine("🔌 New WebSocket connection established");
    
    var buffer = new byte[1024 * 4];
    
    try
    {
        // Send initial data immediately
        await SendEnergyData(webSocket);
        
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
                    Console.WriteLine("🔌 Client requested close");
                    break;
                }
                
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"📥 Received: {message}");
                }
            }
            catch (OperationCanceledException)
            {
                // Timeout is normal - just continue
            }
            
            // Send data every 5 seconds
            await Task.Delay(5000);
            
            if (webSocket.State == WebSocketState.Open)
            {
                await SendEnergyData(webSocket);
            }
        }
    }
    catch (WebSocketException ex)
    {
        Console.WriteLine($"🔌 WebSocket error: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ WebSocket handler error: {ex.Message}");
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
                Console.WriteLine($"❌ Error closing WebSocket: {ex.Message}");
            }
        }
        Console.WriteLine("✅ WebSocket connection closed");
    }
}

static async Task SendEnergyData(WebSocket webSocket)
{
    if (webSocket.State != WebSocketState.Open) return;
    
    try
    {
        var energyData = new
        {
            type = "energy-overview",
            totalSites = 4,
            onlineSites = 3,
            totalCapacity = 85.5,
            currentOutput = Math.Round(60 + Random.Shared.NextDouble() * 25, 1),
            efficiency = Math.Round(85 + Random.Shared.NextDouble() * 10, 1),
            alerts = Random.Shared.Next(0, 3),
            lastUpdated = DateTime.UtcNow.ToString("O"),
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        };

        var json = JsonSerializer.Serialize(energyData);
        var bytes = Encoding.UTF8.GetBytes(json);

        await webSocket.SendAsync(
            new ArraySegment<byte>(bytes),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
        
        Console.WriteLine($"📤 Sent: {energyData.efficiency}% efficiency, {energyData.currentOutput} MW");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error sending data: {ex.Message}");
    }
}
