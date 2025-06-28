using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IGridComponentConfigurationRepository
{
    Task<IEnumerable<GridComponentConfiguration>> GetByUserIdAsync(string userId);
    Task<IEnumerable<GridComponentConfiguration>> GetBySiteIdAsync(string userId, int siteId);
    Task<GridComponentConfiguration?> GetByIdAsync(int id);
    Task<GridComponentConfiguration?> GetByComponentIdAsync(string userId, string componentId);
    Task<GridComponentConfiguration> CreateAsync(GridComponentConfiguration component);
    Task<GridComponentConfiguration> UpdateAsync(GridComponentConfiguration component);
    Task DeleteAsync(int id);
    Task DeleteByComponentIdAsync(string userId, string componentId);
    Task<IEnumerable<GridComponentConfiguration>> BulkUpdateAsync(IEnumerable<GridComponentConfiguration> components);
}