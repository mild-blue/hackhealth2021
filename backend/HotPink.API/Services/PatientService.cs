using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

using HotPink.API.Entities;
using HotPink.API.Extensions;

using System.Collections.Concurrent;

using static HotPink.API.Controllers.DoctorController;

using Task = System.Threading.Tasks.Task;

namespace HotPink.API.Services
{
    public class PatientService
    {
        private readonly ConcurrentDictionary<string, Patient> _patients = new();
        private readonly ConcurrentDictionary<Guid, Patient> _sessions = new();
        private readonly ConcurrentDictionary<string, ConcurrentBag<Patient>> _doctorPatients = new();

        private readonly FhirClient _fhir;

        public PatientService(FhirClient fhir)
        {
            _fhir = fhir;
        }

        public bool EstablishSession(Guid sessionId, string patientId)
        {
            if (_patients.TryGetValue(patientId, out var patient))
            {
                _sessions[sessionId] = patient;
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task AddToDoctor(string doctorId, string patientId)
        {
            var patient = await _fhir.ReadAsync<Patient>($"Patient/{patientId}");
            patient.GeneralPractitioner.Clear();
            patient.GeneralPractitioner.Add(new ResourceReference($"Practitioner/{doctorId}"));
            await _fhir.UpdateAsync(patient);
        }

        public List<PatientListDto>? GetPatients(string? doctorId)
        {
            if (string.IsNullOrEmpty(doctorId))
            {
                var patients = _fhir.SearchAsync<Patient>()
                    .Result
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Patient>()
                    .ToList();

                return patients.Select(x => x.ToListDto()).ToList();
            }
            else
            {
                if (_doctorPatients.TryGetValue(doctorId, out var patients))
                {
                    return null;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
