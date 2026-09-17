using System.ComponentModel.DataAnnotations;

namespace WellPayPortal.Models
{
    public class AfiliacionRequest
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Apellidos { get; set; } = string.Empty;

        [Required]
        public string Cedula { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required]
        public string Direccion { get; set; } = string.Empty;
    }
}
