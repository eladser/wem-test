using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IPowerDataRepository : IRepository<PowerData>
{
    Task<IEnumerable<PowerData>> GetPowerDataBySiteIdAsync(string siteId, DateTime? fromDate = null, DateTime? toDate = null);
    Task<IEnumerable<PowerData>> GetLatestPowerDataBySiteIdAsync(string siteId, int count = 24);
    Task<PowerData?> GetLatestPowerDataForSiteAsync(string siteId);
    Task<double> GetTotalEnergyForSiteAsync(string siteId, DateTime fromDate, DateTime toDate);
    Task<double> GetAverageEfficiencyForSiteAsync(string siteId, DateTime fromDate, DateTime toDate);
}
