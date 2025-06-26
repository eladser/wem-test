using WemDashboard.Application.DTOs;
using WemDashboard.Shared.Models;

namespace WemDashboard.Application.Services;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto, string ipAddress);
    Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string token, string ipAddress);
    Task<ApiResponse<bool>> RevokeTokenAsync(string token, string ipAddress);
    Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto registerDto);
    Task<ApiResponse<bool>> LogoutAsync(string userId);
}
