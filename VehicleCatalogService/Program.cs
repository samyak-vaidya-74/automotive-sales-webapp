using Microsoft.EntityFrameworkCore;
using VehicleCatalogService.Data;
using VehicleCatalogService.Repositories;
using VehicleCatalogService.Services;
using CloudinaryDotNet;
using VehicleCatalogService.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text; // FIXED: Fixes 'Encoding' error
using Microsoft.IdentityModel.Tokens;

namespace VehicleCatalogService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. DB Context
            builder.Services.AddDbContext<CatalogDbContext>(opt =>
                opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            var jwtKey = builder.Configuration["JWT_KEY"]
                ?? throw new InvalidOperationException("JWT_KEY is missing");

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        // FIXED: Explicitly allow HMAC-SHA512 to match the User Service
                        ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 },
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["JWT_ISSUER"],
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["JWT_AUDIENCE"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            // 2. Cloudinary Config (using URL from .env)
            var cloudinaryUrl = builder.Configuration["CLOUDINARY_URL"];
            if (!string.IsNullOrEmpty(cloudinaryUrl))
            {
                builder.Services.AddSingleton(new Cloudinary(cloudinaryUrl));
            }

            // 3. Gemini AI Config
            builder.Services.AddHttpClient<IGeminiService, GeminiService>(client => {
                client.BaseAddress = new Uri("https://generativelanguage.googleapis.com");
            });

            // 4. DI Registrations
            builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
            builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
            builder.Services.AddScoped<IGeminiService, GeminiService>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // 5. CORS
            builder.Services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173", "http://localhost");
                });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
                int retries = 5;
                while (retries > 0)
                {
                    try
                    {
                        context.Database.EnsureCreated();

                        // --- FIXED: C# SEEDING LOGIC WITH DECIMAL LITERAL ---
                        if (!context.Vehicles.Any())
                        {
                            context.Vehicles.Add(new Vehicle
                            {
                                Make = "Tesla",
                                Model = "Model 3",
                                Year = 2023,
                                Price = 42000m,
                                Mileage = 8000,
                                FuelType = "EV",
                                Transmission = "Automatic",
                                BodyStyle = "Sedan",
                                SellerEmail = "admin@example.com",
                                Description = "Excellent condition.",
                                // FIXED: Change ImageUrl to ImageUrls and pass a new List
                                ImageUrls = new List<string> { "https://images.unsplash.com" },
                                AiAnalysis = "Gemini AI Review: High-value EV..."
                            });
                            context.SaveChanges();
                        }
                        // -----------------------------

                        Console.WriteLine("Catalog DB Ready!");
                        break;
                    }
                    catch (Exception ex)
                    {
                        retries--;
                        Console.WriteLine($"DB not ready, retrying... ({retries} left). Error: {ex.Message}");
                        Thread.Sleep(3000);
                    }
                }
            }

            app.Run();
        }
    }
}
