using HotPink.API.Services;

using Microsoft.AspNetCore.Mvc;

namespace HotPink.API.Controllers;

public class PatientController : ApiController
{
    public record PatientDetailDto(string Id, string Name, List<PatientDataDto> Data);
    public record AcceptInvitationDto(string InvitationCode);
    public record PatientDataDto(DateTime DateTime, bool IsOk);

    private readonly InvitationService _invitationService;
    private readonly PatientService _patientService;

    public PatientController(InvitationService invitationService, PatientService patientService)
    {
        _invitationService = invitationService;
        _patientService = patientService;
    }

    /// <summary>
    /// Get patient detail by id.
    /// </summary>
    /// <returns></returns>
    [HttpGet("{id}")]
    public PatientDetailDto GetPatientDetail(string id)
    {
        return new(id, "John Doe", new()
        {
            new(DateTime.Now.AddDays(-1), false),
            new(DateTime.Now, true),
        });
    }

    /// <summary>
    /// Accepts invitation from the doctor.
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    [HttpPost("accept")]
    public ActionResult<Guid> AcceptInvitation([FromBody] AcceptInvitationDto invitation)
    {
        var result = _invitationService.Accept(invitation);
        if (result is not null)
        {
            var sessionId = Guid.NewGuid();
            _patientService.EstablishSession(sessionId, result.PatientId);
            return sessionId;
        }
        else
        {
            return NotFound($"No invitation with code {invitation.InvitationCode}.");
        }
    }

    /// <summary>
    /// Submit patient video.
    /// </summary>
    /// <param name="sessionId"></param>
    /// <param name="file"></param>
    [HttpPost("{sessionId}/submit")]
    public IActionResult AnalyzeVideo(Guid sessionId, IFormFile file)
    {
        return Ok(new
        {
            file.FileName,
            file.ContentType,
            file.Length
        });
    }
}
