
using Microsoft.AspNetCore.Mvc;

namespace HotPink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiController : ControllerBase
{
    protected ActionResult<T> OkOrNotFound<T>(T? item) =>
        item switch
        {
            null => NotFound(),
            _ => Ok(item)
        };
}
