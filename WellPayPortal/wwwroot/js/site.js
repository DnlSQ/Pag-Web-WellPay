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

    // --- 0. SUBMENÚS ANIDADOS DEL NAVBAR (2do nivel) ---
    document.querySelectorAll('.dropdown-submenu > .dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const submenu = this.nextElementSibling;
            const parentMenu = this.closest('.dropdown-menu');

            // Cierra otros submenús abiertos al mismo nivel antes de abrir este
            parentMenu.querySelectorAll(':scope > .dropdown-submenu > .dropdown-menu.show').forEach(function (open) {
                if (open !== submenu) {
                    open.classList.remove('show');
                }
            });

            submenu.classList.toggle('show');
        });
    });

    // Cierra los submenús abiertos cuando el dropdown padre se cierra
    document.querySelectorAll('.navbar-nav > .nav-item.dropdown').forEach(function (item) {
        item.addEventListener('hidden.bs.dropdown', function () {
            item.querySelectorAll('.dropdown-menu.show').forEach(function (menu) {
                menu.classList.remove('show');
            });
        });
    });

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

            // 🟢 CAMPOS VÁLIDOS: enviar de verdad al servidor
            const form = this;
            const botonEnviar = form.querySelector('button[type="submit"]');
            const textoOriginalBoton = botonEnviar.innerHTML;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

            const datos = new FormData(form);

            fetch('/Afiliacion/Enviar', {
                method: 'POST',
                body: datos
            })
                .then(function (respuesta) {
                    return respuesta.json().then(function (json) {
                        return { ok: respuesta.ok, json: json };
                    });
                })
                .then(function (resultado) {
                    if (!resultado.ok || !resultado.json.ok) {
                        throw new Error(resultado.json.mensaje || 'No se pudo enviar la solicitud.');
                    }

                    // Ocultar el modal de Bootstrap
                    const modalElement = document.getElementById('afiliacionModal');
                    if (modalElement) {
                        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                        modalInstance.hide();
                    }

                    form.reset();
                    form.classList.remove('was-validated');

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
                })
                .catch(function (error) {
                    Swal.fire({
                        title: 'No se pudo enviar',
                        text: error.message || 'Ocurrió un error inesperado. Intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#dc3545',
                        customClass: {
                            popup: 'rounded-4 shadow-lg border-0',
                            confirmButton: 'btn btn-danger px-4 py-2 rounded-3 fw-bold'
                        }
                    });
                })
                .finally(function () {
                    botonEnviar.disabled = false;
                    botonEnviar.innerHTML = textoOriginalBoton;
                });
        });
    }


    // --- FORMULARIO DE POSTULACIÓN ---
    const formPostulacion = document.getElementById('formPostulacion');

    if (formPostulacion) {
        formPostulacion.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!this.checkValidity()) {
                e.stopPropagation();

                Swal.fire({
                    title: '¡Campos incompletos!',
                    text: 'Por favor, completa todos los campos y adjuntá tu CV en PDF antes de enviar.',
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

            const form = this;
            const botonEnviar = form.querySelector('button[type="submit"]');
            const textoOriginalBoton = botonEnviar.innerHTML;
            botonEnviar.disabled = true;
            botonEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

            const datos = new FormData(form);

            fetch('/Postulacion/Enviar', {
                method: 'POST',
                body: datos
            })
                .then(function (respuesta) {
                    return respuesta.json().then(function (json) {
                        return { ok: respuesta.ok, json: json };
                    });
                })
                .then(function (resultado) {
                    if (!resultado.ok || !resultado.json.ok) {
                        throw new Error(resultado.json.mensaje || 'No se pudo enviar tu postulación.');
                    }

                    const modalElement = document.getElementById('postulacionModal');
                    if (modalElement) {
                        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                        modalInstance.hide();
                    }

                    form.reset();
                    form.classList.remove('was-validated');

                    Swal.fire({
                        title: '¡Postulación enviada!',
                        text: 'Gracias por tu interés en Well-Pay. Revisaremos tu perfil y te contactaremos si aplica.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#00c992',
                        customClass: {
                            popup: 'rounded-4 shadow-lg border-0',
                            confirmButton: 'px-4 py-2 rounded-3 fw-bold'
                        }
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        title: 'No se pudo enviar',
                        text: error.message || 'Ocurrió un error inesperado. Intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#dc3545',
                        customClass: {
                            popup: 'rounded-4 shadow-lg border-0',
                            confirmButton: 'btn btn-danger px-4 py-2 rounded-3 fw-bold'
                        }
                    });
                })
                .finally(function () {
                    botonEnviar.disabled = false;
                    botonEnviar.innerHTML = textoOriginalBoton;
                });
        });
    }

    // --- ACTIVAR PESTAÑA DE RUBRO SEGÚN EL ANCLA DE LA URL (página Soluciones) ---
    function activarPestanaPorHash() {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const tabButton = document.getElementById(targetId + '-tab');
            if (tabButton) {
                const tab = new bootstrap.Tab(tabButton);
                tab.show();
            }
        }
    }
    activarPestanaPorHash();
    window.addEventListener('hashchange', activarPestanaPorHash);

    // --- SINCRONIZAR LA URL AL ELEGIR UNA PESTAÑA CON CLIC (página Soluciones) ---
    const rubrosTab = document.getElementById('rubrosTab');
    if (rubrosTab) {
        const tabButtons = Array.from(rubrosTab.querySelectorAll('[data-bs-toggle="pill"]'));

        tabButtons.forEach(function (btn) {
            btn.addEventListener('shown.bs.tab', function (e) {
                const targetId = e.target.getAttribute('data-bs-target').substring(1);
                history.replaceState(null, '', '#' + targetId);
            });
        });

        // --- NAVEGACIÓN CON FLECHAS DEL TECLADO ENTRE PESTAÑAS ---
        tabButtons.forEach(function (btn, index) {
            btn.addEventListener('keydown', function (e) {
                let newIndex = null;
                if (e.key === 'ArrowRight') {
                    newIndex = (index + 1) % tabButtons.length;
                } else if (e.key === 'ArrowLeft') {
                    newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                }
                if (newIndex !== null) {
                    e.preventDefault();
                    tabButtons[newIndex].focus();
                    new bootstrap.Tab(tabButtons[newIndex]).show();
                }
            });
        });
    }

});
