// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// ===============================================
// WELL-PAY PORTAL - LÓGICA PRINCIPAL (site.js)
// ===============================================

// ===============================================
// WELL-PAY PORTAL - LÓGICA PRINCIPAL (site.js)
// ===============================================

document.addEventListener('DOMContentLoaded', function () {

    // --- 1. RESTRICCIONES DE ENTRADA EN TIEMPO REAL ---

    // Campos de Texto: Solo letras y espacios (Nombre y Apellidos)
    const inputsSoloLetras = document.querySelectorAll('#nombre, #apellidos');
    inputsSoloLetras.forEach(input => {
        if (input) {
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            });
        }
    });

    // Campo Cédula: Solo números
    const inputCedula = document.getElementById('cedula');
    if (inputCedula) {
        inputCedula.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Campo Teléfono: Solo números y signo + al inicio
    const inputTelefono = document.getElementById('telefono');
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9+]/g, '');
        });
    }


    // --- 2. MANEJO Y VALIDACIÓN DEL FORMULARIO DE AFILIACIÓN ---
    const formAfiliacion = document.getElementById('formAfiliacion');

    if (formAfiliacion) {
        formAfiliacion.addEventListener('submit', function (e) {
            e.preventDefault(); // Evita recargar la página

            // Verificar si hay campos vacíos o no válidos según HTML5
            if (!this.checkValidity()) {
                e.stopPropagation();

                // ⚠️ ALERTA DE CAMPOS INCOMPLETOS / INVALIDEZ
                Swal.fire({
                    title: '¡Campos incompletos!',
                    text: 'Por favor, completa todos los campos requeridos correctamente antes de enviar.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#ffc107',
                    customClass: {
                        popup: 'rounded-4 shadow-lg border-0',
                        confirmButton: 'btn btn-warning px-4 py-2 rounded-3 fw-bold text-dark'
                    }
                });

                this.classList.add('was-validated');
                return;
            }

            // 🟢 SI TODO ESTÁ CORRECTO:

            // 1. Ocultar el modal de Bootstrap
            const modalElement = document.getElementById('afiliacionModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstance.hide();
            }

            // 2. Limpiar todos los campos del formulario
            this.reset();
            this.classList.remove('was-validated');

            // 3. Mostrar la alerta de éxito con SweetAlert2
            Swal.fire({
                title: '¡Solicitud enviada con éxito!',
                text: 'Nos pondremos en contacto contigo lo antes posible para continuar con el proceso.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#00c992', // Verde Well-Pay
                customClass: {
                    popup: 'rounded-4 shadow-lg border-0',
                    confirmButton: 'px-4 py-2 rounded-3 fw-bold'
                }
            });
        });
    }

});