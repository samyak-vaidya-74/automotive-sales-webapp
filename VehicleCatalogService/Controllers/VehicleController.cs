using Microsoft.AspNetCore.Mvc;
using VehicleCatalogService.Models;
using VehicleCatalogService.Models.DTOs;
using VehicleCatalogService.Repositories;
using VehicleCatalogService.Services;
using System.Security.Claims;

namespace VehicleCatalogService.Controllers
{
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
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles(
            [FromQuery] string? make,
            [FromQuery] string? fuelType,
            [FromQuery] string? transmission,
            [FromQuery] int? maxMileage)
        {
            return Ok(await _repo.GetAllVehiclesAsync(make, fuelType, transmission, maxMileage));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(int id)
        {
            var vehicle = await _repo.GetVehicleByIdAsync(id);
            return vehicle == null ? NotFound() : Ok(vehicle);
        }

        [HttpPost]
        public async Task<ActionResult<Vehicle>> CreateVehicle([FromForm] VehicleCreateDto dto, IFormFile image)
        {
            var imageUrl = await _cloudinary.UploadImageAsync(image);

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
                ImageUrl = imageUrl,
                AiAnalysis = aiAnalysis,
                SellerEmail = User.FindFirstValue(ClaimTypes.Email) ?? "Guest"
            };

            await _repo.CreateVehicleAsync(vehicle);
            await _repo.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }
    }
}
