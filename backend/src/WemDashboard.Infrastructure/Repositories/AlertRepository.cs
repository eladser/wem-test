using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class AlertRepository : Repository<Alert>, IAlertRepository
{
    public AlertRepository(WemDashboardDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Alert>> GetAlertsBySiteIdAsync(string siteId)
    {
        return await _dbSet
            .Where(a => a.SiteId == siteId)
            .Include(a => a.Site)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetAlertsByTypeAsync(AlertType type)
    {
        return await _dbSet
            .Where(a => a.Type == type)
            .Include(a => a.Site)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetUnreadAlertsAsync()
    {
        return await _dbSet
            .Where(a => !a.IsRead)
            .Include(a => a.Site)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetUnreadAlertsBySiteIdAsync(string siteId)
    {
        return await _dbSet
            .Where(a => a.SiteId == siteId && !a.IsRead)
            .Include(a => a.Site)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetRecentAlertsAsync(int count = 10)
    {
        return await _dbSet
            .Include(a => a.Site)
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(string alertId)
    {
        var alert = await _dbSet.FindAsync(alertId);
        if (alert != null)
        {
            alert.IsRead = true;
            _dbSet.Update(alert);
        }
    }

    public async Task MarkMultipleAsReadAsync(IEnumerable<string> alertIds)
    {
        var alerts = await _dbSet
            .Where(a => alertIds.Contains(a.Id))
            .ToListAsync();
        
        foreach (var alert in alerts)
        {
            alert.IsRead = true;
        }
        
        _dbSet.UpdateRange(alerts);
    }
}
