using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class LogEntryConfiguration : IEntityTypeConfiguration<LogEntry>
{
    public void Configure(EntityTypeBuilder<LogEntry> builder)
    {
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Message)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(e => e.Level)
            .IsRequired();
            
        builder.Property(e => e.Timestamp)
            .IsRequired();
            
        builder.Property(e => e.Component)
            .HasMaxLength(100);
            
        builder.Property(e => e.UserId)
            .HasMaxLength(50);
            
        builder.Property(e => e.Url)
            .HasMaxLength(2000);
            
        builder.Property(e => e.UserAgent)
            .HasMaxLength(500);
            
        builder.Property(e => e.RequestId)
            .HasMaxLength(50);
            
        builder.Property(e => e.SessionId)
            .HasMaxLength(50);
            
        builder.Property(e => e.ErrorName)
            .HasMaxLength(200);
            
        builder.Property(e => e.ErrorMessage)
            .HasMaxLength(1000);
            
        builder.Property(e => e.Environment)
            .HasMaxLength(50);
            
        builder.Property(e => e.Application)
            .HasMaxLength(50)
            .HasDefaultValue("WemDashboard");
            
        builder.Property(e => e.Version)
            .HasMaxLength(20);
            
        builder.Property(e => e.RelatedEntityType)
            .HasMaxLength(100);
            
        builder.Property(e => e.RelatedEntityId)
            .HasMaxLength(100);
        
        // Indexes for better query performance
        builder.HasIndex(e => e.Level)
            .HasDatabaseName("IX_LogEntries_Level");
            
        builder.HasIndex(e => e.Timestamp)
            .HasDatabaseName("IX_LogEntries_Timestamp");
            
        builder.HasIndex(e => new { e.Level, e.Timestamp })
            .HasDatabaseName("IX_LogEntries_Level_Timestamp");
            
        builder.HasIndex(e => e.Component)
            .HasDatabaseName("IX_LogEntries_Component");
            
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("IX_LogEntries_UserId");
            
        builder.HasIndex(e => e.Date)
            .HasDatabaseName("IX_LogEntries_Date");
            
        builder.HasIndex(e => e.Environment)
            .HasDatabaseName("IX_LogEntries_Environment");
    }
}