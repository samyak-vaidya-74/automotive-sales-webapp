using Microsoft.EntityFrameworkCore;
using VehicleCatalogService.Models;

namespace VehicleCatalogService.Data
{
    public class CatalogDbContext : DbContext
    {
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // FIXED: Explicitly map the List<string> to a PostgreSQL Text Array
            // This ensures EnsureCreated() builds the correct column type
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.ImageUrls)
                .HasColumnType("text[]");

            // Optional: Indexing the SellerEmail for faster "My Listings" queries
            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.SellerEmail);
        }
    }
}
