using Pathoschild.Http.Client;

namespace HotPink.API.Services
{
    public class FhirClient
    {
        private readonly IClient _client;

        public FhirClient(HttpClient client, IConfiguration config)
        {
            _client = new FluentClient(new Uri("https://fhir.afuwmxvolwu6.static-test-account.isccloud.io"), client);
            var key = config["FhirApiKey"];
            _client.AddDefault(x => x.WithHeader("x-api-key", key));
        }

        public async Task GetPatients()
        {
            var raw = await _client
                .GetAsync("/Patient")
                .AsRawJson();
        }
    }
}
