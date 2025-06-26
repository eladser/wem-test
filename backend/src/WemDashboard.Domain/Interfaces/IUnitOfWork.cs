namespace WemDashboard.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ISiteRepository Sites { get; }
    IAssetRepository Assets { get; }
    IPowerDataRepository PowerData { get; }
    IAlertRepository Alerts { get; }
    IUserRepository Users { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
