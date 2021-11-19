using Hl7.Fhir.Rest;

using HotPink.API.Entities;
using HotPink.API.Extensions;

using System.Collections.Concurrent;

using static HotPink.API.Controllers.DoctorController;

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
            _patients.TryAdd("1", new Patient { Id = "1", Name = "John Doe" });
            _patients.TryAdd("2", new Patient { Id = "2", Name = "Jane Doe" });
            _patients.TryAdd("3", new Patient { Id = "3", Name = "Alex Doe" });
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

        public bool AddToDoctor(string doctorId, string patientId)
        {
            if (_patients.TryGetValue(patientId, out var patient))
            {
                if (!_doctorPatients.TryAdd(doctorId, new() { patient }))
                {
                    _doctorPatients[doctorId].Add(patient);
                    return true;
                }
            }

            return false;
        }

        public List<PatientListDto>? GetPatients(string? doctorId)
        {
            if (string.IsNullOrEmpty(doctorId))
            {
                var patients = _fhir.SearchAsync<Hl7.Fhir.Model.Patient>()
                    .Result
                    .Entry
                    .Select(x => x.Resource)
                    .OfType<Hl7.Fhir.Model.Patient>()
                    .ToList();

                return patients.Select(x => x.ToListDto()).ToList();
            }
            else
            {
                if (_doctorPatients.TryGetValue(doctorId, out var patients))
                {
                    return patients.Select(x => x.ToListDTO()).ToList();
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
