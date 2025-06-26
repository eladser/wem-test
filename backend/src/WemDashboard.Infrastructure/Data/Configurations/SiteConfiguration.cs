using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class SiteConfiguration : IEntityTypeConfiguration<Site>
{
    public void Configure(EntityTypeBuilder<Site> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Id)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(s => s.Name)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Property(s => s.Location)
            .HasMaxLength(200)
            .IsRequired();
        
        builder.Property(s => s.Region)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(s => s.Status)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(s => s.TotalCapacity)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(s => s.CurrentOutput)
            .HasPrecision(10, 2)
            .IsRequired();
        
        builder.Property(s => s.Efficiency)
            .HasPrecision(5, 2)
            .IsRequired();
        
        builder.Property(s => s.CreatedAt)
            .IsRequired();
        
        builder.Property(s => s.UpdatedAt)
            .IsRequired();
        
        builder.Property(s => s.LastUpdate)
            .IsRequired();
        
        // Relationships
        builder.HasMany(s => s.Assets)
            .WithOne(a => a.Site)
            .HasForeignKey(a => a.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(s => s.PowerData)
            .WithOne(p => p.Site)
            .HasForeignKey(p => p.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(s => s.Alerts)
            .WithOne(a => a.Site)
            .HasForeignKey(a => a.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Indexes
        builder.HasIndex(s => s.Region);
        builder.HasIndex(s => s.Status);
        builder.HasIndex(s => s.CreatedAt);
    }
}
