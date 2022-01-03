using Hl7.Fhir.Rest;

using HotPink.API;
using HotPink.API.Services;

using System.Reflection;
using System.Text.Json.Serialization;

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
builder.Services.AddHttpClient<ClassificationService>();

// FHIR
builder.Services.AddSingleton(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var key = configuration["FhirApiKey"];
    var url = configuration["FhirUrl"];
    var client = new FhirClient(url, messageHandler: new ApiKeyMessageHandler(key));
    client.Settings.PreferredFormat = ResourceFormat.Json;
    return client;
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => builder.WithOrigins("*"));
});

// JSON
builder.Services.AddControllers().AddJsonOptions(x =>
{
    // serialize enums as strings in api responses (e.g. Role)
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
