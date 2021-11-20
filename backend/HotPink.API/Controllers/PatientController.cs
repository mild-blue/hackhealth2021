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
        if(await _patientService.GetPatientDetail(patientId) is null)
        {
            return NotFound($"Patient with id {patientId} not foound.");
        }

        var fileId = Guid.NewGuid();
        var extension = Path.GetExtension(file.FileName);
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var filePath = Path.Combine(folder, $"{fileId}{extension}");
        using (var stream = System.IO.File.OpenWrite(filePath))
        {
            await file.CopyToAsync(stream);
        }

        // TODO classify data
        await _patientService.AddPatientData(patientId, new PatientData
        {
            Bpm = 66m
        });

        // TODO delete tmp image


        return Ok(new
        {
            fileId,
            file.FileName,
            file.ContentType,
            file.Length
        });
    }

    [HttpGet("download/{id}")]
    public IActionResult Download(Guid id)
    {
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var files = Directory.GetFiles(folder);
        var filePath = files.FirstOrDefault(x => Path.GetFileNameWithoutExtension(x) == id.ToString());

        if (!string.IsNullOrEmpty(filePath))
        {
            var stream = System.IO.File.OpenRead(filePath);
            return File(stream, "video/quicktime", Path.GetFileName(filePath)); 
        }
        else
        {
            return NotFound($"File with id {id} not found.");
        }
    }
}
