using Microsoft.EntityFrameworkCore.Storage;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly WemDashboardDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(WemDashboardDbContext context)
    {
        _context = context;
        Sites = new SiteRepository(_context);
        Assets = new AssetRepository(_context);
        PowerData = new PowerDataRepository(_context);
        Alerts = new AlertRepository(_context);
        Users = new UserRepository(_context);
    }

    public ISiteRepository Sites { get; }
    public IAssetRepository Assets { get; }
    public IPowerDataRepository PowerData { get; }
    public IAlertRepository Alerts { get; }
    public IUserRepository Users { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
