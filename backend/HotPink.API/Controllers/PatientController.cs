using HotPink.API.Entities;
using HotPink.API.Services;

using Microsoft.AspNetCore.Mvc;

using Pathoschild.Http.Client;

using System.Net;
using System.Text.Json;

namespace HotPink.API.Controllers;

public class PatientController : ApiController
{
    public record PatientDetailDto(string Id, string Name, List<PatientDataListDto> Data);
    public record AcceptInvitationDto(string InvitationCode);
    public record InvitationAcceptedDto(string Id, PractitionerDetailDto Doctor);
    public record PractitionerDetailDto(string Id, string Name);
    public record PatientDataListDto(string Id, DateTime Created, decimal Bpm);


    private readonly InvitationService _invitationService;
    private readonly PatientService _patientService;
    private readonly ClassificationService _classificationService;
    private readonly ILogger<PatientController> _log;

    public PatientController(InvitationService invitationService, PatientService patientService, ClassificationService classificationService, ILogger<PatientController> log)
    {
        _invitationService = invitationService;
        _patientService = patientService;
        _classificationService = classificationService;
        _log = log;
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
    [RequestSizeLimit(500_000_000)]
    public async Task<ActionResult<PatientData>> AnalyzeVideo(string patientId, IFormFile file)
    {
        if (!await _patientService.PatientExists(patientId))
        {
            return NotFound($"Patient with id {patientId} not foound.");
        }

        var fileId = Guid.NewGuid();
        var extension = Path.GetExtension(file.FileName);
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var filePath = Path.Combine(folder, $"{fileId}{extension}");
        var fileName = Path.GetFileName(filePath);

        _log.LogInformation("Uploading to: {filePath}.", filePath);
        using (var stream = System.IO.File.OpenWrite(filePath))
        {
            await file.CopyToAsync(stream);
        }

        _log.LogInformation("Uploaded to: {filePath}.", filePath);

        // TODO classify data --> fileName
        var myurl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        var dataJson = await System.IO.File.ReadAllTextAsync(Path.Combine("Data", "classification2.json"));
        var data = JsonSerializer.Deserialize<PatientData>(dataJson) ?? new();

        string path = $"{myurl}/patient/download/{fileName}";
        try
        {
            data = await _classificationService.Classify(path);
        }
        catch (ApiException ex) when (ex.Status == HttpStatusCode.BadRequest)
        {
            var raw = await ex.Response.AsRawJsonObject();
            return StatusCode((int)ex.Status, raw["message"]?.ToString());
        }
        catch (ApiException ex)
        {
            return StatusCode((int)ex.Status);
        }

        await _patientService.AddPatientData(patientId, data);

        // TODO delete tmp image

        return Ok(data);
    }

    /// <summary>
    /// Download recorder video.
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    [HttpGet("download/{fileName}")]
    public IActionResult Download(string fileName)
    {
        var folder = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
        var filePath = Path.Combine(folder, fileName);

        if (System.IO.File.Exists(filePath))
        {
            var stream = System.IO.File.OpenRead(filePath);
            return File(stream, "video/quicktime", Path.GetFileName(filePath));
        }
        else
        {
            return NotFound($"File {fileName} not found.");
        }
    }

    /// <summary>
    /// Get patient's data.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("data/{id}")]
    public async Task<ActionResult<PatientData>> AnalyzeVideo(string id) =>
        OkOrNotFound(await _patientService.GetData(id));
}
