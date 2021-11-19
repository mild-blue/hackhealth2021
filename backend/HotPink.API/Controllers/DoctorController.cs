
using Microsoft.AspNetCore.Mvc;

namespace HotPink.API.Controllers;

[ApiController]
[Route("[controller]")]
public abstract class ApiController : ControllerBase { }

public class DoctorController : ApiController
{
    public record PatientListDto(string Id, string Name, string PersonalNumber);

    public record CreateInvitationDto(string DoctorId, string PatientId, string InvitationCode);

    /// <summary>
    /// Get all patients.
    /// </summary>
    /// <returns></returns>
    [HttpGet("all")]
    public List<PatientListDto> GetAllPatients(string? personalNumber)
    {
        return new()
        {
            new("1", "John", "9101015533"),
            new("2", "Jane", "9647012244"),
        };
    }

    /// <summary>
    /// Get my patients.
    /// </summary>
    /// <returns></returns>
    [HttpGet("mine")]
    public List<PatientListDto> GetMyPatients()
    {
        return new()
        {
            new("1", "John", "9101015533")
        }; ;
    }


    /// <summary>
    /// Invite patient.
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    [HttpPost("invite")]
    public void Invite([FromBody] CreateInvitationDto invitation)
    {

    }
}
