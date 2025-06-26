using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Site mappings
        CreateMap<Site, SiteDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => GetRelativeTime(src.LastUpdate)));
        
        CreateMap<CreateSiteDto, Site>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => SiteStatus.Online))
            .ForMember(dest => dest.CurrentOutput, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.Efficiency, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Asset mappings
        CreateMap<Asset, AssetDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => GetRelativeTime(src.LastUpdate)));
        
        CreateMap<CreateAssetDto, Asset>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => ParseAssetType(src.Type)))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => AssetStatus.Online))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => DateTime.UtcNow));

        // PowerData mappings
        CreateMap<PowerData, PowerDataDto>()
            .ForMember(dest => dest.Time, opt => opt.MapFrom(src => src.Time.ToString("HH:mm")));
        
        CreateMap<CreatePowerDataDto, PowerData>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Alert mappings
        CreateMap<Alert, AlertDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString().ToLower()))
            .ForMember(dest => dest.Site, opt => opt.MapFrom(src => src.Site.Name));
        
        CreateMap<CreateAlertDto, Alert>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => ParseAlertType(src.Type)))
            .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
        
        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => ParseUserRole(src.Role)))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
    }

    private static string GetRelativeTime(DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;
        
        return timeSpan.TotalMinutes switch
        {
            < 1 => "Just now",
            < 60 => $"{(int)timeSpan.TotalMinutes} min ago",
            < 1440 => $"{(int)timeSpan.TotalHours} hours ago",
            _ => $"{(int)timeSpan.TotalDays} days ago"
        };
    }

    private static AssetType ParseAssetType(string type)
    {
        return type.ToLower() switch
        {
            "inverter" => AssetType.Inverter,
            "battery" => AssetType.Battery,
            "solar_panel" => AssetType.SolarPanel,
            "wind_turbine" => AssetType.WindTurbine,
            _ => AssetType.Inverter
        };
    }

    private static AlertType ParseAlertType(string type)
    {
        return type.ToLower() switch
        {
            "warning" => AlertType.Warning,
            "info" => AlertType.Info,
            "success" => AlertType.Success,
            "error" => AlertType.Error,
            _ => AlertType.Info
        };
    }

    private static UserRole ParseUserRole(string role)
    {
        return role switch
        {
            "Admin" => UserRole.Admin,
            "Manager" => UserRole.Manager,
            "Operator" => UserRole.Operator,
            "Viewer" => UserRole.Viewer,
            _ => UserRole.Viewer
        };
    }
}
