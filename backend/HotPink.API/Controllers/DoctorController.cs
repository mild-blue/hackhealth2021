
using HotPink.API.Services;

using Microsoft.AspNetCore.Mvc;

namespace HotPink.API.Controllers;

[ApiController]
[Route("[controller]")]
public abstract class ApiController : ControllerBase { }

public class DoctorController : ApiController
{
    public record PatientListDto(string Id, string Name);

    public record CreateInvitationDto(string DoctorId, string PatientId, string InvitationCode);

    private readonly InvitationService _invitationService;
    private readonly PatientService _patientService;

    public DoctorController(InvitationService invitationService, PatientService patientService)
    {
        _invitationService = invitationService;
        _patientService = patientService;
    }

    /// <summary>
    /// Get all patients.
    /// </summary>
    /// <returns></returns>
    [HttpGet("all")]
    public Task<List<PatientListDto>> GetAllPatients()
    {
        return _patientService.GetPatients(null);
    }

    /// <summary>
    /// Get my patients.
    /// </summary>
    /// <returns></returns>
    [HttpGet("mine")]
    public Task<List<PatientListDto>> GetMyPatients()
    {
        return _patientService.GetPatients("1011");
    }


    /// <summary>
    /// Invite patient.
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    [HttpPost("invite")]
    public IActionResult Invite([FromBody] CreateInvitationDto invitation)
    {
        if (_invitationService.Invite(invitation))
        {
            return Ok();
        }
        else
        {
            return Conflict($"Invitation with code {invitation.InvitationCode} already exists.");
        }
    }
}
