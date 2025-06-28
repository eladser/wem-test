using AutoMapper;
using System.Text.Json;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Application.Services;

public interface IViewStateService
{
    Task<T?> GetViewStateAsync<T>(string userId, string pageName, string stateKey) where T : class;
    Task SetViewStateAsync<T>(string userId, string pageName, string stateKey, T value, DateTime? expiresAt = null, bool isPersistent = true) where T : class;
    Task DeleteViewStateAsync(string userId, string pageName, string stateKey);
    Task<Dictionary<string, T>> GetPageStatesAsync<T>(string userId, string pageName) where T : class;
    Task DeleteExpiredStatesAsync();
    Task<Dictionary<string, object>> GetAllPageStatesAsync(string userId, string pageName);
}

public class ViewStateService : IViewStateService
{
    private readonly IViewStateRepository _repository;
    private readonly JsonSerializerOptions _jsonOptions;

    public ViewStateService(IViewStateRepository repository)
    {
        _repository = repository;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public async Task<T?> GetViewStateAsync<T>(string userId, string pageName, string stateKey) where T : class
    {
        var viewState = await _repository.GetByStateKeyAsync(userId, pageName, stateKey);
        if (viewState == null || string.IsNullOrEmpty(viewState.StateValue))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<T>(viewState.StateValue, _jsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    public async Task SetViewStateAsync<T>(string userId, string pageName, string stateKey, T value, DateTime? expiresAt = null, bool isPersistent = true) where T : class
    {
        var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
        
        var viewState = new ViewState
        {
            UserId = userId,
            PageName = pageName,
            StateKey = stateKey,
            StateValue = serializedValue,
            ExpiresAt = expiresAt,
            IsPersistent = isPersistent
        };

        await _repository.CreateOrUpdateAsync(viewState);
    }

    public async Task DeleteViewStateAsync(string userId, string pageName, string stateKey)
    {
        await _repository.DeleteByStateKeyAsync(userId, pageName, stateKey);
    }

    public async Task<Dictionary<string, T>> GetPageStatesAsync<T>(string userId, string pageName) where T : class
    {
        var viewStates = await _repository.GetPageStatesAsync(userId, pageName);
        var result = new Dictionary<string, T>();

        foreach (var kvp in viewStates)
        {
            try
            {
                var value = JsonSerializer.Deserialize<T>(kvp.Value.StateValue, _jsonOptions);
                if (value != null)
                {
                    result[kvp.Key] = value;
                }
            }
            catch (JsonException)
            {
                // Skip invalid JSON
            }
        }

        return result;
    }

    public async Task<Dictionary<string, object>> GetAllPageStatesAsync(string userId, string pageName)
    {
        var viewStates = await _repository.GetPageStatesAsync(userId, pageName);
        var result = new Dictionary<string, object>();

        foreach (var kvp in viewStates)
        {
            try
            {
                var value = JsonSerializer.Deserialize<object>(kvp.Value.StateValue, _jsonOptions);
                if (value != null)
                {
                    result[kvp.Key] = value;
                }
            }
            catch (JsonException)
            {
                // Skip invalid JSON
            }
        }

        return result;
    }

    public async Task DeleteExpiredStatesAsync()
    {
        await _repository.DeleteExpiredStatesAsync();
    }
}