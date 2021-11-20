using Hl7.Fhir.Model;

using static Hl7.Fhir.Model.HumanName;
using static HotPink.API.Controllers.DoctorController;
using static HotPink.API.Controllers.PatientController;

namespace HotPink.API.Extensions
{
    public static class MappingExtensions
    {
        public static PatientListDto ToListDto(this Patient patient)
        {
            var name = patient.Name.FirstOrDefault(x => x.Use == NameUse.Official) 
                ?? patient.Name.FirstOrDefault();

            return new(patient.Id, name?.ToString() ?? string.Empty);
        }

        public static PatientDetailDto ToDetailDto(this Patient patient, List<PatientDataListDto> patientData)
        {
            var name = patient.Name.FirstOrDefault(x => x.Use == NameUse.Official)
                ?? patient.Name.FirstOrDefault();

            patientData.Sort((x, y) => x.Created.CompareTo(y.Created));
            patientData.Reverse();
            return new(patient.Id, name?.ToString() ?? string.Empty, patientData);
        }

        public static PractitionerDetailDto ToDetailDto(this Practitioner practitioner)
        {
            var name = practitioner.Name.FirstOrDefault(x => x.Use == NameUse.Official)
                ?? practitioner.Name.FirstOrDefault();

            return new(practitioner.Id, string.Join(" ", name?.Prefix ?? Array.Empty<string>()) + " " + (name?.ToString() ?? string.Empty));
        }
    }
}
