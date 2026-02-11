using Microsoft.AspNetCore.Mvc;
using VehicleCatalogService.Services;

namespace VehicleCatalogService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InsightsController : ControllerBase
    {
        private readonly IGeminiService _gemini;
        public InsightsController(IGeminiService gemini) => _gemini = gemini;

        [HttpGet("analyze")]
        public async Task<IActionResult> GetAnalysis(string make, string model, int year, string desc)
        {
            var result = await _gemini.GetVehicleInsightsAsync(make, model, year.ToString(), desc);
            return Ok(new { insights = result });
        }
    }
}
