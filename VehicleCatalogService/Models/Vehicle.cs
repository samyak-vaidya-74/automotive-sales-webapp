using System;
using System.ComponentModel.DataAnnotations;

namespace VehicleCatalogService.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Make { get; set; } = string.Empty;

        [Required]
        public string Model { get; set; } = string.Empty;

        [Required]
        public int Year { get; set; }

        [Required]
        public decimal Price { get; set; }

        // --- NEW FILTERING FIELDS ---
        [Required]
        public int Mileage { get; set; }

        [Required]
        public string FuelType { get; set; } = "Petrol"; // Petrol, Diesel, EV, Hybrid

        [Required]
        public string Transmission { get; set; } = "Manual"; // Automatic, Manual

        [Required]
        public string BodyStyle { get; set; } = "Sedan"; // SUV, Sedan, Hatchback, etc.
        // ----------------------------

        public string Description { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public string Vin { get; set; } = string.Empty;

        [Required]
        public string SellerEmail { get; set; } = string.Empty;

        public DateTime ListedAt { get; set; } = DateTime.UtcNow;

        public string? AiAnalysis { get; set; }
    }
}
