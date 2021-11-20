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
            var patient = await GetPatientDetail(patientId);
            if (patient is null) return false;

            var observation = new Observation
            {
                Status = ObservationStatus.Final,
                Subject = new ResourceReference($"Patient/{patientId}"),
                Code = new CodeableConcept(SYSTEM, CODE)
            };

            observation.Category.Add(new CodeableConcept(SYSTEM, CODE));

            // BPM - scalar
            observation.Value = new Quantity(data.Bpm, "BPM", SYSTEM);
            await _fhir.CreateAsync(observation);

            // pulse wave 2D array
            var test = new SampledData
            {

            };

            // peaks 2D array


            // distances 1D array
            var a = new[] { 10m, 20m, 10m, 20m, 10m };
            observation.Component.Add(new Observation.ComponentComponent()
            {
                Code = new CodeableConcept(SYSTEM, DISTANCES),
                Value = new SampledData
                {
                    Data = Serialize1D(a)
                }
            });

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
                    .Select(observations =>
                    {
                        var data = new PatientData
                        {
                            Bpm = (observations.Value as Quantity)?.Value ?? default
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
    }
}
