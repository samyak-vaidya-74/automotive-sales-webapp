using System.ComponentModel.DataAnnotations;

namespace VehicleCatalogService.Models.DTOs
{
    public class VehicleCreateDto
    {
        [Required] public string Make { get; set; } = string.Empty;
        [Required] public string Model { get; set; } = string.Empty;
        [Required] public int Year { get; set; }
        [Required] public decimal Price { get; set; }

        // --- NEW FILTERING FIELDS ---
        [Required] public int Mileage { get; set; }
        [Required] public string FuelType { get; set; } = string.Empty;
        [Required] public string Transmission { get; set; } = string.Empty;
        [Required] public string BodyStyle { get; set; } = string.Empty;
        // ----------------------------

        public string? Description { get; set; } = string.Empty;
        public string? Vin { get; set; } = string.Empty;
    }
}
