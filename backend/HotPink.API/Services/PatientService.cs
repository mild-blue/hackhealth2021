using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

using HotPink.API.Entities;
using HotPink.API.Extensions;

using System.Collections.Concurrent;
using System.Net;

using static HotPink.API.Controllers.DoctorController;
using static HotPink.API.Controllers.PatientController;

using Task = System.Threading.Tasks.Task;

namespace HotPink.API.Services
{
    public class PatientService
    {
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

        public async Task AddSessionData(Guid sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var patientId))
            {
                var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");

            }
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

        public async Task<PatientDetailDto?> GetDetail(string patientId)
        {
            try
            {
                var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
                var data = (await _fhir.SearchAsync<Observation>(new string[] { $"patient={patientId}" }))
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Observation>()
                    .ToList();
                return patient.ToDetailDto();
            }
            catch (FhirOperationException ex) when (ex.Status == HttpStatusCode.NotFound)
            {
                return null;
            }
        }
    }
}
