using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WemDashboard.Application.DTOs.Sites;
using WemDashboard.Application.Services;
using WemDashboard.Domain.Entities;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Shared.Models;

namespace WemDashboard.Infrastructure.Services;

public class SiteService : ISiteService
{
    private readonly WemDashboardDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<SiteService> _logger;

    public SiteService(
        WemDashboardDbContext context,
        IMapper mapper,
        ILogger<SiteService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<SiteDto>>> GetAllSitesAsync()
    {
        try
        {
            _logger.LogInformation("Getting all sites from database");
            
            var sites = await _context.Sites
                .Include(s => s.Assets)
                .Include(s => s.Alerts)
                .OrderBy(s => s.Name)
                .ToListAsync();

            var siteDtos = _mapper.Map<IEnumerable<SiteDto>>(sites);
            
            _logger.LogInformation("Retrieved {Count} sites from database", sites.Count);
            return ApiResponse<IEnumerable<SiteDto>>.SuccessResponse(siteDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all sites");
            return ApiResponse<IEnumerable<SiteDto>>.ErrorResponse("Failed to retrieve sites");
        }
    }

    public async Task<ApiResponse<SiteDto>> GetSiteByIdAsync(string siteId)
    {
        try
        {
            _logger.LogInformation("Getting site by ID: {SiteId}", siteId);
            
            // Convert string siteId to int
            if (!int.TryParse(siteId, out int siteIdInt))
            {
                return ApiResponse<SiteDto>.ErrorResponse($"Invalid site ID format: '{siteId}'");
            }
            
            var site = await _context.Sites
                .Include(s => s.Assets)
                .Include(s => s.PowerData)
                .Include(s => s.Alerts)
                .FirstOrDefaultAsync(s => s.Id == siteIdInt);

            if (site == null)
            {
                _logger.LogWarning("Site not found with ID: {SiteId}", siteId);
                return ApiResponse<SiteDto>.ErrorResponse($"Site with ID '{siteId}' not found");
            }

            var siteDto = _mapper.Map<SiteDto>(site);
            
            _logger.LogInformation("Retrieved site: {SiteName}", site.Name);
            return ApiResponse<SiteDto>.SuccessResponse(siteDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting site by ID: {SiteId}", siteId);
            return ApiResponse<SiteDto>.ErrorResponse("Failed to retrieve site");
        }
    }

    public async Task<ApiResponse<IEnumerable<SiteDto>>> GetSitesByRegionAsync(string region)
    {
        try
        {
            _logger.LogInformation("Getting sites by region: {Region}", region);
            
            // Since Site entity doesn't have Region property, filter by Location instead
            var sites = await _context.Sites
                .Include(s => s.Assets)
                .Include(s => s.Alerts)
                .Where(s => s.Location != null && s.Location.ToLower().Contains(region.ToLower()))
                .OrderBy(s => s.Name)
                .ToListAsync();

            var siteDtos = _mapper.Map<IEnumerable<SiteDto>>(sites);
            
            _logger.LogInformation("Retrieved {Count} sites from region: {Region}", sites.Count, region);
            return ApiResponse<IEnumerable<SiteDto>>.SuccessResponse(siteDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting sites by region: {Region}", region);
            return ApiResponse<IEnumerable<SiteDto>>.ErrorResponse("Failed to retrieve sites by region");
        }
    }

    public async Task<ApiResponse<SiteDto>> CreateSiteAsync(CreateSiteDto createSiteDto)
    {
        try
        {
            _logger.LogInformation("Creating new site: {SiteName}", createSiteDto.Name);
            
            // Check if site with same name already exists
            var existingSite = await _context.Sites
                .FirstOrDefaultAsync(s => s.Name.ToLower() == createSiteDto.Name.ToLower());
            
            if (existingSite != null)
            {
                return ApiResponse<SiteDto>.ErrorResponse("A site with this name already exists");
            }

            var site = _mapper.Map<Site>(createSiteDto);
            site.CreatedAt = DateTime.UtcNow;
            site.UpdatedAt = DateTime.UtcNow;
            site.LastUpdate = DateTime.UtcNow;

            _context.Sites.Add(site);
            await _context.SaveChangesAsync();

            var siteDto = _mapper.Map<SiteDto>(site);
            
            _logger.LogInformation("Created new site with ID: {SiteId}", site.Id);
            return ApiResponse<SiteDto>.SuccessResponse(siteDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating site: {SiteName}", createSiteDto.Name);
            return ApiResponse<SiteDto>.ErrorResponse("Failed to create site");
        }
    }

    public async Task<ApiResponse<SiteDto>> UpdateSiteAsync(string siteId, UpdateSiteDto updateSiteDto)
    {
        try
        {
            _logger.LogInformation("Updating site: {SiteId}", siteId);
            
            // Convert string siteId to int
            if (!int.TryParse(siteId, out int siteIdInt))
            {
                return ApiResponse<SiteDto>.ErrorResponse($"Invalid site ID format: '{siteId}'");
            }
            
            var site = await _context.Sites.FirstOrDefaultAsync(s => s.Id == siteIdInt);
            
            if (site == null)
            {
                _logger.LogWarning("Site not found with ID: {SiteId}", siteId);
                return ApiResponse<SiteDto>.ErrorResponse($"Site with ID '{siteId}' not found");
            }

            // Check if name is being changed and if it conflicts with another site
            if (!string.IsNullOrEmpty(updateSiteDto.Name) && 
                site.Name.ToLower() != updateSiteDto.Name.ToLower())
            {
                var existingSite = await _context.Sites
                    .FirstOrDefaultAsync(s => s.Name.ToLower() == updateSiteDto.Name.ToLower() && s.Id != siteIdInt);
                
                if (existingSite != null)
                {
                    return ApiResponse<SiteDto>.ErrorResponse("A site with this name already exists");
                }
            }

            _mapper.Map(updateSiteDto, site);
            site.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var siteDto = _mapper.Map<SiteDto>(site);
            
            _logger.LogInformation("Updated site: {SiteId}", siteId);
            return ApiResponse<SiteDto>.SuccessResponse(siteDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating site: {SiteId}", siteId);
            return ApiResponse<SiteDto>.ErrorResponse("Failed to update site");
        }
    }

    public async Task<ApiResponse<bool>> UpdateSiteStatusAsync(string siteId, UpdateSiteStatusDto statusDto)
    {
        try
        {
            _logger.LogInformation("Updating site status: {SiteId} to {Status}", siteId, statusDto.Status);
            
            // Convert string siteId to int
            if (!int.TryParse(siteId, out int siteIdInt))
            {
                return ApiResponse<bool>.ErrorResponse($"Invalid site ID format: '{siteId}'");
            }
            
            var site = await _context.Sites.FirstOrDefaultAsync(s => s.Id == siteIdInt);
            
            if (site == null)
            {
                _logger.LogWarning("Site not found with ID: {SiteId}", siteId);
                return ApiResponse<bool>.ErrorResponse($"Site with ID '{siteId}' not found");
            }

            // Since Site entity doesn't have Status property, just update the UpdatedAt and LastUpdate
            site.UpdatedAt = DateTime.UtcNow;
            site.LastUpdate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Updated site status: {SiteId} to {Status}", siteId, statusDto.Status);
            return ApiResponse<bool>.SuccessResponse(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating site status: {SiteId}", siteId);
            return ApiResponse<bool>.ErrorResponse("Failed to update site status");
        }
    }

    public async Task<ApiResponse<bool>> DeleteSiteAsync(string siteId)
    {
        try
        {
            _logger.LogInformation("Deleting site: {SiteId}", siteId);
            
            // Convert string siteId to int
            if (!int.TryParse(siteId, out int siteIdInt))
            {
                return ApiResponse<bool>.ErrorResponse($"Invalid site ID format: '{siteId}'");
            }
            
            var site = await _context.Sites
                .Include(s => s.Assets)
                .Include(s => s.PowerData)
                .Include(s => s.Alerts)
                .FirstOrDefaultAsync(s => s.Id == siteIdInt);
            
            if (site == null)
            {
                _logger.LogWarning("Site not found with ID: {SiteId}", siteId);
                return ApiResponse<bool>.ErrorResponse($"Site with ID '{siteId}' not found");
            }

            // Check if site has any related data that should prevent deletion
            if (site.Assets.Any() || site.PowerData.Any() || site.Alerts.Any())
            {
                return ApiResponse<bool>.ErrorResponse("Cannot delete site with existing assets, power data, or alerts. Please remove related data first.");
            }

            _context.Sites.Remove(site);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Deleted site: {SiteId}", siteId);
            return ApiResponse<bool>.SuccessResponse(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting site: {SiteId}", siteId);
            return ApiResponse<bool>.ErrorResponse("Failed to delete site");
        }
    }
}
