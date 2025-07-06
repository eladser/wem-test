using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetUserWithRefreshTokensAsync(string userId);
    Task<bool> EmailExistsAsync(string email);
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
}
