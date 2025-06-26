using WemDashboard.Application.DTOs.Alerts;
using WemDashboard.Shared.Models;

namespace WemDashboard.Application.Services;

public interface IAlertService
{
    Task<ApiResponse<IEnumerable<AlertDto>>> GetAlertsBySiteIdAsync(string siteId);
    Task<ApiResponse<IEnumerable<AlertDto>>> GetUnreadAlertsAsync();
    Task<ApiResponse<IEnumerable<AlertDto>>> GetRecentAlertsAsync(int count = 10);
    Task<ApiResponse<AlertDto>> CreateAlertAsync(CreateAlertDto createAlertDto);
    Task<ApiResponse<bool>> MarkAsReadAsync(string alertId);
    Task<ApiResponse<bool>> MarkMultipleAsReadAsync(IEnumerable<string> alertIds);
}
