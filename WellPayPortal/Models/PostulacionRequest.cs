using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace WellPayPortal.Models
{
    public class PostulacionRequest
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        public string AreaInteres { get; set; } = string.Empty;

        // El archivo se valida aparte en el controlador (tipo PDF, tamaño máximo)
        public IFormFile? Cv { get; set; }
    }
}
