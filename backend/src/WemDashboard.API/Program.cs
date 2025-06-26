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

var builder = WebApplication.CreateBuilder(args);

// FORCE SQLITE CONFIGURATION - Debug what's happening
Console.WriteLine("=== WEM DASHBOARD DATABASE CONFIGURATION DEBUG ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");

// Force SQLite configuration
var connectionString = "Data Source=wemdashboard-dev.db;";
var databaseProvider = "SQLite";

Console.WriteLine($"FORCED Database Provider: {databaseProvider}");
Console.WriteLine($"FORCED Connection String: {connectionString}");

// Override configuration values
builder.Configuration["DatabaseProvider"] = databaseProvider;
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

Console.WriteLine($"Config DatabaseProvider: {builder.Configuration["DatabaseProvider"]}");
Console.WriteLine($"Config ConnectionString: {builder.Configuration.GetConnectionString("DefaultConnection")}");
Console.WriteLine("=====================================================");

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

// CORS
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

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WemDashboardDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    
    try
    {
        Console.WriteLine("=== DATABASE INITIALIZATION DEBUG ===");
        
        // Get the underlying database connection
        var connection = context.Database.GetDbConnection();
        Console.WriteLine($"DbContext Connection String: {connection.ConnectionString}");
        Console.WriteLine($"Connection Type: {connection.GetType().Name}");
        Console.WriteLine($"Database Provider: {context.Database.ProviderName}");
        Console.WriteLine("=====================================");
        
        await context.Database.EnsureCreatedAsync();
        await seeder.SeedAsync();
        Log.Information("Database initialized successfully");
        
        Console.WriteLine("✅ SUCCESS: Database initialized with SQLite!");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while initializing the database");
        Console.WriteLine($"❌ DATABASE ERROR: {ex.Message}");
        Console.WriteLine($"❌ STACK TRACE: {ex.StackTrace}");
        throw;
    }
}

Log.Information("Starting WEM Dashboard API on {Environment}", app.Environment.EnvironmentName);
Log.Information("Swagger UI available at: http://localhost:5000/swagger");
Log.Information("Health checks available at: http://localhost:5000/health");

app.Run();
