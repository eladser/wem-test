using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Application.Services;

public interface IDashboardLayoutService
{
    Task<IEnumerable<DashboardLayoutDto>> GetUserLayoutsAsync(string userId);
    Task<IEnumerable<DashboardLayoutDto>> GetPageLayoutsAsync(string userId, string pageName);
    Task<DashboardLayoutDto?> GetLayoutByIdAsync(int id);
    Task<DashboardLayoutDto?> GetDefaultLayoutAsync(string userId, string pageName);
    Task<DashboardLayoutDto> CreateLayoutAsync(DashboardLayoutDto layout);
    Task<DashboardLayoutDto> UpdateLayoutAsync(DashboardLayoutDto layout);
    Task DeleteLayoutAsync(int id);
    Task SetAsDefaultAsync(int layoutId, string userId, string pageName);
}

public class DashboardLayoutService : IDashboardLayoutService
{
    private readonly IDashboardLayoutRepository _repository;
    private readonly IMapper _mapper;

    public DashboardLayoutService(IDashboardLayoutRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DashboardLayoutDto>> GetUserLayoutsAsync(string userId)
    {
        var layouts = await _repository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<DashboardLayoutDto>>(layouts);
    }

    public async Task<IEnumerable<DashboardLayoutDto>> GetPageLayoutsAsync(string userId, string pageName)
    {
        var layouts = await _repository.GetByUserAndPageAsync(userId, pageName);
        return _mapper.Map<IEnumerable<DashboardLayoutDto>>(layouts);
    }

    public async Task<DashboardLayoutDto?> GetLayoutByIdAsync(int id)
    {
        var layout = await _repository.GetByIdAsync(id);
        return layout != null ? _mapper.Map<DashboardLayoutDto>(layout) : null;
    }

    public async Task<DashboardLayoutDto?> GetDefaultLayoutAsync(string userId, string pageName)
    {
        var layout = await _repository.GetDefaultLayoutAsync(userId, pageName);
        return layout != null ? _mapper.Map<DashboardLayoutDto>(layout) : null;
    }

    public async Task<DashboardLayoutDto> CreateLayoutAsync(DashboardLayoutDto layout)
    {
        var entity = _mapper.Map<DashboardLayout>(layout);
        var created = await _repository.CreateAsync(entity);
        return _mapper.Map<DashboardLayoutDto>(created);
    }

    public async Task<DashboardLayoutDto> UpdateLayoutAsync(DashboardLayoutDto layout)
    {
        var entity = _mapper.Map<DashboardLayout>(layout);
        var updated = await _repository.UpdateAsync(entity);
        return _mapper.Map<DashboardLayoutDto>(updated);
    }

    public async Task DeleteLayoutAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task SetAsDefaultAsync(int layoutId, string userId, string pageName)
    {
        await _repository.SetAsDefaultAsync(layoutId, userId, pageName);
    }
}