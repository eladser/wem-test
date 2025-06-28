using WemDashboard.Domain.Entities;

namespace WemDashboard.Domain.Interfaces;

public interface IEnergyFlowConfigurationRepository
{
    Task<IEnumerable<EnergyFlowConfiguration>> GetByUserIdAsync(string userId);
    Task<IEnumerable<EnergyFlowConfiguration>> GetBySiteIdAsync(string userId, int siteId);
    Task<EnergyFlowConfiguration?> GetByIdAsync(int id);
    Task<EnergyFlowConfiguration?> GetByFlowIdAsync(string userId, string flowId);
    Task<EnergyFlowConfiguration> CreateAsync(EnergyFlowConfiguration flow);
    Task<EnergyFlowConfiguration> UpdateAsync(EnergyFlowConfiguration flow);
    Task DeleteAsync(int id);
    Task DeleteByFlowIdAsync(string userId, string flowId);
    Task<IEnumerable<EnergyFlowConfiguration>> BulkUpdateAsync(IEnumerable<EnergyFlowConfiguration> flows);
}