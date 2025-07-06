using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WemDashboard.Application.Services;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Infrastructure.Repositories;
using WemDashboard.Infrastructure.Services;

namespace WemDashboard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database configuration - Force SQLite for development, allow override for production
        var databaseProvider = configuration["DatabaseProvider"]?.ToLower() ?? "sqlite";
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            "Data Source=wemdashboard.db;";

        // Log the configuration being used
        Console.WriteLine($"🔧 Database Provider: {databaseProvider}");
        Console.WriteLine($"🔧 Connection String: {connectionString}");

        // Force SQLite for development environment
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            databaseProvider = "sqlite";
            Console.WriteLine("🔧 Development mode detected - forcing SQLite");
        }

        switch (databaseProvider.ToLower())
        {
            case "sqlserver":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseSqlServer(connectionString, 
                        b => b.MigrationsAssembly("WemDashboard.Infrastructure")));
                Console.WriteLine("✅ Configured SQL Server");
                break;
            case "postgresql":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseNpgsql(connectionString,
                        b => b.MigrationsAssembly("WemDashboard.Infrastructure")));
                Console.WriteLine("✅ Configured PostgreSQL");
                break;
            case "mysql":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        b => b.MigrationsAssembly("WemDashboard.Infrastructure")));
                Console.WriteLine("✅ Configured MySQL");
                break;
            case "sqlite":
            default:
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseSqlite(connectionString,
                        b => b.MigrationsAssembly("WemDashboard.Infrastructure")));
                Console.WriteLine("✅ Configured SQLite");
                break;
        }

        // Original repository registration
        services.AddScoped<ISiteRepository, SiteRepository>();
        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<IPowerDataRepository, PowerDataRepository>();
        services.AddScoped<IAlertRepository, AlertRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // New settings and configuration repository registration
        services.AddScoped<IUserPreferencesRepository, UserPreferencesRepository>();
        services.AddScoped<IDashboardLayoutRepository, DashboardLayoutRepository>();
        services.AddScoped<IWidgetConfigurationRepository, WidgetConfigurationRepository>();
        services.AddScoped<IGridComponentConfigurationRepository, GridComponentConfigurationRepository>();
        services.AddScoped<IEnergyFlowConfigurationRepository, EnergyFlowConfigurationRepository>();
        services.AddScoped<IFilterPresetRepository, FilterPresetRepository>();
        services.AddScoped<IReportTemplateRepository, ReportTemplateRepository>();
        services.AddScoped<IViewStateRepository, ViewStateRepository>();

        // Application Services
        services.AddScoped<ISiteService, SiteService>();

        // Infrastructure Services
        services.AddScoped<DataSeeder>();

        // Redis Cache (optional)
        var redisConnectionString = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnectionString))
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
            });
        }
        else
        {
            services.AddMemoryCache();
        }

        return services;
    }
}
