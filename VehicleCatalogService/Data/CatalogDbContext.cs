using Microsoft.EntityFrameworkCore;
using VehicleCatalogService.Models;

namespace VehicleCatalogService.Data
{
    public class CatalogDbContext : DbContext
    {
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }
    }
}
