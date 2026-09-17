namespace WellPayPortal.Models
{
    /// <summary>
    /// Configuración del servidor SMTP usado para enviar los formularios del sitio.
    /// Se llena desde appsettings.json (valores no sensibles) y desde
    /// "dotnet user-secrets" en desarrollo / variables de entorno en producción
    /// (el password NUNCA debe ir directo en appsettings.json ni subirse a git).
    /// </summary>
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; } = 587;
        public string SenderName { get; set; } = "Well-Pay";
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderPassword { get; set; } = string.Empty;

        // Correos de destino por formulario
        public string AfiliacionDestino { get; set; } = string.Empty;
        public string PostulacionDestino { get; set; } = string.Empty;
    }
}
