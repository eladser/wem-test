using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IDashboardLayoutRepository
{
    Task<IEnumerable<DashboardLayout>> GetByUserIdAsync(string userId);
    Task<IEnumerable<DashboardLayout>> GetByUserAndPageAsync(string userId, string pageName);
    Task<DashboardLayout?> GetByIdAsync(int id);
    Task<DashboardLayout?> GetDefaultLayoutAsync(string userId, string pageName);
    Task<DashboardLayout> CreateAsync(DashboardLayout layout);
    Task<DashboardLayout> UpdateAsync(DashboardLayout layout);
    Task DeleteAsync(int id);
    Task SetAsDefaultAsync(int layoutId, string userId, string pageName);
}