using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Domain.Interfaces;

public interface ISiteRepository : IRepository<Site>
{
    Task<Site?> GetSiteWithAssetsAsync(string siteId);
    Task<Site?> GetSiteWithPowerDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null);
    Task<Site?> GetSiteWithAlertsAsync(string siteId);
    Task<IEnumerable<Site>> GetSitesByRegionAsync(string region);
    Task<IEnumerable<Site>> GetSitesByStatusAsync(SiteStatus status);
    Task<Site?> GetSiteWithAllDataAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null);
}
