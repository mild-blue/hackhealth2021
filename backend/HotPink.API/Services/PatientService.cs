using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

using HotPink.API.Entities;
using HotPink.API.Extensions;

using System.Collections.Concurrent;
using System.Drawing;
using System.Net;

using static HotPink.API.Controllers.DoctorController;
using static HotPink.API.Controllers.PatientController;

using Task = System.Threading.Tasks.Task;

namespace HotPink.API.Services
{
    public class PatientService
    {
        private const string SYSTEM = "https://hotpink.azurewebsites.net";
        private const string CODE = "vital-signs-hotpink";
        private const string WAVE = "wave-hotpink";
        private const string PEAKS = "peaks-hotpink";
        private const string DISTANCES = "distances-hotpink";


        private readonly ConcurrentDictionary<Guid, string> _sessions = new();
        private readonly FhirClient _fhir;

        public PatientService(FhirClient fhir)
        {
            _fhir = fhir;
        }

        public async Task<bool> EstablishSession(Guid sessionId, string patientId)
        {
            try
            {
                var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
                _sessions[sessionId] = patientId;
                return true;
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return false;
            }
        }

        public async Task<bool> AddPatientData(string patientId, PatientData data)
        {
            if(!await PatientExists(patientId))
            {
                return false;
            }

            var observation = new Observation
            {
                Status = ObservationStatus.Final,
                Subject = new ResourceReference($"Patient/{patientId}"),
                Code = new CodeableConcept(SYSTEM, CODE),
                Issued = DateTimeOffset.Now
            };

            observation.Category.Add(new CodeableConcept(SYSTEM, CODE));

            // BPM - scalar
            observation.Value = new Quantity(data.Bpm, "BPM", SYSTEM);

            // pulse wave 2D array
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, WAVE + 0),
                Value = new SampledData
                {
                    Data = Serialize1D(data.PulseWave[0]),
                    Dimensions = 1,
                    Origin  = new Quantity(0, "HB"),
                    Period = 0
                }
            });
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, WAVE + 1),
                Value = new SampledData
                {
                    Data = Serialize1D(data.PulseWave[1]),
                    Dimensions = 1,
                    Origin = new Quantity(0, "HB"),
                    Period = 0
                }
            });

            // peaks 2D array
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, PEAKS + 0),
                Value = new SampledData
                {
                    Data = Serialize1D(data.Peaks[0]),
                    Dimensions = 1,
                    Origin = new Quantity(0, "HB"),
                    Period = 0
                }
            });
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, PEAKS + 1),
                Value = new SampledData
                {
                    Data = Serialize1D(data.Peaks[1]),
                    Dimensions = 1,
                    Origin = new Quantity(0, "HB"),
                    Period = 0
                }
            });

            // distances 1D array
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, DISTANCES),
                Value = new SampledData
                {
                    Data = Serialize1D(data.PeaksDistances),
                    Dimensions = 1,
                    Origin = new Quantity(0, "HB"),
                    Period = 0
                }
            });

            await _fhir.CreateAsync(observation);
            return true;
        }

        public async Task AddToDoctor(string doctorId, string patientId)
        {
            var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
            patient.GeneralPractitioner.Add(new ResourceReference($"Practitioner/{doctorId}"));
            patient.GeneralPractitioner = patient.GeneralPractitioner.DistinctBy(x => x.Reference).ToList();
            await _fhir.UpdateAsync(patient);
        }

        public async Task<List<PatientListDto>> GetPatients(string? doctorId)
        {
            if (string.IsNullOrEmpty(doctorId))
            {
                var patients = (await _fhir.SearchAsync<Patient>())
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Patient>()
                    .ToList();

                return patients.Select(x => x.ToListDto()).ToList();
            }
            else
            {
                var patients = (await _fhir.SearchAsync<Patient>(new string[] { $"general-practitioner=Practitioner/{doctorId}" }))
                   .Entry
                   .Select(x => x.Resource)
                   .OfType<Patient>()
                   .ToList();


                return patients.Select(x => x.ToListDto()).ToList();
            }
        }

        public async Task<bool> PatientExists(string patientId)
        {
            try
            {
                var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
                return true;
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return false;
            }
        }

        public async Task<PatientDetailDto?> GetPatientDetail(string patientId)
        {
            try
            {
                var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
                var observations = (await _fhir.SearchAsync<Observation>(new string[] { $"patient={patientId}", $"code={CODE}" }))
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Observation>()
                    .ToList();

                var patientData = observations
                    .Select(observation =>
                    {
                        var data = new PatientData
                        {
                            Created = observation.Issued?.UtcDateTime,
                            Bpm = (observation.Value as Quantity)?.Value ?? default,
                            Peaks = Deserialize2D(observation.Component, PEAKS),
                            PeaksDistances = Deserialize1D(observation.Component, DISTANCES),
                            PulseWave = Deserialize2D(observation.Component, WAVE),
                        };
                        return data;
                    }).ToList();

                return patient.ToDetailDto(patientData);
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<PractitionerDetailDto?> GetDoctorDetail(string doctorId)
        {
            try
            {
                var doctor = await _fhir.ReadAsync<Practitioner>($"Practitioner/{doctorId}");
                return doctor.ToDetailDto();
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        private static string Serialize1D(decimal[] data) =>
            string.Join(" ", data);

        private static decimal[] DeSerialize1D(string data) =>
            data.Split(" ").Select(x => decimal.Parse(x)).ToArray();

        private List<decimal[]> Deserialize2D(IEnumerable<Observation.ComponentComponent> components, string code)
        {
            var data = new List<decimal[]>();
            for (int i = 0; i <= 1; i++)
            {
                var component = components.FirstOrDefault(x => x.Code.Coding.Any(y => y.Code == (code + i)));
                if (component is not null)
                {
                    if(component.Value is SampledData raw)
                    {
                        data.Add(DeSerialize1D(raw.Data));
                    }
                } 
            }

            return data;
        }

        private decimal[] Deserialize1D(IEnumerable<Observation.ComponentComponent> components, string code)
        {
            var component = components.FirstOrDefault(x => x.Code.Coding.Any(y => y.Code == code));
            if (component is not null)
            {
                if (component.Value is SampledData raw)
                {
                    return DeSerialize1D(raw.Data);
                }
            }

            return Array.Empty<decimal>();
        }
    }
}
