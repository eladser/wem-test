using AutoMapper;
using WemDashboard.Application.DTOs.Auth;
using WemDashboard.Application.DTOs.Alerts;
using WemDashboard.Application.DTOs.Assets;
using WemDashboard.Application.DTOs.Sites;
using WemDashboard.Application.DTOs.PowerData;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Asset mappings
        CreateMap<CreateAssetDto, Asset>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => AssetStatus.Online))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Site mappings
        CreateMap<CreateSiteDto, Site>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => SiteStatus.Online))
            .ForMember(dest => dest.CurrentOutput, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.Efficiency, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.LastUpdate, opt => opt.MapFrom(src => DateTime.UtcNow));

        // PowerData mappings
        CreateMap<PowerData, PowerDataDto>()
            .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Site != null ? src.Site.Name : null));
        
        CreateMap<CreatePowerDataDto, PowerData>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Alert mappings
        CreateMap<Alert, AlertDto>()
            .ForMember(dest => dest.SiteName, opt => opt.MapFrom(src => src.Site != null ? src.Site.Name : null));
        
        CreateMap<CreateAlertDto, Alert>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // User mappings
        CreateMap<User, UserDto>();
        
        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.LastLogin, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}
