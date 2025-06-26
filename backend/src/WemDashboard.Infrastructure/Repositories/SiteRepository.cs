using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class SiteRepository : Repository<Site>, ISiteRepository
{
    public SiteRepository(WemDashboardDbContext context) : base(context)
    {
    }

    public async Task<Site?> GetSiteWithAssetsAsync(string siteId)
    {
        return await _dbSet
            .Where(s => s.Id == siteId)
            .Include(s => s.Assets)
            .FirstOrDefaultAsync();
    }

    public async Task<Site?> GetSiteWithPowerDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _dbSet
            .Where(s => s.Id == siteId)
            .Include(s => s.PowerData.Where(pd => 
                (!fromDate.HasValue || pd.Time >= fromDate.Value) &&
                (!toDate.HasValue || pd.Time <= toDate.Value)
            ).OrderByDescending(pd => pd.Time));

        return await query.FirstOrDefaultAsync();
    }

    public async Task<Site?> GetSiteWithAlertsAsync(string siteId)
    {
        return await _dbSet
            .Where(s => s.Id == siteId)
            .Include(s => s.Alerts.OrderByDescending(a => a.Timestamp))
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Site>> GetSitesByRegionAsync(string region)
    {
        return await _dbSet
            .Where(s => s.Region == region)
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Site>> GetSitesByStatusAsync(SiteStatus status)
    {
        return await _dbSet
            .Where(s => s.Status == status)
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Site?> GetSiteWithAllDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _dbSet
            .Where(s => s.Id == siteId)
            .Include(s => s.Assets)
            .Include(s => s.Alerts.OrderByDescending(a => a.Timestamp))
            .Include(s => s.PowerData.Where(pd => 
                (!fromDate.HasValue || pd.Time >= fromDate.Value) &&
                (!toDate.HasValue || pd.Time <= toDate.Value)
            ).OrderByDescending(pd => pd.Time));

        return await query.FirstOrDefaultAsync();
    }

    // Additional helper methods
    public async Task<IEnumerable<Site>> GetSitesWithAlertsAsync()
    {
        return await _dbSet
            .Where(s => s.Alerts.Any(a => !a.IsRead))
            .Include(s => s.Assets)
            .Include(s => s.Alerts.Where(a => !a.IsRead))
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Site>> GetActiveSitesAsync()
    {
        return await _dbSet
            .Where(s => s.Status == SiteStatus.Online)
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }
}
