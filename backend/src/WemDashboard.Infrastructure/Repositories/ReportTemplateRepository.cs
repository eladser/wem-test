using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class ReportTemplateRepository : IReportTemplateRepository
{
    private readonly WemDashboardDbContext _context;

    public ReportTemplateRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReportTemplate>> GetByUserIdAsync(string userId)
    {
        return await _context.ReportTemplates
            .Where(t => t.UserId == userId)
            .OrderBy(t => t.ReportType)
            .ThenBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<ReportTemplate>> GetByReportTypeAsync(string userId, string reportType)
    {
        return await _context.ReportTemplates
            .Where(t => t.UserId == userId && t.ReportType == reportType)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<ReportTemplate?> GetByIdAsync(int id)
    {
        return await _context.ReportTemplates
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<ReportTemplate> CreateAsync(ReportTemplate template)
    {
        _context.ReportTemplates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<ReportTemplate> UpdateAsync(ReportTemplate template)
    {
        _context.ReportTemplates.Update(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task DeleteAsync(int id)
    {
        var template = await GetByIdAsync(id);
        if (template != null)
        {
            _context.ReportTemplates.Remove(template);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ReportTemplate>> GetScheduledTemplatesAsync()
    {
        return await _context.ReportTemplates
            .Where(t => t.IsScheduled && !string.IsNullOrEmpty(t.ScheduleCron))
            .OrderBy(t => t.Name)
            .ToListAsync();
    }
}