using FluentValidation;
using WemDashboard.Application.DTOs;

namespace WemDashboard.Application.Validators;

public class CreateAssetValidator : AbstractValidator<CreateAssetDto>
{
    public CreateAssetValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Asset name is required")
            .MaximumLength(100).WithMessage("Asset name must not exceed 100 characters");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Asset type is required")
            .Must(BeValidAssetType).WithMessage("Asset type must be 'inverter', 'battery', 'solar_panel', or 'wind_turbine'");

        RuleFor(x => x.SiteId)
            .NotEmpty().WithMessage("Site ID is required");

        RuleFor(x => x.Power)
            .NotEmpty().WithMessage("Power specification is required")
            .MaximumLength(50).WithMessage("Power specification must not exceed 50 characters");

        RuleFor(x => x.Efficiency)
            .NotEmpty().WithMessage("Efficiency specification is required")
            .MaximumLength(20).WithMessage("Efficiency specification must not exceed 20 characters");
    }

    private static bool BeValidAssetType(string type)
    {
        return type.ToLower() is "inverter" or "battery" or "solar_panel" or "wind_turbine";
    }
}

public class UpdateAssetValidator : AbstractValidator<UpdateAssetDto>
{
    public UpdateAssetValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Asset name must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Status)
            .Must(BeValidAssetStatus).WithMessage("Status must be 'online', 'charging', 'warning', 'maintenance', or 'offline'")
            .When(x => !string.IsNullOrEmpty(x.Status));

        RuleFor(x => x.Power)
            .MaximumLength(50).WithMessage("Power specification must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Power));

        RuleFor(x => x.Efficiency)
            .MaximumLength(20).WithMessage("Efficiency specification must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.Efficiency));
    }

    private static bool BeValidAssetStatus(string status)
    {
        return status.ToLower() is "online" or "charging" or "warning" or "maintenance" or "offline";
    }
}
