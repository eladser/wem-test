using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class ViewStateRepository : IViewStateRepository
{
    private readonly WemDashboardDbContext _context;

    public ViewStateRepository(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ViewState>> GetByUserIdAsync(string userId)
    {
        return await _context.ViewStates
            .Where(s => s.UserId == userId && (s.ExpiresAt == null || s.ExpiresAt > DateTime.UtcNow))
            .OrderBy(s => s.PageName)
            .ThenBy(s => s.StateKey)
            .ToListAsync();
    }

    public async Task<IEnumerable<ViewState>> GetByUserAndPageAsync(string userId, string pageName)
    {
        return await _context.ViewStates
            .Where(s => s.UserId == userId && s.PageName == pageName && (s.ExpiresAt == null || s.ExpiresAt > DateTime.UtcNow))
            .OrderBy(s => s.StateKey)
            .ToListAsync();
    }

    public async Task<ViewState?> GetByStateKeyAsync(string userId, string pageName, string stateKey)
    {
        return await _context.ViewStates
            .FirstOrDefaultAsync(s => s.UserId == userId && s.PageName == pageName && s.StateKey == stateKey && (s.ExpiresAt == null || s.ExpiresAt > DateTime.UtcNow));
    }

    public async Task<ViewState> CreateOrUpdateAsync(ViewState viewState)
    {
        var existing = await GetByStateKeyAsync(viewState.UserId, viewState.PageName, viewState.StateKey);
        
        if (existing != null)
        {
            existing.StateValue = viewState.StateValue;
            existing.ExpiresAt = viewState.ExpiresAt;
            existing.IsPersistent = viewState.IsPersistent;
            existing.UpdatedAt = DateTime.UtcNow;
            
            _context.ViewStates.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            _context.ViewStates.Add(viewState);
            await _context.SaveChangesAsync();
            return viewState;
        }
    }

    public async Task DeleteAsync(int id)
    {
        var viewState = await _context.ViewStates.FindAsync(id);
        if (viewState != null)
        {
            _context.ViewStates.Remove(viewState);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteByStateKeyAsync(string userId, string pageName, string stateKey)
    {
        var viewState = await GetByStateKeyAsync(userId, pageName, stateKey);
        if (viewState != null)
        {
            _context.ViewStates.Remove(viewState);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteExpiredStatesAsync()
    {
        var expiredStates = await _context.ViewStates
            .Where(s => s.ExpiresAt != null && s.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        if (expiredStates.Any())
        {
            _context.ViewStates.RemoveRange(expiredStates);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Dictionary<string, ViewState>> GetPageStatesAsync(string userId, string pageName)
    {
        var states = await GetByUserAndPageAsync(userId, pageName);
        return states.ToDictionary(s => s.StateKey, s => s);
    }
}