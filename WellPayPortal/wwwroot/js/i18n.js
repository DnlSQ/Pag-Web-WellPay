/**
 * Sistema de Internacionalización (i18n) para WellPayPortal
 * Soporta cambio de idioma entre Español (es) e Inglés (en)
 *
 * Uso:
 * 1. Agregar data-en="..." y data-es="..." a los elementos que necesiten traducción
 * 2. Llamar setLang('es') o setLang('en') para cambiar el idioma
 * 3. El idioma se guarda en localStorage para persistencia
 */

// Configuración
const LANGUAGES = ['es', 'en'];
const DEFAULT_LANGUAGE = 'es';
const STORAGE_KEY = 'wellpay_language';

/**
 * Establece el idioma del sitio
 * @param {string} lang - Código de idioma ('es' o 'en')
 */
function setLang(lang) {
    if (!LANGUAGES.includes(lang)) {
        console.warn(`Idioma no soportado: ${lang}. Usando ${DEFAULT_LANGUAGE}`);
        lang = DEFAULT_LANGUAGE;
    }

    // Establecer idioma en el HTML
    document.documentElement.lang = lang;

    // Guardar idioma actual en el body
    document.body.dataset.lang = lang;

    // Guardar en localStorage para persistencia
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
        console.warn('localStorage no disponible:', e);
    }

    // Buscar todos los elementos con data-en y data-es
    document.querySelectorAll('[data-en][data-es]').forEach(el => {
        // Cambiar el contenido según el idioma
        el.textContent = lang === 'es'
            ? el.getAttribute('data-es')
            : el.getAttribute('data-en');
    });

    // Cambiar el botón para mostrar el idioma que puedes cambiar
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
        langToggle.setAttribute('title', lang === 'es' ? 'Switch to English' : 'Cambiar a Español');
        langToggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a Español');
    }
}

/**
 * Obtiene el idioma actual
 * @returns {string} Código de idioma actual
 */
function getLang() {
    return document.body.dataset.lang || DEFAULT_LANGUAGE;
}

/**
 * Alterna entre idiomas
 */
function toggleLang() {
    const current = getLang();
    const newLang = current === 'es' ? 'en' : 'es';
    setLang(newLang);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Intentar cargar idioma guardado, sino usar el default
    let savedLang = DEFAULT_LANGUAGE;
    try {
        savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
    } catch (e) {
        console.warn('localStorage no disponible:', e);
    }

    // Establecer idioma inicial
    setLang(savedLang);

    // Agregar evento al botón de cambio de idioma
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function (e) {
            e.preventDefault();
            toggleLang();
        });
    }
});

// Exportar para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setLang, getLang, toggleLang };
}
