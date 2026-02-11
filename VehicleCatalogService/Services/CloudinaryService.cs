using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace VehicleCatalogService.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0) return string.Empty;

                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    // "fill" ensures all marketplace images look uniform
                    Transformation = new Transformation().Height(500).Width(800).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception($"Cloudinary Error: {uploadResult.Error.Message}");
                }

                return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                // This logs the real error to your Docker terminal
                Console.WriteLine($"[Cloudinary Failure]: {ex.Message}");
                throw;
            }
        }
    }
}
