/* ── Traducciones ES / DE — index.html ──────────────────── */
(function () {
  const T = {
    es: {
      'card-historia-title':    'Historia',
      'card-historia-desc':     'Desde Endingen am Kaiserstuhl hasta la Colonia Tovar',
      'card-carnaval-title':    'Carnaval 2026',
      'card-carnaval-desc':     'Programa y actividades del carnaval de este año',
      'card-traje-title':       'Nuestro Traje',
      'card-traje-desc':        'Los colores y el significado del traje Jokili',
      'card-rituales-title':    'Rituales y Tradiciones',
      'card-rituales-desc':     'Las costumbres que nos definen cada carnaval',
      'card-sprichli-title':    'Jokili Sprichli',
      'card-sprichli-desc':     'Los dichos de carnaval en dialecto Alemannisch',
      'card-personajes-title':  'Personajes',
      'card-personajes-desc':   'Los personajes emblemáticos de nuestra comparsa',
      'card-galeria-title':     'Galería',
      'card-galeria-desc':      'Fotos y recuerdos de nuestros carnavales',
    },
    de: {
      'card-historia-title':    'Geschichte',
      'card-historia-desc':     'Von Endingen am Kaiserstuhl bis zur Colonia Tovar',
      'card-carnaval-title':    'Fasnet 2026',
      'card-carnaval-desc':     'Programm und Aktivitäten der diesjährigen Fasnet',
      'card-traje-title':       'Unser Häs',
      'card-traje-desc':        'Die Farben und die Bedeutung des Jokili-Häs',
      'card-rituales-title':    'Rituale und Traditionen',
      'card-rituales-desc':     'Die Bräuche, die uns jede Fasnet ausmachen',
      'card-sprichli-title':    'Jokili Sprichli',
      'card-sprichli-desc':     'Die Fasnetsprüche im alemannischen Dialekt',
      'card-personajes-title':  'Figuren',
      'card-personajes-desc':   'Die emblematischen Figuren unserer Fasnetgruppe',
      'card-galeria-title':     'Galerie',
      'card-galeria-desc':      'Fotos und Erinnerungen unserer Fasnet',
    }
  };

  function applyTranslations(lang) {
    const dict = T[lang] || T.es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.documentElement.lang = lang;
    document.title = lang === 'de'
      ? 'Jokili Verein 1976 – Colonia Tovar'
      : 'Jokili Verein 1976 – Colonia Tovar';
  }

  window.__setLang = function (lang) {
    applyTranslations(lang);
  };

  const init = localStorage.getItem('jokili-lang') || 'es';
  if (init !== 'es') applyTranslations(init);
})();
