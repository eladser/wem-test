using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User Preferences
        CreateMap<UserPreferences, UserPreferencesDto>().ReverseMap();
        
        // Dashboard Layout
        CreateMap<DashboardLayout, DashboardLayoutDto>().ReverseMap();
        
        // Widget Configuration
        CreateMap<WidgetConfiguration, WidgetConfigurationDto>().ReverseMap();
        
        // Grid Component Configuration
        CreateMap<GridComponentConfiguration, GridComponentConfigurationDto>().ReverseMap();
        
        // Energy Flow Configuration
        CreateMap<EnergyFlowConfiguration, EnergyFlowConfigurationDto>().ReverseMap();
        
        // Filter Preset
        CreateMap<FilterPreset, FilterPresetDto>()
            .ForMember(dest => dest.FilterConfig, opt => opt.MapFrom(src => src.FilterConfig))
            .ReverseMap();
        
        // Report Template
        CreateMap<ReportTemplate, ReportTemplateDto>()
            .ForMember(dest => dest.TemplateConfig, opt => opt.MapFrom(src => src.TemplateConfig))
            .ReverseMap();
        
        // View State
        CreateMap<ViewState, ViewStateDto>()
            .ForMember(dest => dest.StateValue, opt => opt.MapFrom(src => src.StateValue))
            .ReverseMap();
    }
}

// Additional DTOs for completeness
public class FilterPresetDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public string FilterConfig { get; set; } = "{}";
    public bool IsDefault { get; set; } = false;
    public bool IsShared { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ReportTemplateDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ReportType { get; set; } = string.Empty;
    public string TemplateConfig { get; set; } = "{}";
    public bool IsScheduled { get; set; } = false;
    public string ScheduleCron { get; set; } = string.Empty;
    public string Recipients { get; set; } = string.Empty;
    public string ExportFormat { get; set; } = "pdf";
    public bool IncludeCharts { get; set; } = true;
    public bool IncludeData { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ViewStateDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public string StateKey { get; set; } = string.Empty;
    public string StateValue { get; set; } = "{}";
    public DateTime? ExpiresAt { get; set; }
    public bool IsPersistent { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}