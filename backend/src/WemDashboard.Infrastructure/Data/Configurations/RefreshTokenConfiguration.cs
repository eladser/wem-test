using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(rt => rt.Id);
        
        builder.Property(rt => rt.Token)
            .HasMaxLength(255)
            .IsRequired();
        
        builder.Property(rt => rt.Expires)
            .IsRequired();
        
        builder.Property(rt => rt.Created)
            .IsRequired();
        
        builder.Property(rt => rt.CreatedByIp)
            .HasMaxLength(45)
            .IsRequired();
        
        builder.Property(rt => rt.RevokedByIp)
            .HasMaxLength(45);
        
        builder.Property(rt => rt.ReplacedByToken)
            .HasMaxLength(255);
        
        builder.Property(rt => rt.UserId)
            .HasMaxLength(50)
            .IsRequired();
        
        // Indexes
        builder.HasIndex(rt => rt.Token)
            .IsUnique();
        builder.HasIndex(rt => rt.UserId);
        builder.HasIndex(rt => rt.Expires);
        builder.HasIndex(rt => rt.Created);
    }
}
