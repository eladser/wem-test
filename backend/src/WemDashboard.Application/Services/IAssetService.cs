using WemDashboard.Application.DTOs.Assets;
using WemDashboard.Shared.Models;

namespace WemDashboard.Application.Services;

public interface IAssetService
{
    Task<ApiResponse<IEnumerable<AssetDto>>> GetAllAssetsAsync();
    Task<ApiResponse<AssetDto>> GetAssetByIdAsync(string assetId);
    Task<ApiResponse<IEnumerable<AssetDto>>> GetAssetsBySiteIdAsync(string siteId);
    Task<ApiResponse<AssetDto>> CreateAssetAsync(CreateAssetDto createAssetDto);
    Task<ApiResponse<AssetDto>> UpdateAssetAsync(string assetId, UpdateAssetDto updateAssetDto);
    Task<ApiResponse<bool>> DeleteAssetAsync(string assetId);
}
