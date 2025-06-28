using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Application.Services;

public interface IGridConfigurationService
{
    Task<IEnumerable<GridComponentConfigurationDto>> GetUserComponentsAsync(string userId);
    Task<IEnumerable<GridComponentConfigurationDto>> GetSiteComponentsAsync(string userId, int siteId);
    Task<GridComponentConfigurationDto?> GetComponentByIdAsync(int id);
    Task<GridComponentConfigurationDto?> GetComponentByComponentIdAsync(string userId, string componentId);
    Task<GridComponentConfigurationDto> CreateComponentAsync(GridComponentConfigurationDto component);
    Task<GridComponentConfigurationDto> UpdateComponentAsync(GridComponentConfigurationDto component);
    Task DeleteComponentAsync(int id);
    Task DeleteComponentByComponentIdAsync(string userId, string componentId);
    Task<IEnumerable<GridComponentConfigurationDto>> BulkUpdateComponentsAsync(IEnumerable<GridComponentConfigurationDto> components);
    
    Task<IEnumerable<EnergyFlowConfigurationDto>> GetUserFlowsAsync(string userId);
    Task<IEnumerable<EnergyFlowConfigurationDto>> GetSiteFlowsAsync(string userId, int siteId);
    Task<EnergyFlowConfigurationDto?> GetFlowByIdAsync(int id);
    Task<EnergyFlowConfigurationDto?> GetFlowByFlowIdAsync(string userId, string flowId);
    Task<EnergyFlowConfigurationDto> CreateFlowAsync(EnergyFlowConfigurationDto flow);
    Task<EnergyFlowConfigurationDto> UpdateFlowAsync(EnergyFlowConfigurationDto flow);
    Task DeleteFlowAsync(int id);
    Task DeleteFlowByFlowIdAsync(string userId, string flowId);
    Task<IEnumerable<EnergyFlowConfigurationDto>> BulkUpdateFlowsAsync(IEnumerable<EnergyFlowConfigurationDto> flows);
    
    Task<GridConfigurationDto> GetCompleteGridConfigurationAsync(string userId, int? siteId = null);
    Task<GridConfigurationDto> SaveCompleteGridConfigurationAsync(GridConfigurationDto gridConfig);
}

public class GridConfigurationDto
{
    public IEnumerable<GridComponentConfigurationDto> Components { get; set; } = new List<GridComponentConfigurationDto>();
    public IEnumerable<EnergyFlowConfigurationDto> Flows { get; set; } = new List<EnergyFlowConfigurationDto>();
    public string UserId { get; set; } = string.Empty;
    public int? SiteId { get; set; }
}

public class GridConfigurationService : IGridConfigurationService
{
    private readonly IGridComponentConfigurationRepository _componentRepository;
    private readonly IEnergyFlowConfigurationRepository _flowRepository;
    private readonly IMapper _mapper;

    public GridConfigurationService(
        IGridComponentConfigurationRepository componentRepository,
        IEnergyFlowConfigurationRepository flowRepository,
        IMapper mapper)
    {
        _componentRepository = componentRepository;
        _flowRepository = flowRepository;
        _mapper = mapper;
    }

    // Component methods
    public async Task<IEnumerable<GridComponentConfigurationDto>> GetUserComponentsAsync(string userId)
    {
        var components = await _componentRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<GridComponentConfigurationDto>>(components);
    }

    public async Task<IEnumerable<GridComponentConfigurationDto>> GetSiteComponentsAsync(string userId, int siteId)
    {
        var components = await _componentRepository.GetBySiteIdAsync(userId, siteId);
        return _mapper.Map<IEnumerable<GridComponentConfigurationDto>>(components);
    }

    public async Task<GridComponentConfigurationDto?> GetComponentByIdAsync(int id)
    {
        var component = await _componentRepository.GetByIdAsync(id);
        return component != null ? _mapper.Map<GridComponentConfigurationDto>(component) : null;
    }

    public async Task<GridComponentConfigurationDto?> GetComponentByComponentIdAsync(string userId, string componentId)
    {
        var component = await _componentRepository.GetByComponentIdAsync(userId, componentId);
        return component != null ? _mapper.Map<GridComponentConfigurationDto>(component) : null;
    }

    public async Task<GridComponentConfigurationDto> CreateComponentAsync(GridComponentConfigurationDto component)
    {
        var entity = _mapper.Map<GridComponentConfiguration>(component);
        var created = await _componentRepository.CreateAsync(entity);
        return _mapper.Map<GridComponentConfigurationDto>(created);
    }

    public async Task<GridComponentConfigurationDto> UpdateComponentAsync(GridComponentConfigurationDto component)
    {
        var entity = _mapper.Map<GridComponentConfiguration>(component);
        var updated = await _componentRepository.UpdateAsync(entity);
        return _mapper.Map<GridComponentConfigurationDto>(updated);
    }

