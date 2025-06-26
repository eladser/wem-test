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

    public async Task<IEnumerable<PowerData>> GetPowerDataBySiteIdAsync(string siteId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _dbSet.Where(p => p.SiteId == siteId);

        if (startDate.HasValue)
            query = query.Where(p => p.Time >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.Time <= endDate.Value);

        return await query
            .Include(p => p.Site)
            .OrderBy(p => p.Time)
            .ToListAsync();
    }

    public async Task<IEnumerable<PowerData>> GetLatestPowerDataAsync(string siteId, int count = 24)
    {
        return await _dbSet
            .Where(p => p.SiteId == siteId)
            .Include(p => p.Site)
            .OrderByDescending(p => p.Time)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<PowerData>> GetPowerDataByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(p => p.Time >= startDate && p.Time <= endDate)
            .Include(p => p.Site)
            .OrderBy(p => p.Time)
            .ToListAsync();
    }

    public async Task<double> GetTotalEnergyBySiteAsync(string siteId, DateTime startDate, DateTime endDate)
    {
        var powerData = await _dbSet
            .Where(p => p.SiteId == siteId && p.Time >= startDate && p.Time <= endDate)
            .ToListAsync();

        return powerData.Sum(p => p.Solar + p.Battery + (p.Wind ?? 0));
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
