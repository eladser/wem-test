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

    public async Task<IEnumerable<Site>> GetSitesWithAlertsAsync()
    {
        return await _dbSet
            .Where(s => s.Alerts.Any(a => !a.IsRead))
            .Include(s => s.Assets)
            .Include(s => s.Alerts.Where(a => !a.IsRead))
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Site?> GetSiteWithDetailsAsync(string siteId)
    {
        return await _dbSet
            .Where(s => s.Id == siteId)
            .Include(s => s.Assets)
            .Include(s => s.Alerts.OrderByDescending(a => a.Timestamp).Take(10))
            .Include(s => s.PowerData.OrderByDescending(p => p.Time).Take(24))
            .FirstOrDefaultAsync();
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