    public async Task DeleteComponentAsync(int id)
    {
        await _componentRepository.DeleteAsync(id);
    }

    public async Task DeleteComponentByComponentIdAsync(string userId, string componentId)
    {
        await _componentRepository.DeleteByComponentIdAsync(userId, componentId);
    }

    public async Task<IEnumerable<GridComponentConfigurationDto>> BulkUpdateComponentsAsync(IEnumerable<GridComponentConfigurationDto> components)
    {
        var entities = _mapper.Map<IEnumerable<GridComponentConfiguration>>(components);
        var updated = await _componentRepository.BulkUpdateAsync(entities);
        return _mapper.Map<IEnumerable<GridComponentConfigurationDto>>(updated);
    }

    // Flow methods
    public async Task<IEnumerable<EnergyFlowConfigurationDto>> GetUserFlowsAsync(string userId)
    {
        var flows = await _flowRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<EnergyFlowConfigurationDto>>(flows);
    }

    public async Task<IEnumerable<EnergyFlowConfigurationDto>> GetSiteFlowsAsync(string userId, int siteId)
    {
        var flows = await _flowRepository.GetBySiteIdAsync(userId, siteId);
        return _mapper.Map<IEnumerable<EnergyFlowConfigurationDto>>(flows);
    }

    public async Task<EnergyFlowConfigurationDto?> GetFlowByIdAsync(int id)
    {
        var flow = await _flowRepository.GetByIdAsync(id);
        return flow != null ? _mapper.Map<EnergyFlowConfigurationDto>(flow) : null;
    }

    public async Task<EnergyFlowConfigurationDto?> GetFlowByFlowIdAsync(string userId, string flowId)
    {
        var flow = await _flowRepository.GetByFlowIdAsync(userId, flowId);
        return flow != null ? _mapper.Map<EnergyFlowConfigurationDto>(flow) : null;
    }

    public async Task<EnergyFlowConfigurationDto> CreateFlowAsync(EnergyFlowConfigurationDto flow)
    {
        var entity = _mapper.Map<EnergyFlowConfiguration>(flow);
        var created = await _flowRepository.CreateAsync(entity);
        return _mapper.Map<EnergyFlowConfigurationDto>(created);
    }

    public async Task<EnergyFlowConfigurationDto> UpdateFlowAsync(EnergyFlowConfigurationDto flow)
    {
        var entity = _mapper.Map<EnergyFlowConfiguration>(flow);
        var updated = await _flowRepository.UpdateAsync(entity);
        return _mapper.Map<EnergyFlowConfigurationDto>(updated);
    }

    public async Task DeleteFlowAsync(int id)
    {
        await _flowRepository.DeleteAsync(id);
    }

    public async Task DeleteFlowByFlowIdAsync(string userId, string flowId)
    {
        await _flowRepository.DeleteByFlowIdAsync(userId, flowId);
    }

    public async Task<IEnumerable<EnergyFlowConfigurationDto>> BulkUpdateFlowsAsync(IEnumerable<EnergyFlowConfigurationDto> flows)
    {
        var entities = _mapper.Map<IEnumerable<EnergyFlowConfiguration>>(flows);
        var updated = await _flowRepository.BulkUpdateAsync(entities);
        return _mapper.Map<IEnumerable<EnergyFlowConfigurationDto>>(updated);
    }

    // Complete grid configuration methods
    public async Task<GridConfigurationDto> GetCompleteGridConfigurationAsync(string userId, int? siteId = null)
    {
        var componentsTask = siteId.HasValue 
            ? GetSiteComponentsAsync(userId, siteId.Value)
            : GetUserComponentsAsync(userId);
            
        var flowsTask = siteId.HasValue 
            ? GetSiteFlowsAsync(userId, siteId.Value)
            : GetUserFlowsAsync(userId);

        var components = await componentsTask;
        var flows = await flowsTask;

        return new GridConfigurationDto
        {
            Components = components,
            Flows = flows,
            UserId = userId,
            SiteId = siteId
        };
    }

    public async Task<GridConfigurationDto> SaveCompleteGridConfigurationAsync(GridConfigurationDto gridConfig)
    {
        // Update components
        var updatedComponents = await BulkUpdateComponentsAsync(gridConfig.Components);
        
        // Update flows
        var updatedFlows = await BulkUpdateFlowsAsync(gridConfig.Flows);

        return new GridConfigurationDto
        {
            Components = updatedComponents,
            Flows = updatedFlows,
            UserId = gridConfig.UserId,
            SiteId = gridConfig.SiteId
        };
    }
}