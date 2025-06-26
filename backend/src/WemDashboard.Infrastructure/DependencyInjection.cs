using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Infrastructure.Repositories;
using WemDashboard.Infrastructure.Services;

namespace WemDashboard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database configuration
        var databaseProvider = configuration["DatabaseProvider"] ?? "SqlServer";
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
            throw new InvalidOperationException("DefaultConnection string is required");

        switch (databaseProvider.ToLower())
        {
            case "sqlserver":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseSqlServer(connectionString));
                break;
            case "postgresql":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseNpgsql(connectionString));
                break;
            case "mysql":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
                break;
            case "sqlite":
                services.AddDbContext<WemDashboardDbContext>(options =>
                    options.UseSqlite(connectionString));
                break;
            default:
                throw new InvalidOperationException($"Database provider '{databaseProvider}' is not supported");
        }

        // Repository registration
        services.AddScoped<ISiteRepository, SiteRepository>();
        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<IPowerDataRepository, PowerDataRepository>();
        services.AddScoped<IAlertRepository, AlertRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
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
