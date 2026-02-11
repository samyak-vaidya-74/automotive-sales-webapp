using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserGatewayService.Data;
using UserGatewayService.Models;
using UserGatewayService.Models.DTOs;
using UserGatewayService.Services;

namespace UserGatewayService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AuthDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            // 1. Normalize email to lowercase
            var email = registerDto.Email.ToLower();

            if (await _context.Users.AnyAsync(x => x.Email == email))
                return BadRequest("Email is already in use.");

            // 2. Create the user
            var user = new User
            {
                Email = email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 3. Return object structure matching Frontend expectation
            return Ok(new
            {
                token = _tokenService.CreateToken(user),
                user = new
                {
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    role = user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            // 1. Find user (Case-insensitive check)
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            // 2. Verify existence and BCrypt password
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            // 3. Return unified response to update React state immediately
            return Ok(new
            {
                token = _tokenService.CreateToken(user),
                user = new
                {
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    role = user.Role
                }
            });
        }
    }
}
