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

        public static PatientDetailDto ToDetailDto(this Patient patient)
        {
            var name = patient.Name.FirstOrDefault(x => x.Use == NameUse.Official)
                ?? patient.Name.FirstOrDefault();

            return new(patient.Id, name?.ToString() ?? string.Empty, new ());
        }
    }
}
