using VehicleCatalogService.Models.DTOs;

namespace VehicleCatalogService.Validators
{
    public static class VehicleValidator
    {
        public static bool IsValid(VehicleCreateDto dto, out string error)
        {
            error = "";
            if (dto.Price <= 0) error = "Price must be greater than zero.";
            if (dto.Year < 1886 || dto.Year > DateTime.Now.Year + 1) error = "Invalid vehicle year.";
            return string.IsNullOrEmpty(error);
        }
    }
}
