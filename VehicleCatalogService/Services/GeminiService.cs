using Newtonsoft.Json;
using System.Text;

namespace VehicleCatalogService.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GeminiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GetVehicleInsightsAsync(string make, string model, string year, string description)
        {
            var apiKey = _config["GEMINI_API_KEY"];
            var url = $"v1beta/models/gemini-pro:generateContent?key={apiKey}";

            var prompt = $"Analyze this vehicle for a buyer: {year} {make} {model}. Description: {description}. Provide a 2-sentence summary of deal quality and potential red flags.";

            var requestBody = new
            {
                contents = new[] { new { parts = new[] { new { text = prompt } } } }
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                dynamic data = JsonConvert.DeserializeObject(jsonResponse);
                return data.candidates[0].content.parts[0].text;
            }

            return "AI Insights currently unavailable.";
        }
    }
}
