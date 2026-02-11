using VehicleCatalogService.Models;

namespace VehicleCatalogService.Repositories
{
    public interface IVehicleRepository
    {
        // Added parameters to support advanced filtering from the UI
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync(
            string? make = null,
            string? fuelType = null,
            string? transmission = null,
            int? maxMileage = null);

        Task<Vehicle?> GetVehicleByIdAsync(int id);
        Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
        Task<bool> SaveChangesAsync();
    }
}
