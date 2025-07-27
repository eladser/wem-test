using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class PowerDataConfiguration : IEntityTypeConfiguration<PowerData>
{
    public void Configure(EntityTypeBuilder<PowerData> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.SiteId)
            .IsRequired();
        
        builder.Property(p => p.Time)
            .IsRequired();
        
        builder.Property(p => p.Solar)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(p => p.Battery)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(p => p.Grid)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(p => p.Demand)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(p => p.Wind)
            .HasPrecision(10, 2);
        
        builder.Property(p => p.CreatedAt)
            .IsRequired();

        // Configure foreign key relationship
        builder.HasOne(p => p.Site)
            .WithMany(s => s.PowerData)
            .HasForeignKey(p => p.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Indexes
        builder.HasIndex(p => p.SiteId);
        builder.HasIndex(p => p.Time);
        builder.HasIndex(p => new { p.SiteId, p.Time });
        builder.HasIndex(p => p.CreatedAt);
    }
}
