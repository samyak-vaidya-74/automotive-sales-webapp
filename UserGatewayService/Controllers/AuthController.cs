using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserGatewayService.Data;
using UserGatewayService.Models;
using UserGatewayService.Models.DTOs;
using UserGatewayService.Services;

namespace UserGatewayService.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Routes to /api/auth because the class is AuthController
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
        public async Task<ActionResult<AuthResponse>> Register(RegisterDto registerDto)
        {
            // 1. Check if user already exists
            if (await _context.Users.AnyAsync(x => x.Email == registerDto.Email.ToLower()))
                return BadRequest("Email is already in use.");

            // 2. Create the user and hash the password using BCrypt
            var user = new User
            {
                Email = registerDto.Email.ToLower(),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "User" // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 3. Return the user info and their new JWT passport
            return new AuthResponse
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto loginDto)
        {
            // 1. Find the user by email
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

            // 2. Verify existence and password
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password.");

            // 3. Return user info and a fresh token
            return new AuthResponse
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}
