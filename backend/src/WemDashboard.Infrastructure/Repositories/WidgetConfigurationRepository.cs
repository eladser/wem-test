using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class WidgetConfigurationRepository : IWidgetConfigurationRepository
{
    private readonly WemDashboardDbContext _context;

    public WidgetConfigurationRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WidgetConfiguration>> GetByUserIdAsync(string userId)
    {
        return await _context.WidgetConfigurations
            .Where(w => w.UserId == userId)
            .OrderBy(w => w.PageName)
            .ThenBy(w => w.Y)
            .ThenBy(w => w.X)
            .ToListAsync();
    }

    public async Task<IEnumerable<WidgetConfiguration>> GetByLayoutIdAsync(int layoutId)
    {
        return await _context.WidgetConfigurations
            .Where(w => w.DashboardLayoutId == layoutId)
            .OrderBy(w => w.Y)
            .ThenBy(w => w.X)
            .ToListAsync();
    }

    public async Task<IEnumerable<WidgetConfiguration>> GetByUserAndPageAsync(string userId, string pageName)
    {
        return await _context.WidgetConfigurations
            .Where(w => w.UserId == userId && w.PageName == pageName)
            .OrderBy(w => w.Y)
            .ThenBy(w => w.X)
            .ToListAsync();
    }

    public async Task<WidgetConfiguration?> GetByIdAsync(int id)
    {
        return await _context.WidgetConfigurations
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<WidgetConfiguration?> GetByWidgetIdAsync(string userId, string widgetId)
    {
        return await _context.WidgetConfigurations
            .FirstOrDefaultAsync(w => w.UserId == userId && w.WidgetId == widgetId);
    }

    public async Task<WidgetConfiguration> CreateAsync(WidgetConfiguration widget)
    {
        _context.WidgetConfigurations.Add(widget);
        await _context.SaveChangesAsync();
        return widget;
    }

    public async Task<WidgetConfiguration> UpdateAsync(WidgetConfiguration widget)
    {
        _context.WidgetConfigurations.Update(widget);
        await _context.SaveChangesAsync();
        return widget;
    }

    public async Task DeleteAsync(int id)
    {
        var widget = await GetByIdAsync(id);
        if (widget != null)
        {
            _context.WidgetConfigurations.Remove(widget);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByWidgetIdAsync(string userId, string widgetId)
    {
        var widget = await GetByWidgetIdAsync(userId, widgetId);
        if (widget != null)
        {
            _context.WidgetConfigurations.Remove(widget);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<WidgetConfiguration>> BulkUpdateAsync(IEnumerable<WidgetConfiguration> widgets)
    {
        _context.WidgetConfigurations.UpdateRange(widgets);
        await _context.SaveChangesAsync();
        return widgets;
    }
}