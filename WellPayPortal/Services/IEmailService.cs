using Microsoft.AspNetCore.Http;

namespace WellPayPortal.Services
{
    public interface IEmailService
    {
        /// <summary>
        /// Envía un correo de texto simple, con un adjunto opcional (ej. el CV en PDF).
        /// </summary>
        Task EnviarAsync(string destinatario, string asunto, string cuerpoHtml, IFormFile? adjunto = null);
    }
}
