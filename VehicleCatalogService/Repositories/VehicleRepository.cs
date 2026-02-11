using Microsoft.EntityFrameworkCore;
using VehicleCatalogService.Data;
using VehicleCatalogService.Models;

namespace VehicleCatalogService.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly CatalogDbContext _context;

        public VehicleRepository(CatalogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync(
            string? make = null,
            string? fuelType = null,
            string? transmission = null,
            int? maxMileage = null)
        {
            var query = _context.Vehicles.AsQueryable();

            if (!string.IsNullOrEmpty(make))
                query = query.Where(v => v.Make == make);

            if (!string.IsNullOrEmpty(fuelType))
                query = query.Where(v => v.FuelType == fuelType);

            if (!string.IsNullOrEmpty(transmission))
                query = query.Where(v => v.Transmission == transmission);

            if (maxMileage.HasValue)
                query = query.Where(v => v.Mileage <= maxMileage.Value);

            return await query.ToListAsync();
        }

        public async Task<Vehicle?> GetVehicleByIdAsync(int id) => await _context.Vehicles.FindAsync(id);

        public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
        {
            await _context.Vehicles.AddAsync(vehicle);
            return vehicle;
        }

        public async Task<bool> SaveChangesAsync() => (await _context.SaveChangesAsync()) >= 0;
    }
}
