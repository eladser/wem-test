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
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return new List<Alert>();

        return await _dbSet
            .Where(a => a.SiteId == siteIdInt)
            .Include(a => a.Site)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetAlertsByTypeAsync(AlertType type)
    {
        // Since Alert entity doesn't have Type property, filter by Severity instead
        string severityFilter = type.ToString();
        return await _dbSet
            .Where(a => a.Severity == severityFilter)
            .Include(a => a.Site)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetUnreadAlertsAsync()
    {
        // Since Alert entity doesn't have IsRead property, filter by Status instead
        return await _dbSet
            .Where(a => a.Status != "Resolved")
            .Include(a => a.Site)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetUnreadAlertsBySiteIdAsync(string siteId)
    {
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return new List<Alert>();

        return await _dbSet
            .Where(a => a.SiteId == siteIdInt && a.Status != "Resolved")
            .Include(a => a.Site)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Alert>> GetRecentAlertsAsync(int count = 10)
    {
        return await _dbSet
            .Include(a => a.Site)
            .OrderByDescending(a => a.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(string alertId)
    {
        // Convert string alertId to int
        if (!int.TryParse(alertId, out int alertIdInt))
            return;

        var alert = await _dbSet.FindAsync(alertIdInt);
        if (alert != null)
        {
            alert.Status = "Resolved";
            alert.ResolvedAt = DateTime.UtcNow;
            alert.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(alert);
        }
    }

    public async Task MarkMultipleAsReadAsync(IEnumerable<string> alertIds)
    {
        // Convert string IDs to int IDs
        var intIds = alertIds
            .Where(id => int.TryParse(id, out _))
            .Select(int.Parse)
            .ToList();

        var alerts = await _dbSet
            .Where(a => intIds.Contains(a.Id))
            .ToListAsync();
        
        foreach (var alert in alerts)
        {
            alert.Status = "Resolved";
            alert.ResolvedAt = DateTime.UtcNow;
            alert.UpdatedAt = DateTime.UtcNow;
        }
        
        _dbSet.UpdateRange(alerts);
    }
}
