using System.Text.Json.Serialization;

namespace HotPink.API.Entities
{
    public class PatientData
    {
        public string? Id { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        [JsonPropertyName("bpm")]
        public decimal Bpm { get; set; }

        [JsonPropertyName("peaks")]
        public List<decimal[]> Peaks { get; set; } = new();

        [JsonPropertyName("peaks_distances")]
        public decimal[] PeaksDistances { get; set; } = Array.Empty<decimal>();

        [JsonPropertyName("pulse_wave")]
        public List<decimal[]> PulseWave { get; set; } = new();
    }
}