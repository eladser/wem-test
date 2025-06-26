using FluentValidation;
using WemDashboard.Application.DTOs;

namespace WemDashboard.Application.Validators;

public class CreateSiteValidator : AbstractValidator<CreateSiteDto>
{
    public CreateSiteValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Site name is required")
            .MaximumLength(100).WithMessage("Site name must not exceed 100 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required")
            .MaximumLength(200).WithMessage("Location must not exceed 200 characters");

        RuleFor(x => x.Region)
            .NotEmpty().WithMessage("Region is required")
            .MaximumLength(50).WithMessage("Region must not exceed 50 characters");

        RuleFor(x => x.TotalCapacity)
            .GreaterThan(0).WithMessage("Total capacity must be greater than 0");
    }
}

public class UpdateSiteValidator : AbstractValidator<UpdateSiteDto>
{
    public UpdateSiteValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Site name must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Location)
            .MaximumLength(200).WithMessage("Location must not exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.Region)
            .MaximumLength(50).WithMessage("Region must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Region));

        RuleFor(x => x.TotalCapacity)
            .GreaterThan(0).WithMessage("Total capacity must be greater than 0")
            .When(x => x.TotalCapacity.HasValue);

        RuleFor(x => x.CurrentOutput)
            .GreaterThanOrEqualTo(0).WithMessage("Current output must be greater than or equal to 0")
            .When(x => x.CurrentOutput.HasValue);

        RuleFor(x => x.Efficiency)
            .InclusiveBetween(0, 100).WithMessage("Efficiency must be between 0 and 100")
            .When(x => x.Efficiency.HasValue);
    }
}

public class UpdateSiteStatusValidator : AbstractValidator<UpdateSiteStatusDto>
{
    public UpdateSiteStatusValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(BeValidStatus).WithMessage("Status must be 'online', 'maintenance', or 'offline'");
    }

    private static bool BeValidStatus(string status)
    {
        return status.ToLower() is "online" or "maintenance" or "offline";
    }
}
