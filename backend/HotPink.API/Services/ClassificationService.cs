using HotPink.API.Entities;

using Pathoschild.Http.Client;

using System.Web;

namespace HotPink.API.Services
{
    public class ClassificationService
    {
        private readonly IClient _client;

        public ClassificationService(HttpClient client, IConfiguration config)
        {
            _client = new FluentClient(new Uri(config["image"]), client);
        }

        public async Task<PatientData> Classify(string fileUrl)
        {
            fileUrl = HttpUtility.UrlEncode(fileUrl);
            var response = await _client.GetAsync(fileUrl);

            return await response.As<PatientData>();
        }
    }
}
