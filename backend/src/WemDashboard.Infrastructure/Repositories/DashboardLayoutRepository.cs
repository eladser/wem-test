using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class DashboardLayoutRepository : IDashboardLayoutRepository
{
    private readonly WemDashboardDbContext _context;

    public DashboardLayoutRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DashboardLayout>> GetByUserIdAsync(string userId)
    {
        return await _context.DashboardLayouts
            .Where(l => l.UserId == userId)
            .OrderBy(l => l.PageName)
            .ThenBy(l => l.LayoutName)
            .ToListAsync();
    }

    public async Task<IEnumerable<DashboardLayout>> GetByUserAndPageAsync(string userId, string pageName)
    {
        return await _context.DashboardLayouts
            .Where(l => l.UserId == userId && l.PageName == pageName)
            .OrderBy(l => l.LayoutName)
            .ToListAsync();
    }

    public async Task<DashboardLayout?> GetByIdAsync(int id)
    {
        return await _context.DashboardLayouts
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<DashboardLayout?> GetDefaultLayoutAsync(string userId, string pageName)
    {
        return await _context.DashboardLayouts
            .FirstOrDefaultAsync(l => l.UserId == userId && l.PageName == pageName && l.IsDefault);
    }

    public async Task<DashboardLayout> CreateAsync(DashboardLayout layout)
    {
        _context.DashboardLayouts.Add(layout);
        await _context.SaveChangesAsync();
        return layout;
    }

    public async Task<DashboardLayout> UpdateAsync(DashboardLayout layout)
    {
        _context.DashboardLayouts.Update(layout);
        await _context.SaveChangesAsync();
        return layout;
    }

    public async Task DeleteAsync(int id)
    {
        var layout = await GetByIdAsync(id);
        if (layout != null)
        {
            _context.DashboardLayouts.Remove(layout);
            await _context.SaveChangesAsync();
        }
    }

    public async Task SetAsDefaultAsync(int layoutId, string userId, string pageName)
    {
        // First, unset all defaults for this user/page combination
        var existingDefaults = await _context.DashboardLayouts
            .Where(l => l.UserId == userId && l.PageName == pageName && l.IsDefault)
            .ToListAsync();

        foreach (var existing in existingDefaults)
        {
            existing.IsDefault = false;
        }

        // Set the new default
        var newDefault = await GetByIdAsync(layoutId);
        if (newDefault != null && newDefault.UserId == userId && newDefault.PageName == pageName)
        {
            newDefault.IsDefault = true;
        }

        await _context.SaveChangesAsync();
    }
}