using VehicleCatalogService.Models;

namespace VehicleCatalogService.Repositories
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync(
            string? make = null,
            string? fuelType = null,
            string? transmission = null,
            int? maxMileage = null);

        // NEW: Fetch listings belonging to a specific seller
        Task<IEnumerable<Vehicle>> GetVehiclesBySellerAsync(string sellerEmail);

        Task<Vehicle?> GetVehicleByIdAsync(int id);

        Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);

        // NEW: Method to remove a vehicle
        Task DeleteVehicleAsync(int id);

        Task<bool> SaveChangesAsync();
    }
}
