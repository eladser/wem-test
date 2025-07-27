using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class EnergyFlowConfigurationRepository : IEnergyFlowConfigurationRepository
{
    private readonly WemDashboardDbContext _context;

    public EnergyFlowConfigurationRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EnergyFlowConfiguration>> GetByUserIdAsync(string userId)
    {
        return await _context.EnergyFlowConfigurations
            .Where(f => f.UserId == userId)
            .OrderBy(f => f.FromComponentId)
            .ThenBy(f => f.ToComponentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<EnergyFlowConfiguration>> GetBySiteIdAsync(string userId, string? siteId)
    {
        // Convert string siteId to int for comparison
        if (string.IsNullOrEmpty(siteId))
        {
            return await _context.EnergyFlowConfigurations
                .Where(f => f.UserId == userId && f.SiteId == null)
                .OrderBy(f => f.FromComponentId)
                .ThenBy(f => f.ToComponentId)
                .ToListAsync();
        }

        if (!int.TryParse(siteId, out int siteIdInt))
            return new List<EnergyFlowConfiguration>();

        return await _context.EnergyFlowConfigurations
            .Where(f => f.UserId == userId && f.SiteId == siteIdInt)
            .OrderBy(f => f.FromComponentId)
            .ThenBy(f => f.ToComponentId)
            .ToListAsync();
    }

    public async Task<EnergyFlowConfiguration?> GetByIdAsync(int id)
    {
        return await _context.EnergyFlowConfigurations
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<EnergyFlowConfiguration?> GetByFlowIdAsync(string userId, string flowId)
    {
        return await _context.EnergyFlowConfigurations
            .FirstOrDefaultAsync(f => f.UserId == userId && f.FlowId == flowId);
    }

    public async Task<EnergyFlowConfiguration> CreateAsync(EnergyFlowConfiguration flow)
    {
        _context.EnergyFlowConfigurations.Add(flow);
        await _context.SaveChangesAsync();
        return flow;
    }

    public async Task<EnergyFlowConfiguration> UpdateAsync(EnergyFlowConfiguration flow)
    {
        _context.EnergyFlowConfigurations.Update(flow);
        await _context.SaveChangesAsync();
        return flow;
    }

    public async Task DeleteAsync(int id)
    {
        var flow = await GetByIdAsync(id);
        if (flow != null)
        {
            _context.EnergyFlowConfigurations.Remove(flow);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByFlowIdAsync(string userId, string flowId)
    {
        var flow = await GetByFlowIdAsync(userId, flowId);
        if (flow != null)
        {
            _context.EnergyFlowConfigurations.Remove(flow);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<EnergyFlowConfiguration>> BulkUpdateAsync(IEnumerable<EnergyFlowConfiguration> flows)
    {
        _context.EnergyFlowConfigurations.UpdateRange(flows);
        await _context.SaveChangesAsync();
        return flows;
    }
}
