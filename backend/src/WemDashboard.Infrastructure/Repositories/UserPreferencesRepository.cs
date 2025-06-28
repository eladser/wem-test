using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class UserPreferencesRepository : IUserPreferencesRepository
{
    private readonly WemDashboardDbContext _context;

    public UserPreferencesRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<UserPreferences?> GetByUserIdAsync(string userId)
    {
        return await _context.UserPreferences
            .FirstOrDefaultAsync(up => up.UserId == userId);
    }

    public async Task<UserPreferences> CreateAsync(UserPreferences preferences)
    {
        _context.UserPreferences.Add(preferences);
        await _context.SaveChangesAsync();
        return preferences;
    }

    public async Task<UserPreferences> UpdateAsync(UserPreferences preferences)
    {
        _context.UserPreferences.Update(preferences);
        await _context.SaveChangesAsync();
        return preferences;
    }

    public async Task DeleteAsync(string userId)
    {
        var preferences = await GetByUserIdAsync(userId);
        if (preferences != null)
        {
            _context.UserPreferences.Remove(preferences);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string userId)
    {
        return await _context.UserPreferences
            .AnyAsync(up => up.UserId == userId);
    }
}
