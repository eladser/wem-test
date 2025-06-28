using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class GridComponentConfigurationRepository : IGridComponentConfigurationRepository
{
    private readonly WemDashboardDbContext _context;

    public GridComponentConfigurationRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GridComponentConfiguration>> GetByUserIdAsync(string userId)
    {
        return await _context.GridComponentConfigurations
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.ComponentType)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<GridComponentConfiguration>> GetBySiteIdAsync(string userId, int siteId)
    {
        return await _context.GridComponentConfigurations
            .Where(c => c.UserId == userId && c.SiteId == siteId)
            .OrderBy(c => c.ComponentType)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<GridComponentConfiguration?> GetByIdAsync(int id)
    {
        return await _context.GridComponentConfigurations
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<GridComponentConfiguration?> GetByComponentIdAsync(string userId, string componentId)
    {
        return await _context.GridComponentConfigurations
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ComponentId == componentId);
    }

    public async Task<GridComponentConfiguration> CreateAsync(GridComponentConfiguration component)
    {
        _context.GridComponentConfigurations.Add(component);
        await _context.SaveChangesAsync();
        return component;
    }

    public async Task<GridComponentConfiguration> UpdateAsync(GridComponentConfiguration component)
    {
        _context.GridComponentConfigurations.Update(component);
        await _context.SaveChangesAsync();
        return component;
    }

    public async Task DeleteAsync(int id)
    {
        var component = await GetByIdAsync(id);
        if (component != null)
        {
            _context.GridComponentConfigurations.Remove(component);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByComponentIdAsync(string userId, string componentId)
    {
        var component = await GetByComponentIdAsync(userId, componentId);
        if (component != null)
        {
            _context.GridComponentConfigurations.Remove(component);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<GridComponentConfiguration>> BulkUpdateAsync(IEnumerable<GridComponentConfiguration> components)
    {
        _context.GridComponentConfigurations.UpdateRange(components);
        await _context.SaveChangesAsync();
        return components;
    }
}