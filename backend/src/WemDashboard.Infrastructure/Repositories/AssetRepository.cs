using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class AssetRepository : Repository<Asset>, IAssetRepository
{
    public AssetRepository(WemDashboardDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Asset>> GetAssetsBySiteIdAsync(string siteId)
    {
        // Convert string siteId to int for comparison
        if (!int.TryParse(siteId, out int siteIdInt))
            return new List<Asset>();

        return await _dbSet
            .Where(a => a.SiteId == siteIdInt)
            .Include(a => a.Site)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetAssetsByTypeAsync(AssetType type)
    {
        return await _dbSet
            .Where(a => a.Type == type)
            .Include(a => a.Site)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetAssetsByStatusAsync(AssetStatus status)
    {
        return await _dbSet
            .Where(a => a.Status == status)
            .Include(a => a.Site)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetAssetsBySiteAndTypeAsync(string siteId, AssetType type)
    {
        // Convert string siteId to int for comparison
        if (!int.TryParse(siteId, out int siteIdInt))
            return new List<Asset>();

        return await _dbSet
            .Where(a => a.SiteId == siteIdInt && a.Type == type)
            .Include(a => a.Site)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }
}
