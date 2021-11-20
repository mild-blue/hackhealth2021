using HotPink.API.Entities;
using HotPink.API.Services;

using Microsoft.AspNetCore.Mvc;

using System;
using System.Drawing;

namespace HotPink.API.Controllers;

public class PatientController : ApiController
{
    public record PatientDetailDto(string Id, string Name, List<PatientData> Data);
    public record AcceptInvitationDto(string InvitationCode);
    public record InvitationAcceptedDto(string Id, PractitionerDetailDto Doctor);
    public record PractitionerDetailDto(string Id, string Name);



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
    public async Task<ActionResult<PatientDetailDto>> GetPatientDetail(string id)
    {
        return OkOrNotFound(await _patientService.GetPatientDetail(id));
    }

    /// <summary>
    /// Accepts invitation from the doctor.
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    [HttpPost("accept")]
    public async Task<ActionResult<InvitationAcceptedDto>> AcceptInvitation([FromBody] AcceptInvitationDto invitation)
    {
        var result = _invitationService.Accept(invitation);
        if (result is not null)
        {
            var sessionId = Guid.NewGuid();
            await _patientService.EstablishSession(sessionId, result.PatientId);
            await _patientService.AddToDoctor(result.DoctorId, result.PatientId);
            var doctor = await _patientService.GetDoctorDetail(result.DoctorId);
            return Ok(new InvitationAcceptedDto(result.PatientId, doctor!));
        }
        else
        {
            return NotFound($"No invitation with code {invitation.InvitationCode}.");
        }
    }

    /// <summary>
    /// Submit patient video.
    /// </summary>
    /// <param name="patientId"></param>
    /// <param name="file"></param>
    [HttpPost("{patientId}/submit")]
    public async Task<IActionResult> AnalyzeVideo(string patientId, IFormFile file)
    {
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var filePath = Path.Combine(folder, "video.mov");
        using var stream = System.IO.File.OpenWrite(filePath);
        await file.CopyToAsync(stream);

        // TODO classify data

        if (!await _patientService.AddPatientData(patientId, new PatientData
        {
            Bpm = 66m
        }))
        {
            return NotFound($"Patient with id {patientId} not foound.");
        }

        return Ok(new
        {
            file.FileName,
            file.ContentType,
            file.Length
        });
    }

    [HttpGet("download")]
    public FileStreamResult Download()
    {
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var filePath = Path.Combine(folder, "video.mov");
        using var stream = System.IO.File.OpenRead(filePath);
        return base.File(stream, "video/quicktime");
    }
}
