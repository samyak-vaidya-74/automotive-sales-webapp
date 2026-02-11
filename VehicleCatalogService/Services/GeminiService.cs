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
            // Use the API Key from the environment
            var url = $"v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

            // NEW: Structured Prompt for Pros & Cons
            var prompt = $@"
                Analyze this vehicle for a potential buyer: {year} {make} {model}. 
                Context from seller: {description}. 
                
                Please provide the response in this exact format:
                PROS:
                - (at least 2 bullet points)
                CONS:
                - (at least 2 bullet points)
                VERDICT:
                (1-sentence final recommendation)";

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

            return "AI Insights currently unavailable. Check your GEMINI_API_KEY in the .env file.";
        }
    }
}
