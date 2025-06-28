using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class FilterPresetRepository : IFilterPresetRepository
{
    private readonly WemDashboardDbContext _context;

    public FilterPresetRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FilterPreset>> GetByUserIdAsync(string userId)
    {
        return await _context.FilterPresets
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.PageName)
            .ThenBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<FilterPreset>> GetByUserAndPageAsync(string userId, string pageName)
    {
        return await _context.FilterPresets
            .Where(p => p.UserId == userId && p.PageName == pageName)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<FilterPreset?> GetByIdAsync(int id)
    {
        return await _context.FilterPresets
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<FilterPreset?> GetDefaultPresetAsync(string userId, string pageName)
    {
        return await _context.FilterPresets
            .FirstOrDefaultAsync(p => p.UserId == userId && p.PageName == pageName && p.IsDefault);
    }

    public async Task<FilterPreset> CreateAsync(FilterPreset preset)
    {
        _context.FilterPresets.Add(preset);
        await _context.SaveChangesAsync();
        return preset;
    }

    public async Task<FilterPreset> UpdateAsync(FilterPreset preset)
    {
        _context.FilterPresets.Update(preset);
        await _context.SaveChangesAsync();
        return preset;
    }

    public async Task DeleteAsync(int id)
    {
        var preset = await GetByIdAsync(id);
        if (preset != null)
        {
            _context.FilterPresets.Remove(preset);
            await _context.SaveChangesAsync();
        }
    }

    public async Task SetAsDefaultAsync(int presetId, string userId, string pageName)
    {
        // First, unset all defaults for this user/page combination
        var existingDefaults = await _context.FilterPresets
            .Where(p => p.UserId == userId && p.PageName == pageName && p.IsDefault)
            .ToListAsync();

        foreach (var existing in existingDefaults)
        {
            existing.IsDefault = false;
        }

        // Set the new default
        var newDefault = await GetByIdAsync(presetId);
        if (newDefault != null && newDefault.UserId == userId && newDefault.PageName == pageName)
        {
            newDefault.IsDefault = true;
        }

        await _context.SaveChangesAsync();
    }
}