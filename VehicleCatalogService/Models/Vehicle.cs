using System.ComponentModel.DataAnnotations;

namespace VehicleCatalogService.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }

        [Required] public string Make { get; set; } = string.Empty;
        [Required] public string Model { get; set; } = string.Empty;
        [Required] public int Year { get; set; }
        [Required] public decimal Price { get; set; }
        [Required] public int Mileage { get; set; }
        [Required] public string FuelType { get; set; } = "Petrol";
        [Required] public string Transmission { get; set; } = "Manual";
        [Required] public string BodyStyle { get; set; } = "Sedan";

        public string Description { get; set; } = string.Empty;

        // UPDATED: Now supports a gallery of images
        [Column(TypeName = "text[]")]
        public List<string> ImageUrls { get; set; } = new();

        public string Vin { get; set; } = string.Empty;
        [Required] public string SellerEmail { get; set; } = string.Empty;
        public DateTime ListedAt { get; set; } = DateTime.UtcNow;
        public string? AiAnalysis { get; set; }
    }
}
