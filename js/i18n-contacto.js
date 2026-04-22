/* ── Traducciones ES / DE — contacto.html ──────────────────── */
(function () {
  const T = {
    es: {
      'banner-titulo':        'Contacto',
      'info-titulo':          'Información',
      'info-label-ubicacion': 'Ubicación',
      'info-label-correo':    'Correo',
      'info-label-fundado':   'Fundado',
      'form-titulo':          'Escríbenos',
      'form-subtitulo':       'Responderemos a la brevedad posible.',
      'form-label-nombre':    'Nombre',
      'form-label-email':     'Correo electrónico',
      'form-label-asunto':    'Asunto',
      'form-label-mensaje':   'Mensaje',
      'form-btn-texto':       'Enviar mensaje',
      'nombre-ph':            'Tu nombre completo',
      'email-ph':             'correo@ejemplo.com',
      'asunto-ph':            '¿En qué podemos ayudarte?',
      'mensaje-ph':           'Escribe tu mensaje aquí...',
    },
    de: {
      'banner-titulo':        'Kontakt',
      'info-titulo':          'Informationen',
      'info-label-ubicacion': 'Standort',
      'info-label-correo':    'E-Mail',
      'info-label-fundado':   'Gegründet',
      'form-titulo':          'Schreib uns',
      'form-subtitulo':       'Wir antworten so schnell wie möglich.',
      'form-label-nombre':    'Name',
      'form-label-email':     'E-Mail-Adresse',
      'form-label-asunto':    'Betreff',
      'form-label-mensaje':   'Nachricht',
      'form-btn-texto':       'Nachricht senden',
      'nombre-ph':            'Ihr vollständiger Name',
      'email-ph':             'email@beispiel.com',
      'asunto-ph':            'Wie können wir Ihnen helfen?',
      'mensaje-ph':           'Schreiben Sie Ihre Nachricht hier...',
    }
  };

  function applyTranslations(lang) {
    const dict = T[lang] || T.es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });
    document.documentElement.lang = lang;
    document.title = lang === 'de'
      ? 'Kontakt – Jokili Verein'
      : 'Contacto – Jokili Verein';
  }

  window.__setLang = function (lang) {
    applyTranslations(lang);
  };

  const init = localStorage.getItem('jokili-lang') || 'es';
  if (init !== 'es') applyTranslations(init);
})();
