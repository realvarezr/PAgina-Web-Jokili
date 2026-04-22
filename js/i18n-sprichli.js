/* ── Traducciones ES / DE — sprichli.html ──────────────────── */
(function () {
  const T = {
    es: {
      'banner-subtitulo': 'Dialecto Alemannisch',
      'intro-p':          'Dichos de carnaval transmitidos oralmente de generación en generación, en el dialecto Alemannisch que los colonos trajeron desde el sur de Alemania hasta la Colonia Tovar. Un legado vivo que Endingen olvidó y Venezuela preservó por más de 130 años.',
      'contexto-h2':      'El Jokili Sprichli: dichos de carnaval',
      'contexto-p1':      'El Jokili, como organización formal, llega a la Colonia Tovar en el año 1976. No obstante, ese hombre que jugaba al Carnaval llegó a Venezuela con los colonos gracias al Jokili-Sprichli: dichos que narran en forma de rimas, en el dialecto Alemannisch, las aventuras y ocurrencias del arlequín. Estos eran recitados por colonos y colonieros transmitiéndolos de una generación a otra.',
      'contexto-p2':      'En 1974, Franz Vollherbst confirmó durante su visita a la Colonia Tovar que "el Jokili-Sprichli era conocido por todos y que se había mantenido por más de 130 años". Lo extraordinario es que la mayoría de estos dichos ya no se utilizan en Endingen porque fueron olvidados o reemplazados por canciones nuevas. El Sprichli nos vincula con nuestros orígenes y son parte del legado oral dejado por nuestros antepasados.',
      'contexto-p3':      'El Jokili-Sprichli fue además la inspiración para que la nueva generación de arlequines compusiera su himno: una canción en Alemannisch acompañada por instrumentos tradicionales venezolanos y alemanes, estrenada en la celebración de los 225 años del Jokili de Endingen, en enero de 2007.',
      'dichos-titulo':    'Los dichos',
      'dicho-lang-es':    'Español',
      'dicho-audio-label':'Escuchar',
      'narri-eyebrow':    'Canción del Tovarer Jokili',
      'nota-pie':         'Las traducciones no son textuales, son aproximaciones porque algunas de las palabras no tienen equivalentes en español.',
    },
    de: {
      'banner-subtitulo': 'Alemannischer Dialekt',
      'intro-p':          'Karnevalssprüche, die mündlich von Generation zu Generation weitergegeben wurden – im alemannischen Dialekt, den die Kolonisten aus Süddeutschland in die Colonia Tovar mitbrachten. Ein lebendiges Erbe, das Endingen vergessen hat und Venezuela seit mehr als 130 Jahren bewahrt.',
      'contexto-h2':      'Der Jokili Sprichli: Fasnetsprüche',
      'contexto-p1':      'Der Jokili als formelle Organisation kam 1976 in die Colonia Tovar. Dennoch war dieser Fasnetnarr schon mit den Kolonisten nach Venezuela gekommen – dank des Jokili-Sprichli: Reime im alemannischen Dialekt, die die Abenteuer und Scherze des Harlekins erzählen. Sie wurden von den Kolonisten und ihren Nachkommen rezitiert und von Generation zu Generation weitergegeben.',
      'contexto-p2':      '1974 bestätigte Franz Vollherbst während seines Besuchs in der Colonia Tovar, dass „der Jokili-Sprichli allen bekannt war und sich seit mehr als 130 Jahren erhalten hatte". Das Besondere daran ist, dass die meisten dieser Sprüche in Endingen nicht mehr verwendet werden, da sie vergessen oder durch neue Lieder ersetzt wurden. Der Sprichli verbindet uns mit unseren Wurzeln und ist Teil des mündlichen Erbes unserer Vorfahren.',
      'contexto-p3':      'Der Jokili-Sprichli war auch die Inspiration für die neue Generation der Harlekins, ihre Hymne zu komponieren: ein Lied auf Alemannisch, begleitet von traditionellen venezolanischen und deutschen Instrumenten, uraufgeführt anlässlich des 225-jährigen Jubiläums des Jokili von Endingen im Januar 2007.',
      'dichos-titulo':    'Die Sprüche',
      'dicho-lang-es':    'Spanisch',
      'dicho-audio-label':'Hören',
      'narri-eyebrow':    'Lied des Tovarer Jokili',
      'nota-pie':         'Die Übersetzungen sind nicht wörtlich, sondern Annäherungen, da manche Wörter keine deutschen Entsprechungen haben.',
    }
  };

  function applyTranslations(lang) {
    const dict = T[lang] || T.es;

    // Elementos únicos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // Etiquetas de idioma en columnas español (repetidas en cada card)
    document.querySelectorAll('.dicho-col.espanol .dicho-lang').forEach(el => {
      el.innerHTML = dict['dicho-lang-es'];
    });

    // Etiquetas de audio (repetidas en cada card)
    document.querySelectorAll('.dicho-audio-label').forEach(el => {
      el.innerHTML = dict['dicho-audio-label'];
    });

    document.documentElement.lang = lang;
    document.title = lang === 'de'
      ? 'Jokili Sprichli – Jokili Verein'
      : 'Jokili Sprichli – Jokili Verein';
  }

  window.__setLang = function (lang) {
    applyTranslations(lang);
  };

  const init = localStorage.getItem('jokili-lang') || 'es';
  if (init !== 'es') applyTranslations(init);
})();
