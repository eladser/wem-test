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
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return null;

        return await _dbSet
            .Where(s => s.Id == siteIdInt)
            .Include(s => s.Assets)
            .FirstOrDefaultAsync();
    }

    public async Task<Site?> GetSiteWithPowerDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return null;

        var query = _dbSet
            .Where(s => s.Id == siteIdInt)
            .Include(s => s.PowerData.Where(pd => 
                (!fromDate.HasValue || pd.Time >= fromDate.Value) &&
                (!toDate.HasValue || pd.Time <= toDate.Value)
            ).OrderByDescending(pd => pd.Time));

        return await query.FirstOrDefaultAsync();
    }

    public async Task<Site?> GetSiteWithAlertsAsync(string siteId)
    {
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return null;

        return await _dbSet
            .Where(s => s.Id == siteIdInt)
            .Include(s => s.Alerts.OrderByDescending(a => a.CreatedAt))
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Site>> GetSitesByRegionAsync(string region)
    {
        // Since Site entity doesn't have Region property, filter by Location instead
        return await _dbSet
            .Where(s => s.Location != null && s.Location.Contains(region))
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Site>> GetSitesByStatusAsync(string status)
    {
        // Since Site entity doesn't have Status property, return all sites for now
        // You might want to add a Status property to the Site entity or filter differently
        return await _dbSet
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Site?> GetSiteWithAllDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        // Convert string siteId to int
        if (!int.TryParse(siteId, out int siteIdInt))
            return null;

        var query = _dbSet
            .Where(s => s.Id == siteIdInt)
            .Include(s => s.Assets)
            .Include(s => s.Alerts.OrderByDescending(a => a.CreatedAt))
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
            .Where(s => s.Alerts.Any(a => a.Status != "Resolved"))
            .Include(s => s.Assets)
            .Include(s => s.Alerts.Where(a => a.Status != "Resolved"))
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Site>> GetActiveSitesAsync()
    {
        // Since Site entity doesn't have Status property, return all sites
        return await _dbSet
            .Include(s => s.Assets)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }
}
