using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IAlertRepository : IRepository<Alert>
{
    Task<IEnumerable<Alert>> GetAlertsBySiteIdAsync(string siteId);
    Task<IEnumerable<Alert>> GetAlertsByTypeAsync(AlertType type);
    Task<IEnumerable<Alert>> GetUnreadAlertsAsync();
    Task<IEnumerable<Alert>> GetUnreadAlertsBySiteIdAsync(string siteId);
    Task<IEnumerable<Alert>> GetRecentAlertsAsync(int count = 10);
    Task MarkAsReadAsync(string alertId);
    Task MarkMultipleAsReadAsync(IEnumerable<string> alertIds);
}
