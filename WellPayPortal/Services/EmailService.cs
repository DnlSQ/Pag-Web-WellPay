using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using WellPayPortal.Models;

namespace WellPayPortal.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> settings, ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task EnviarAsync(string destinatario, string asunto, string cuerpoHtml, IFormFile? adjunto = null)
        {
            var mensaje = new MimeMessage();
            mensaje.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            mensaje.To.Add(MailboxAddress.Parse(destinatario));
            mensaje.Subject = asunto;

            var builder = new BodyBuilder { HtmlBody = cuerpoHtml };

            if (adjunto is { Length: > 0 })
            {
                using var stream = adjunto.OpenReadStream();
                using var memoria = new MemoryStream();
                await stream.CopyToAsync(memoria);
                builder.Attachments.Add(adjunto.FileName, memoria.ToArray(), ContentType.Parse(adjunto.ContentType));
            }

            mensaje.Body = builder.ToMessageBody();

            using var cliente = new SmtpClient();
            try
            {
                await cliente.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, SecureSocketOptions.StartTls);
                await cliente.AuthenticateAsync(_settings.SenderEmail, _settings.SenderPassword);
                await cliente.SendAsync(mensaje);
            }
            finally
            {
                await cliente.DisconnectAsync(true);
            }

            _logger.LogInformation("Correo enviado a {Destinatario} con asunto '{Asunto}'", destinatario, asunto);
        }
    }
}
