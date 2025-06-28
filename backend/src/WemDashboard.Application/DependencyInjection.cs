using Microsoft.Extensions.DependencyInjection;
using WemDashboard.Application.Services;
using System.Reflection;

namespace WemDashboard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        
        // Application Services
        services.AddScoped<IUserPreferencesService, UserPreferencesService>();
        services.AddScoped<IDashboardLayoutService, DashboardLayoutService>();
        services.AddScoped<IWidgetConfigurationService, WidgetConfigurationService>();
        services.AddScoped<IGridConfigurationService, GridConfigurationService>();
        services.AddScoped<IViewStateService, ViewStateService>();
        
        return services;
    }
}