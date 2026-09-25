using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace WellPayPortal.Models
{
    public class AfiliacionRequest : IValidatableObject
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Apellidos { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe indicar el tipo de identificación.")]
        public string TipoIdentificacion { get; set; } = string.Empty; // "Fisica" | "Juridica" | "Dimex"

        [Required(ErrorMessage = "La cédula/identificación es obligatoria.")]
        public string Cedula { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required]
        public string Direccion { get; set; } = string.Empty;

        // --- Representante legal: solo obligatorio cuando TipoIdentificacion == "Juridica" ---
        public string? RepresentanteNombre { get; set; }
        public string? RepresentanteTipoIdentificacion { get; set; } // "Cedula" | "Dimex" | "Pasaporte"
        public string? RepresentanteIdentificacion { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var cedulaLimpia = (Cedula ?? string.Empty).Trim();

            switch (TipoIdentificacion)
            {
                case "Fisica":
                    if (!Regex.IsMatch(cedulaLimpia, @"^[1-9]\d{8}$"))
                        yield return new ValidationResult(
                            "La cédula física debe tener 9 dígitos y no puede iniciar en 0.",
                            new[] { nameof(Cedula) });
                    break;

                case "Juridica":
                    if (!Regex.IsMatch(cedulaLimpia, @"^3\d{9}$"))
                        yield return new ValidationResult(
                            "La cédula jurídica debe tener 10 dígitos e iniciar con 3.",
                            new[] { nameof(Cedula) });
                    break;

                case "Dimex":
                    if (!Regex.IsMatch(cedulaLimpia, @"^\d{11,12}$"))
                        yield return new ValidationResult(
                            "El DIMEX debe tener 11 o 12 dígitos.",
                            new[] { nameof(Cedula) });
                    break;

                default:
                    yield return new ValidationResult(
                        "El tipo de identificación no es válido.",
                        new[] { nameof(TipoIdentificacion) });
                    break;
            }

            if (TipoIdentificacion == "Juridica")
            {
                if (string.IsNullOrWhiteSpace(RepresentanteNombre))
                {
                    yield return new ValidationResult(
                        "El nombre del representante legal es obligatorio para cédula jurídica.",
                        new[] { nameof(RepresentanteNombre) });
                }

                if (string.IsNullOrWhiteSpace(RepresentanteTipoIdentificacion))
                {
                    yield return new ValidationResult(
                        "Debe indicar el tipo de identificación del representante legal.",
                        new[] { nameof(RepresentanteTipoIdentificacion) });
                }
                else
                {
                    var repId = (RepresentanteIdentificacion ?? string.Empty).Trim();
                    switch (RepresentanteTipoIdentificacion)
                    {
                        case "Cedula":
                            if (!Regex.IsMatch(repId, @"^[1-9]\d{8}$"))
                                yield return new ValidationResult(
                                    "La cédula del representante debe tener 9 dígitos y no iniciar en 0.",
                                    new[] { nameof(RepresentanteIdentificacion) });
                            break;

                        case "Dimex":
                            if (!Regex.IsMatch(repId, @"^\d{11,12}$"))
                                yield return new ValidationResult(
                                    "El DIMEX del representante debe tener 11 o 12 dígitos.",
                                    new[] { nameof(RepresentanteIdentificacion) });
                            break;

                        case "Pasaporte":
                            if (!Regex.IsMatch(repId, @"^[A-Za-z0-9]{6,15}$"))
                                yield return new ValidationResult(
                                    "El pasaporte del representante debe tener entre 6 y 15 caracteres alfanuméricos.",
                                    new[] { nameof(RepresentanteIdentificacion) });
                            break;

                        default:
                            yield return new ValidationResult(
                                "El tipo de identificación del representante no es válido.",
                                new[] { nameof(RepresentanteTipoIdentificacion) });
                            break;
                    }
                }
            }
        }
    }
}