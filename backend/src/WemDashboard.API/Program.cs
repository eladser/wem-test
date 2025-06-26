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
        Title = AppConstants.ApiTitle,
        Version = AppConstants.ApiVersion,
        Description = AppConstants.ApiDescription,
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
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AppConstants.Policies.AdminOnly, policy => 
        policy.RequireRole(AppConstants.Roles.Admin));
    options.AddPolicy(AppConstants.Policies.ManagerOrAbove, policy => 
        policy.RequireRole(AppConstants.Roles.Admin, AppConstants.Roles.Manager));
    options.AddPolicy(AppConstants.Policies.OperatorOrAbove, policy => 
        policy.RequireRole(AppConstants.Roles.Admin, AppConstants.Roles.Manager, AppConstants.Roles.Operator));
    options.AddPolicy(AppConstants.Policies.AllRoles, policy => 
        policy.RequireRole(AppConstants.Roles.Admin, AppConstants.Roles.Manager, AppConstants.Roles.Operator, AppConstants.Roles.Viewer));
});

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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{AppConstants.ApiTitle} {AppConstants.ApiVersion}");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

// Enable WebSocket support
app.UseWebSockets();

// Middleware pipeline
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
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
app.Map("/ws/energy-data", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleWebSocketConnection(webSocket, context);
    }
    else
    {
        context.Response.StatusCode = 400;
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
Console.WriteLine("📚 Swagger: http://localhost:5000/swagger");
Console.WriteLine("🏥 Health: http://localhost:5000/health");
Console.WriteLine("🔌 API: http://localhost:5000");
Console.WriteLine("🔄 WebSocket: ws://localhost:5000/ws/energy-data");

app.Run();

// WebSocket handler for real-time energy data
static async Task HandleWebSocketConnection(WebSocket webSocket, HttpContext context)
{
    const int delayMs = 5000; // Send data every 5 seconds
    var buffer = new byte[1024 * 4];

    try
    {
        while (webSocket.State == WebSocketState.Open)
        {
            // Generate mock real-time energy data
            var energyData = new
            {
                totalSites = 6,
                onlineSites = 5,
                totalCapacity = 293.2,
                currentOutput = 238.8,
                efficiency = 81.4 + Random.Shared.NextDouble() * 15, // Random efficiency between 81-96%
                alerts = Random.Shared.Next(0, 4),
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

            // Check for client messages (like heartbeat)
            var receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                new CancellationTokenSource(100).Token); // Short timeout

            await Task.Delay(delayMs);
        }
    }
    catch (OperationCanceledException)
    {
        // Client disconnected or timeout - normal behavior
    }
    catch (WebSocketException ex)
    {
        Console.WriteLine($"WebSocket error: {ex.Message}");
    }
    finally
    {
        if (webSocket.State == WebSocketState.Open)
        {
            await webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Connection closed",
                CancellationToken.None);
        }
    }
}
