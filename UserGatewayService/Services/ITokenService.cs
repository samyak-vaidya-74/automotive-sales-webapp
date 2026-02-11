using UserGatewayService.Models;

namespace UserGatewayService.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
