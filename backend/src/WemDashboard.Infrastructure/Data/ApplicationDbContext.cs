// This is an alias for WemDashboardDbContext to maintain compatibility
// with the LogService which expects ApplicationDbContext

using Microsoft.EntityFrameworkCore;

namespace WemDashboard.Infrastructure.Data
{
    // Create an alias for ApplicationDbContext
    public class ApplicationDbContext : WemDashboardDbContext
    {
        public ApplicationDbContext(DbContextOptions<WemDashboardDbContext> options) : base(options)
        {
        }
    }
}