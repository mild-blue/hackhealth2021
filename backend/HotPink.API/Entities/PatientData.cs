namespace HotPink.API.Entities
{
    public class PatientData
    {
        public DateTime Created { get; set; }
        
        public DataStatus State { get; set; }
        public decimal Bpm { get; set; }
    }

    public enum DataStatus
    {
        OK,
        FAIL,
        UNKOWN
    }
}