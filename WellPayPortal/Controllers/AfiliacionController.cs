using Microsoft.AspNetCore.Mvc;
using WellPayPortal.Models;
using WellPayPortal.Services;

namespace WellPayPortal.Controllers
{
    [Route("Afiliacion")]
    public class AfiliacionController : Controller
    {
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<AfiliacionController> _logger;

        public AfiliacionController(IEmailService emailService, Microsoft.Extensions.Options.IOptions<EmailSettings> emailSettings, ILogger<AfiliacionController> logger)
        {
            _emailService = emailService;
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        [HttpPost("Enviar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Enviar([FromForm] AfiliacionRequest modelo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { ok = false, mensaje = "Hay campos incompletos o inválidos." });
            }

            var cuerpo = $@"
                <h2>Nueva solicitud de afiliación</h2>
                <p><strong>Nombre:</strong> {modelo.Nombre} {modelo.Apellidos}</p>
                <p><strong>Cédula:</strong> {modelo.Cedula}</p>
                <p><strong>Teléfono:</strong> {modelo.Telefono}</p>
                <p><strong>Correo:</strong> {modelo.Correo}</p>
                <p><strong>Dirección:</strong> {modelo.Direccion}</p>
            ";

            try
            {
                await _emailService.EnviarAsync(_emailSettings.AfiliacionDestino, "Nueva solicitud de afiliación - Well-Pay", cuerpo);
                return Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enviando el correo de afiliación");
                return StatusCode(500, new { ok = false, mensaje = "No se pudo enviar la solicitud. Intenta de nuevo más tarde." });
            }
        }
    }
}
