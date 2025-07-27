using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.Id)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(a => a.Name)
            .HasMaxLength(100)
            .IsRequired();
        
        builder.Property(a => a.Type)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(a => a.SiteId)
            .IsRequired();
        
        builder.Property(a => a.Status)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(a => a.Power)
            .HasMaxLength(50)
            .IsRequired();
        
        builder.Property(a => a.Efficiency)
            .HasMaxLength(20)
            .IsRequired();
        
        builder.Property(a => a.CreatedAt)
            .IsRequired();
        
        builder.Property(a => a.UpdatedAt)
            .IsRequired();
        
        builder.Property(a => a.LastUpdate)
            .IsRequired();

        // Configure foreign key relationship
        builder.HasOne(a => a.Site)
            .WithMany(s => s.Assets)
            .HasForeignKey(a => a.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Indexes
        builder.HasIndex(a => a.SiteId);
        builder.HasIndex(a => a.Type);
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.CreatedAt);
    }
}
