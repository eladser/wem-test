using AutoMapper;
using WemDashboard.Application.DTOs.Sites;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.Mappings;

public class SiteProfile : Profile
{
    public SiteProfile()
    {
        CreateMap<Site, SiteDto>()
            .ForMember(dest => dest.AssetsCount, opt => opt.MapFrom(src => src.Assets.Count))
            .ForMember(dest => dest.AlertsCount, opt => opt.MapFrom(src => src.Alerts.Count));

        CreateMap<CreateSiteDto, Site>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.LastUpdate, opt => opt.Ignore())
            .ForMember(dest => dest.Assets, opt => opt.Ignore())
            .ForMember(dest => dest.PowerData, opt => opt.Ignore())
            .ForMember(dest => dest.Alerts, opt => opt.Ignore());

        CreateMap<UpdateSiteDto, Site>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.LastUpdate, opt => opt.Ignore())
            .ForMember(dest => dest.Assets, opt => opt.Ignore())
            .ForMember(dest => dest.PowerData, opt => opt.Ignore())
            .ForMember(dest => dest.Alerts, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
