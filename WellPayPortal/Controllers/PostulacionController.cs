using Microsoft.AspNetCore.Mvc;
using WellPayPortal.Models;
using WellPayPortal.Services;

namespace WellPayPortal.Controllers
{
    [Route("Postulacion")]
    public class PostulacionController : Controller
    {
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<PostulacionController> _logger;

        private const long TamanoMaximoCvBytes = 5 * 1024 * 1024; // 5 MB

        public PostulacionController(IEmailService emailService, Microsoft.Extensions.Options.IOptions<EmailSettings> emailSettings, ILogger<PostulacionController> logger)
        {
            _emailService = emailService;
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        [HttpPost("Enviar")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Enviar([FromForm] PostulacionRequest modelo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { ok = false, mensaje = "Hay campos incompletos o inválidos." });
            }

            if (modelo.Cv is null || modelo.Cv.Length == 0)
            {
                return BadRequest(new { ok = false, mensaje = "Debes adjuntar tu CV en PDF." });
            }

            if (modelo.Cv.Length > TamanoMaximoCvBytes)
            {
                return BadRequest(new { ok = false, mensaje = "El archivo no puede pesar más de 5 MB." });
            }

            var extension = Path.GetExtension(modelo.Cv.FileName).ToLowerInvariant();
            if (extension != ".pdf" || modelo.Cv.ContentType != "application/pdf")
            {
                return BadRequest(new { ok = false, mensaje = "El CV debe ser un archivo PDF." });
            }

            var cuerpo = $@"
                <h2>Nueva postulación</h2>
                <p><strong>Nombre:</strong> {modelo.Nombre}</p>
                <p><strong>Correo:</strong> {modelo.Correo}</p>
                <p><strong>Teléfono:</strong> {modelo.Telefono}</p>
                <p><strong>Área de interés:</strong> {modelo.AreaInteres}</p>
                <p>Se adjunta el CV en PDF.</p>
            ";

            try
            {
                await _emailService.EnviarAsync(_emailSettings.PostulacionDestino, "Nueva postulación - Well-Pay", cuerpo, modelo.Cv);
                return Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enviando el correo de postulación");
                return StatusCode(500, new { ok = false, mensaje = "No se pudo enviar tu postulación. Intenta de nuevo más tarde." });
            }
        }
    }
}
