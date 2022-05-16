using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

using HotPink.API.Entities;
using HotPink.API.Extensions;

using System.Collections.Concurrent;
using System.Drawing;
using System.Globalization;
using System.Net;
using Hl7.Fhir.ElementModel.Types;
using static HotPink.API.Controllers.DoctorController;
using static HotPink.API.Controllers.PatientController;
using DateTime = System.DateTime;
using Quantity = Hl7.Fhir.Model.Quantity;
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
        private const string MESSAGE = "message-hotpink";
        private const string CONCLUSION = "conclusion-hotpink";

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
            if (!await PatientExists(patientId))
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
                    Origin = new Quantity(0, "HB"),
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
            
            // Message
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, MESSAGE),
                Value = new FhirString(data.Message)
            });
            
            // Conclusion
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, CONCLUSION),
                Value = new FhirString(data.Conclusion)
            });
            

            await _fhir.CreateAsync(observation);
            var observations = await GetPatientObservations(patientId);
            data.Id = observations.Max(x => x.Id);
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
                var observations = await GetPatientObservations(patientId);
                var patientData = observations.Select(ToListPatientData).ToList();
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

        public async Task<PatientData?> GetData(string id)
        {
            try
            {
                var observation = await _fhir.ReadAsync<Observation>($"Observation/{id}");
                return ToPatientData(observation);
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        private async Task<List<Observation>> GetPatientObservations(string patientId)
        {
            var observations = (await _fhir.SearchAsync<Observation>(new string[] { $"patient={patientId}", $"code={CODE}" }))
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Observation>()
                    .ToList();
            return observations;
        }

        private static PatientDataListDto ToListPatientData(Observation observation) =>
            new(observation.Id, observation.Issued?.UtcDateTime ?? DateTime.UtcNow, (observation.Value as Quantity)?.Value ?? default);

        private static PatientData ToPatientData(Observation observation) =>
            new()
            {
                Id = observation.Id,
                Created = observation.Issued?.UtcDateTime ?? DateTime.UtcNow,
                Bpm = (observation.Value as Quantity)?.Value ?? default,
                Peaks = Deserialize2D(observation.Component, PEAKS),
                PeaksDistances = Deserialize1D(observation.Component, DISTANCES),
                PulseWave = Deserialize2D(observation.Component, WAVE),
                Message = GetString(observation.Component, MESSAGE),
                Conclusion = GetString(observation.Component, CONCLUSION),
            };

        private static string Serialize1D(decimal[] data) =>
            string.Join(" ", data);

        private static decimal[] DeSerialize1D(string data) =>
            data.Split(" ").Select(x => decimal.Parse(x, CultureInfo.InvariantCulture)).ToArray();

        private static List<decimal[]> Deserialize2D(IEnumerable<Observation.ComponentComponent> components, string code)
        {
            var data = new List<decimal[]>();
            for (int i = 0; i <= 1; i++)
            {
                var component = components.FirstOrDefault(x => x.Code.Coding.Any(y => y.Code == (code + i)));
                if (component is not null)
                {
                    if (component.Value is SampledData raw)
                    {
                        data.Add(DeSerialize1D(raw.Data));
                    }
                }
            }

            return data;
        }

        private static decimal[] Deserialize1D(IEnumerable<Observation.ComponentComponent> components, string code)
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

        private static string GetString(IEnumerable<Observation.ComponentComponent> components, string code)
        {
            var component = components.FirstOrDefault(x => x.Code.Coding.Any(y => y.Code == code));
            if (component?.Value is FhirString s)
            {
                return s.Value ?? "";
            }

            return "";
        }
    }
}
