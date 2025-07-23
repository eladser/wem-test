using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WemDashboard.Application.Services;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Infrastructure.Repositories;
using WemDashboard.Infrastructure.Services;
using Microsoft.Extensions.Caching.StackExchangeRedis;

namespace WemDashboard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // PostgreSQL configuration
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            "Host=localhost;Database=wemdashboard;Username=postgres;Password=postgres;Port=5432";

        Console.WriteLine($"🔧 Using PostgreSQL");
        Console.WriteLine($"🔧 Connection String: {connectionString}");

        // Configure PostgreSQL
        services.AddDbContext<WemDashboardDbContext>(options =>
            options.UseNpgsql(connectionString,
                b => b.MigrationsAssembly("WemDashboard.Infrastructure")));

        // Repository registration
        services.AddScoped<ISiteRepository, SiteRepository>();
        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<IPowerDataRepository, PowerDataRepository>();
        services.AddScoped<IAlertRepository, AlertRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Settings and configuration repository registration
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