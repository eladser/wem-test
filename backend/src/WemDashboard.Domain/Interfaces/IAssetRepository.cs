using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IAssetRepository : IRepository<Asset>
{
    Task<IEnumerable<Asset>> GetAssetsBySiteIdAsync(string siteId);
    Task<IEnumerable<Asset>> GetAssetsByTypeAsync(AssetType type);
    Task<IEnumerable<Asset>> GetAssetsByStatusAsync(AssetStatus status);
    Task<IEnumerable<Asset>> GetAssetsBySiteAndTypeAsync(string siteId, AssetType type);
}
