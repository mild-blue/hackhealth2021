
using HotPink.API.Services;

using Microsoft.AspNetCore.Mvc;

namespace HotPink.API.Controllers;

[ApiController]
[Route("[controller]")]
public abstract class ApiController : ControllerBase { }

public class DoctorController : ApiController
{
    public record PatientListDto(string Id, string Name, string PersonalNumber);

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
    public ActionResult<List<PatientListDto>> GetAllPatients(string? personalNumber)
    {
        if (string.IsNullOrEmpty(personalNumber))
        {
            var patiens = _patientService.GetPatients(null);
            if (patiens is not null)
            {
                return Ok(patiens);
            }
            else
            {
                return Ok(new());
            }
        }
        else
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Get my patients.
    /// </summary>
    /// <returns></returns>
    [HttpGet("mine")]
    public ActionResult<List<PatientListDto>> GetMyPatients()
    {
        var patiens = _patientService.GetPatients("1");
        if(patiens is not null)
        {
            return Ok(patiens);
        }
        else
        {
            return Ok(new());
        }
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
