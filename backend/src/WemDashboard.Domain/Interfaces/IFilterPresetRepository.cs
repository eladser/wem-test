using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IFilterPresetRepository
{
    Task<IEnumerable<FilterPreset>> GetByUserIdAsync(string userId);
    Task<IEnumerable<FilterPreset>> GetByUserAndPageAsync(string userId, string pageName);
    Task<FilterPreset?> GetByIdAsync(int id);
    Task<FilterPreset?> GetDefaultPresetAsync(string userId, string pageName);
    Task<FilterPreset> CreateAsync(FilterPreset preset);
    Task<FilterPreset> UpdateAsync(FilterPreset preset);
    Task DeleteAsync(int id);
    Task SetAsDefaultAsync(int presetId, string userId, string pageName);
}