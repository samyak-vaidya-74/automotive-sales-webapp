using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UserGatewayService.Data;
using UserGatewayService.Services;

namespace UserGatewayService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Database Connection (PostgreSQL)
            builder.Services.AddDbContext<AuthDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // 2. Register our Custom Token Service
            builder.Services.AddScoped<ITokenService, TokenService>();

            // 3. Configure JWT Authentication
            var jwtKey = builder.Configuration["JWT_KEY"]
    ?? throw new InvalidOperationException("JWT_KEY is not configured in the environment.");

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        // Matches the Sha512 algorithm used in your TokenService
                        ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 },
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["JWT_ISSUER"],
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["JWT_AUDIENCE"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // 4. CORS (Allow React on port 5173 to talk to this API)
            builder.Services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173", "http://localhost");
                });
            });

            var app = builder.Build();

            // 5. Middleware Pipeline
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
                var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
                int retries = 5;
                while (retries > 0)
                {
                    try
                    {
                        context.Database.EnsureCreated();
                        Console.WriteLine("Auth DB Ready!");
                        break;
                    }
                    catch
                    {
                        retries--;
                        Console.WriteLine($"DB not ready, retrying... ({retries} left)");
                        Thread.Sleep(3000); // Wait 3 seconds
                    }
                }
            }



            app.Run();
        }
    }
}
