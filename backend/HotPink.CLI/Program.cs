// See https://aka.ms/new-console-template for more information
using Hl7.Fhir.Rest;

using HotPink.API;
using HotPink.API.Services;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

var configuration = new ConfigurationBuilder()
    .AddUserSecrets<Program>()
    .Build();

var services = new ServiceCollection();

services.AddSingleton<IConfiguration>(configuration);

// business logic
services.AddSingleton<InvitationService>();
services.AddSingleton<PatientService>();
services.AddHttpClient<ClassificationService>();

// FHIR
services.AddSingleton(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var key = configuration["FhirApiKey"];
    var client = new FhirClient("https://fhir.afuwmxvolwu6.static-test-account.isccloud.io", messageHandler: new ApiKeyMessageHandler(key));
    client.Settings.PreferredFormat = ResourceFormat.Json;
    return client;
});

var di = services.BuildServiceProvider();

var fhir = di.GetRequiredService<FhirClient>();
var patientServices = di.GetRequiredService<PatientService>();

var detail = await patientServices.GetPatientDetail("1");

foreach (var record in detail.Data.Skip(5))
{
    Console.WriteLine("Deleting: " + record.Id);
    await fhir.DeleteAsync($"Observation/{record.Id}");
    Console.WriteLine("Deleted: " + record.Id);
}
