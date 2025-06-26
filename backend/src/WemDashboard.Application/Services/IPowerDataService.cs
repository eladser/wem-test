using WemDashboard.Application.DTOs.PowerData;
using WemDashboard.Shared.Models;

namespace WemDashboard.Application.Services;

public interface IPowerDataService
{
    Task<ApiResponse<IEnumerable<PowerDataDto>>> GetPowerDataAsync(PowerDataQueryDto query);
    Task<ApiResponse<PowerDataDto>> AddPowerDataAsync(CreatePowerDataDto createPowerDataDto);
    Task<ApiResponse<IEnumerable<PowerDataDto>>> GetLatestPowerDataAsync(string siteId, int count = 24);
    Task<ApiResponse<double>> GetTotalEnergyAsync(string siteId, DateTime fromDate, DateTime toDate);
}
