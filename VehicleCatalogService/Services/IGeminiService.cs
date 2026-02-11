namespace VehicleCatalogService.Services
{
    public interface IGeminiService
    {
        Task<string> GetVehicleInsightsAsync(string make, string model, string year, string description);
    }
}
