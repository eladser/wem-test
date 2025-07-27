using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class SiteConfiguration : IEntityTypeConfiguration<Site>
{
    public void Configure(EntityTypeBuilder<Site> builder)
    {
        builder.ToTable("Sites");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.Property(e => e.Location)
            .HasMaxLength(500);

        builder.Property(e => e.CreatedAt)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(e => e.LastUpdate)
            .HasColumnType("timestamp with time zone");

        // Relationships
        builder.HasMany(e => e.Devices)
            .WithOne(d => d.Site)
            .HasForeignKey(d => d.SiteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Alerts)
            .WithOne(a => a.Site)
            .HasForeignKey(a => a.SiteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Assets)
            .WithOne(a => a.Site)
            .HasForeignKey(a => a.SiteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.PowerData)
            .WithOne(p => p.Site)
            .HasForeignKey(p => p.SiteId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => e.Name).IsUnique();
        builder.HasIndex(e => e.Location);
        builder.HasIndex(e => e.CreatedAt);
    }
}
