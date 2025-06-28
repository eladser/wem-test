using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IReportTemplateRepository
{
    Task<IEnumerable<ReportTemplate>> GetByUserIdAsync(string userId);
    Task<IEnumerable<ReportTemplate>> GetByReportTypeAsync(string userId, string reportType);
    Task<ReportTemplate?> GetByIdAsync(int id);
    Task<ReportTemplate> CreateAsync(ReportTemplate template);
    Task<ReportTemplate> UpdateAsync(ReportTemplate template);
    Task DeleteAsync(int id);
    Task<IEnumerable<ReportTemplate>> GetScheduledTemplatesAsync();
}