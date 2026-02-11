using Microsoft.AspNetCore.Mvc;
using VehicleCatalogService.Models;
using VehicleCatalogService.Models.DTOs;
using VehicleCatalogService.Repositories;
using VehicleCatalogService.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace VehicleCatalogService.Controllers
{
    public class CompareRequestDto { public List<int> VehicleIds { get; set; } = new(); }

    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleRepository _repo;
        private readonly ICloudinaryService _cloudinary;
        private readonly IGeminiService _gemini;

        public VehicleController(IVehicleRepository repo, ICloudinaryService cloudinary, IGeminiService gemini)
        {
            _repo = repo;
            _cloudinary = cloudinary;
            _gemini = gemini;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles([FromQuery] string? make, [FromQuery] string? fuelType, [FromQuery] string? transmission, [FromQuery] int? maxMileage)
            => Ok(await _repo.GetAllVehiclesAsync(make, fuelType, transmission, maxMileage));

        [HttpGet("my-listings")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetMyListings()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            return email == null ? Unauthorized() : Ok(await _repo.GetVehiclesBySellerAsync(email));
        }

        // --- NEW: Comparative AI for Favorites ---
        [HttpPost("compare-ai")]
        public async Task<ActionResult> CompareVehicles([FromBody] CompareRequestDto request)
        {
            var vehicles = new List<Vehicle>();
            foreach (var id in request.VehicleIds)
            {
                var v = await _repo.GetVehicleByIdAsync(id);
                if (v != null) vehicles.Add(v);
            }

            if (vehicles.Count < 2) return BadRequest("Select at least 2 cars to compare.");

            var details = string.Join(" | ", vehicles.Select(v => $"{v.Year} {v.Make} {v.Model} (${v.Price}, {v.Mileage} miles)"));

            // Refined Prompt for Comparative Pros & Cons
            var prompt = $"Act as a car expert. Compare these favorited vehicles: {details}. " +
                         "Provide a concise 'Pros & Cons' comparison for each and crown a final 'Value Winner'.";

            var aiReport = await _gemini.GetVehicleInsightsAsync("Comparison", "Report", "Multiple", prompt);
            return Ok(new { report = aiReport });
        }

        // --- NEW: Portfolio AI for Seller Dashboard ---
        [HttpGet("portfolio-ai")]
        [Authorize]
        public async Task<ActionResult> GetPortfolioAi()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return Unauthorized();

            var myCars = await _repo.GetVehiclesBySellerAsync(email);
            if (!myCars.Any()) return BadRequest("No listings found to analyze.");

            var inventorySummary = string.Join(", ", myCars.Select(c => $"{c.Year} {c.Make} {c.Model}"));
            var prompt = $"Analyze my current car sales portfolio: {inventorySummary}. " +
                         "Provide a 3-sentence executive summary on my inventory's market appeal and pricing strategy.";

            var portfolioReport = await _gemini.GetVehicleInsightsAsync("Portfolio", "Analysis", "Seller", prompt);
            return Ok(new { report = portfolioReport });
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Vehicle>> CreateVehicle([FromForm] VehicleCreateDto dto, List<IFormFile> images)
        {
            var uploadedUrls = new List<string>();
            foreach (var file in images)
            {
                var url = await _cloudinary.UploadImageAsync(file);
                uploadedUrls.Add(url);
            }

            var aiAnalysis = await _gemini.GetVehicleInsightsAsync(dto.Make, dto.Model, dto.Year.ToString(), dto.Description);

            var vehicle = new Vehicle
            {
                Make = dto.Make,
                Model = dto.Model,
                Year = dto.Year,
                Price = dto.Price,
                Mileage = dto.Mileage,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                BodyStyle = dto.BodyStyle,
                Description = dto.Description,
                Vin = dto.Vin,
                ImageUrls = uploadedUrls,
                AiAnalysis = aiAnalysis,
                SellerEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Unknown"
            };

            await _repo.CreateVehicleAsync(vehicle);
            await _repo.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVehicles), new { id = vehicle.Id }, vehicle);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var v = await _repo.GetVehicleByIdAsync(id);
            if (v == null) return NotFound();
            if (v.SellerEmail != User.FindFirstValue(ClaimTypes.Email)) return Forbid();

            await _repo.DeleteVehicleAsync(id);
            await _repo.SaveChangesAsync();
            return NoContent();
        }
    }
}
