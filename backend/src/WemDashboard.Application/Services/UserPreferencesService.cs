using AutoMapper;
using WemDashboard.Application.DTOs;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Application.Services;

public interface IUserPreferencesService
{
    Task<UserPreferencesDto?> GetUserPreferencesAsync(string userId);
    Task<UserPreferencesDto> CreateUserPreferencesAsync(UserPreferencesDto preferences);
    Task<UserPreferencesDto> UpdateUserPreferencesAsync(UserPreferencesDto preferences);
    Task DeleteUserPreferencesAsync(string userId);
    Task<UserPreferencesDto> GetOrCreateDefaultPreferencesAsync(string userId);
}

public class UserPreferencesService : IUserPreferencesService
{
    private readonly IUserPreferencesRepository _repository;
    private readonly IMapper _mapper;

    public UserPreferencesService(IUserPreferencesRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<UserPreferencesDto?> GetUserPreferencesAsync(string userId)
    {
        var preferences = await _repository.GetByUserIdAsync(userId);
        return preferences != null ? _mapper.Map<UserPreferencesDto>(preferences) : null;
    }

    public async Task<UserPreferencesDto> CreateUserPreferencesAsync(UserPreferencesDto preferences)
    {
        var entity = _mapper.Map<UserPreferences>(preferences);
        var created = await _repository.CreateAsync(entity);
        return _mapper.Map<UserPreferencesDto>(created);
    }

    public async Task<UserPreferencesDto> UpdateUserPreferencesAsync(UserPreferencesDto preferences)
    {
        var entity = _mapper.Map<UserPreferences>(preferences);
        var updated = await _repository.UpdateAsync(entity);
        return _mapper.Map<UserPreferencesDto>(updated);
    }

    public async Task DeleteUserPreferencesAsync(string userId)
    {
        await _repository.DeleteAsync(userId);
    }

    public async Task<UserPreferencesDto> GetOrCreateDefaultPreferencesAsync(string userId)
    {
        var existing = await GetUserPreferencesAsync(userId);
        if (existing != null)
        {
            return existing;
        }

        // Create default preferences
        var defaultPreferences = new UserPreferencesDto
        {
            UserId = userId,
            Theme = "dark",
            Language = "en",
            TimeZone = "UTC",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await CreateUserPreferencesAsync(defaultPreferences);
    }
}