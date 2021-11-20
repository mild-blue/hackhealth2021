using Hl7.Fhir.Rest;

using HotPink.API;
using HotPink.API.Services;

using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Set the comments path for the Swagger JSON and UI.
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// business logic
builder.Services.AddSingleton<InvitationService>();
builder.Services.AddSingleton<PatientService>();

// FHIR
builder.Services.AddSingleton(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var key = configuration["FhirApiKey"];
    var client = new FhirClient("https://fhir.afuwmxvolwu6.static-test-account.isccloud.io", messageHandler: new ApiKeyMessageHandler(key));
    client.Settings.PreferredFormat = ResourceFormat.Json;
    return client;
});

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
