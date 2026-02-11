using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleCatalogService.Data;

namespace VehicleCatalogService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly CatalogDbContext _context;
        public AnalyticsController(CatalogDbContext context) => _context = context;

        [HttpGet("seller-stats/{email}")]
        public async Task<IActionResult> GetSellerStats(string email)
        {
            var count = await _context.Vehicles.CountAsync(v => v.SellerEmail == email);
            return Ok(new { TotalListings = count });
        }
    }
}
