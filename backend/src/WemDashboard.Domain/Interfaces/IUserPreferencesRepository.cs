using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IUserPreferencesRepository
{
    Task<UserPreferences?> GetByUserIdAsync(string userId);
    Task<UserPreferences> CreateAsync(UserPreferences preferences);
    Task<UserPreferences> UpdateAsync(UserPreferences preferences);
    Task DeleteAsync(string userId);
    Task<bool> ExistsAsync(string userId);
}