using FluentValidation;
using WemDashboard.Application.DTOs.Assets;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.Validators;

public class CreateAssetValidator : AbstractValidator<CreateAssetDto>
{
    public CreateAssetValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Asset name is required")
            .MaximumLength(200).WithMessage("Asset name must not exceed 200 characters");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Asset type is required")
            .IsInEnum().WithMessage("Asset type must be a valid value");

        RuleFor(x => x.SiteId)
            .NotEmpty().WithMessage("Site ID is required");

        RuleFor(x => x.Power)
            .MaximumLength(50).WithMessage("Power specification must not exceed 50 characters");

        RuleFor(x => x.Efficiency)
            .MaximumLength(20).WithMessage("Efficiency specification must not exceed 20 characters");
    }
}

public class UpdateAssetValidator : AbstractValidator<UpdateAssetDto>
{
    public UpdateAssetValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(200).WithMessage("Asset name must not exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Asset type must be a valid value")
            .When(x => x.Type.HasValue);

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Asset status must be a valid value")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.Power)
            .MaximumLength(50).WithMessage("Power specification must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Power));

        RuleFor(x => x.Efficiency)
            .MaximumLength(20).WithMessage("Efficiency specification must not exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.Efficiency));
    }
}
