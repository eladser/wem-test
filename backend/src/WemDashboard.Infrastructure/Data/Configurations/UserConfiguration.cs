using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.Id)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(u => u.Email)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Property(u => u.PasswordHash)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Property(u => u.FirstName)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(u => u.LastName)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(u => u.Role)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(u => u.IsActive)
            .HasDefaultValue(true)
            .IsRequired();
        
        builder.Property(u => u.CreatedAt)
            .IsRequired();
        
        builder.Property(u => u.UpdatedAt)
            .IsRequired();
        
        builder.Property(u => u.LastLogin)
            .IsRequired();
        
        // Relationships
        builder.HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.User)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Indexes
        builder.HasIndex(u => u.Email)
            .IsUnique();
        builder.HasIndex(u => u.Role);
        builder.HasIndex(u => u.IsActive);
        builder.HasIndex(u => u.CreatedAt);
    }
}
