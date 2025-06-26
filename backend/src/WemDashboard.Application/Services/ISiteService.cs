using WemDashboard.Application.DTOs.Sites;
using WemDashboard.Shared.Models;

namespace WemDashboard.Application.Services;

public interface ISiteService
{
    Task<ApiResponse<IEnumerable<SiteDto>>> GetAllSitesAsync();
    Task<ApiResponse<SiteDto>> GetSiteByIdAsync(string siteId);
    Task<ApiResponse<IEnumerable<SiteDto>>> GetSitesByRegionAsync(string region);
    Task<ApiResponse<SiteDto>> CreateSiteAsync(CreateSiteDto createSiteDto);
    Task<ApiResponse<SiteDto>> UpdateSiteAsync(string siteId, UpdateSiteDto updateSiteDto);
    Task<ApiResponse<bool>> UpdateSiteStatusAsync(string siteId, UpdateSiteStatusDto statusDto);
    Task<ApiResponse<bool>> DeleteSiteAsync(string siteId);
}
