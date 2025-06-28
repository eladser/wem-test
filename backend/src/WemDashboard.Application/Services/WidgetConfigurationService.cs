using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Application.Services;

public interface IWidgetConfigurationService
{
    Task<IEnumerable<WidgetConfigurationDto>> GetUserWidgetsAsync(string userId);
    Task<IEnumerable<WidgetConfigurationDto>> GetLayoutWidgetsAsync(int layoutId);
    Task<IEnumerable<WidgetConfigurationDto>> GetPageWidgetsAsync(string userId, string pageName);
    Task<WidgetConfigurationDto?> GetWidgetByIdAsync(int id);
    Task<WidgetConfigurationDto?> GetWidgetByWidgetIdAsync(string userId, string widgetId);
    Task<WidgetConfigurationDto> CreateWidgetAsync(WidgetConfigurationDto widget);
    Task<WidgetConfigurationDto> UpdateWidgetAsync(WidgetConfigurationDto widget);
    Task DeleteWidgetAsync(int id);
    Task DeleteWidgetByWidgetIdAsync(string userId, string widgetId);
    Task<IEnumerable<WidgetConfigurationDto>> BulkUpdateWidgetsAsync(IEnumerable<WidgetConfigurationDto> widgets);
}

public class WidgetConfigurationService : IWidgetConfigurationService
{
    private readonly IWidgetConfigurationRepository _repository;
    private readonly IMapper _mapper;

    public WidgetConfigurationService(IWidgetConfigurationRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<WidgetConfigurationDto>> GetUserWidgetsAsync(string userId)
    {
        var widgets = await _repository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<WidgetConfigurationDto>>(widgets);
    }

    public async Task<IEnumerable<WidgetConfigurationDto>> GetLayoutWidgetsAsync(int layoutId)
    {
        var widgets = await _repository.GetByLayoutIdAsync(layoutId);
        return _mapper.Map<IEnumerable<WidgetConfigurationDto>>(widgets);
    }

    public async Task<IEnumerable<WidgetConfigurationDto>> GetPageWidgetsAsync(string userId, string pageName)
    {
        var widgets = await _repository.GetByUserAndPageAsync(userId, pageName);
        return _mapper.Map<IEnumerable<WidgetConfigurationDto>>(widgets);
    }

    public async Task<WidgetConfigurationDto?> GetWidgetByIdAsync(int id)
    {
        var widget = await _repository.GetByIdAsync(id);
        return widget != null ? _mapper.Map<WidgetConfigurationDto>(widget) : null;
    }

    public async Task<WidgetConfigurationDto?> GetWidgetByWidgetIdAsync(string userId, string widgetId)
    {
        var widget = await _repository.GetByWidgetIdAsync(userId, widgetId);
        return widget != null ? _mapper.Map<WidgetConfigurationDto>(widget) : null;
    }

    public async Task<WidgetConfigurationDto> CreateWidgetAsync(WidgetConfigurationDto widget)
    {
        var entity = _mapper.Map<WidgetConfiguration>(widget);
        var created = await _repository.CreateAsync(entity);
        return _mapper.Map<WidgetConfigurationDto>(created);
    }

    public async Task<WidgetConfigurationDto> UpdateWidgetAsync(WidgetConfigurationDto widget)
    {
        var entity = _mapper.Map<WidgetConfiguration>(widget);
        var updated = await _repository.UpdateAsync(entity);
        return _mapper.Map<WidgetConfigurationDto>(updated);
    }

    public async Task DeleteWidgetAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task DeleteWidgetByWidgetIdAsync(string userId, string widgetId)
    {
        await _repository.DeleteByWidgetIdAsync(userId, widgetId);
    }

    public async Task<IEnumerable<WidgetConfigurationDto>> BulkUpdateWidgetsAsync(IEnumerable<WidgetConfigurationDto> widgets)
    {
        var entities = _mapper.Map<IEnumerable<WidgetConfiguration>>(widgets);
        var updated = await _repository.BulkUpdateAsync(entities);
        return _mapper.Map<IEnumerable<WidgetConfigurationDto>>(updated);
    }
}