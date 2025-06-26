using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class AlertConfiguration : IEntityTypeConfiguration<Alert>
{
    public void Configure(EntityTypeBuilder<Alert> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.Id)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(a => a.Type)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(a => a.Message)
            .HasMaxLength(500)
            .IsRequired();
        
        builder.Property(a => a.SiteId)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(a => a.Timestamp)
            .IsRequired();
        
        builder.Property(a => a.IsRead)
            .HasDefaultValue(false)
            .IsRequired();
        
        builder.Property(a => a.CreatedAt)
            .IsRequired();
        
        // Indexes
        builder.HasIndex(a => a.SiteId);
        builder.HasIndex(a => a.Type);
        builder.HasIndex(a => a.IsRead);
        builder.HasIndex(a => a.Timestamp);
        builder.HasIndex(a => a.CreatedAt);
    }
}
