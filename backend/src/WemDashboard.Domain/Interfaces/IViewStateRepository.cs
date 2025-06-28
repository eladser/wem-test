using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IViewStateRepository
{
    Task<IEnumerable<ViewState>> GetByUserIdAsync(string userId);
    Task<IEnumerable<ViewState>> GetByUserAndPageAsync(string userId, string pageName);
    Task<ViewState?> GetByStateKeyAsync(string userId, string pageName, string stateKey);
    Task<ViewState> CreateOrUpdateAsync(ViewState viewState);
    Task DeleteAsync(int id);
    Task DeleteByStateKeyAsync(string userId, string pageName, string stateKey);
    Task DeleteExpiredStatesAsync();
    Task<Dictionary<string, ViewState>> GetPageStatesAsync(string userId, string pageName);
}