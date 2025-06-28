using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IWidgetConfigurationRepository
{
    Task<IEnumerable<WidgetConfiguration>> GetByUserIdAsync(string userId);
    Task<IEnumerable<WidgetConfiguration>> GetByLayoutIdAsync(int layoutId);
    Task<IEnumerable<WidgetConfiguration>> GetByUserAndPageAsync(string userId, string pageName);
    Task<WidgetConfiguration?> GetByIdAsync(int id);
    Task<WidgetConfiguration?> GetByWidgetIdAsync(string userId, string widgetId);
    Task<WidgetConfiguration> CreateAsync(WidgetConfiguration widget);
    Task<WidgetConfiguration> UpdateAsync(WidgetConfiguration widget);
    Task DeleteAsync(int id);
    Task DeleteByWidgetIdAsync(string userId, string widgetId);
    Task<IEnumerable<WidgetConfiguration>> BulkUpdateAsync(IEnumerable<WidgetConfiguration> widgets);
}