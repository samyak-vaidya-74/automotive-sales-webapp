using System.ComponentModel.DataAnnotations;

namespace VehicleCatalogService.Models
{
    public class Enquiry
    {
        [Key]
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string BuyerEmail { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
