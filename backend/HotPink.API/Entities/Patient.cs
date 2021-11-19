using static HotPink.API.Controllers.DoctorController;

namespace HotPink.API.Entities
{
    public class Patient
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PersonalNumber { get; set; } = string.Empty;
        public List<PatientData> Data { get; set; } = new();

        public PatientListDto ToListDTO() =>
            new(Id, Name, PersonalNumber);
    }
}