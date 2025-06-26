using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class PowerDataRepository : Repository<PowerData>, IPowerDataRepository
{
    public PowerDataRepository(WemDashboardDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<PowerData>> GetPowerDataBySiteIdAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _dbSet.Where(p => p.SiteId == siteId);

        if (fromDate.HasValue)
            query = query.Where(p => p.Time >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(p => p.Time <= toDate.Value);

        return await query
            .Include(p => p.Site)
            .OrderBy(p => p.Time)
            .ToListAsync();
    }

    public async Task<IEnumerable<PowerData>> GetLatestPowerDataBySiteIdAsync(string siteId, int count = 24)
    {
        return await _dbSet
            .Where(p => p.SiteId == siteId)
            .Include(p => p.Site)
            .OrderByDescending(p => p.Time)
            .Take(count)
            .ToListAsync();
    }

    public async Task<PowerData?> GetLatestPowerDataForSiteAsync(string siteId)
    {
        return await _dbSet
            .Where(p => p.SiteId == siteId)
            .Include(p => p.Site)
            .OrderByDescending(p => p.Time)
            .FirstOrDefaultAsync();
    }

    public async Task<double> GetTotalEnergyForSiteAsync(string siteId, DateTime fromDate, DateTime toDate)
    {
        var powerData = await _dbSet
            .Where(p => p.SiteId == siteId && p.Time >= fromDate && p.Time <= toDate)
            .ToListAsync();

        return powerData.Sum(p => p.Solar + p.Battery + (p.Wind ?? 0));
    }

    public async Task<double> GetAverageEfficiencyForSiteAsync(string siteId, DateTime fromDate, DateTime toDate)
    {
        var powerData = await _dbSet
            .Where(p => p.SiteId == siteId && p.Time >= fromDate && p.Time <= toDate)
            .ToListAsync();

        if (!powerData.Any())
            return 0;

        // Calculate efficiency as percentage of actual output vs demand
        var totalDemand = powerData.Sum(p => p.Demand);
        var totalGenerated = powerData.Sum(p => p.Solar + p.Battery + (p.Wind ?? 0));

        if (totalDemand == 0)
            return 0;

        return Math.Min(100, (totalGenerated / totalDemand) * 100);
    }

    // Additional helper methods for backward compatibility
    public async Task<IEnumerable<PowerData>> GetPowerDataByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(p => p.Time >= startDate && p.Time <= endDate)
            .Include(p => p.Site)
            .OrderBy(p => p.Time)
            .ToListAsync();
    }

    public async Task<IEnumerable<PowerData>> GetRecentPowerDataAsync(int hours = 24)
    {
        var cutoffTime = DateTime.UtcNow.AddHours(-hours);
        return await _dbSet
            .Where(p => p.Time >= cutoffTime)
            .Include(p => p.Site)
            .OrderByDescending(p => p.Time)
            .ToListAsync();
    }
}
