using Microsoft.Extensions.DependencyInjection;

namespace WemDashboard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(typeof(DependencyInjection));

        return services;
    }
}
