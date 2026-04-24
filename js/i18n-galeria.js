/* Traducciones ES / DE - galeria.html */
(function () {
  const T = {
    es: {
      ui: {
        'banner-eyebrow': 'Memoria Viva del Carnaval',
        'banner-titulo': 'Galería Jokili',
        'beta-kicker': 'Version beta',
        'beta-title': 'Galeria en actualizacion',
        'beta-text': 'Estamos actualizando las fotos de los albumes. Algunas imagenes o colecciones pueden cambiar mientras se completa la galeria.',
        'beta-toggle-show': 'Ver detalles',
        'beta-details': 'Las secciones estan disponibles para navegar, pero el contenido fotografico seguira creciendo y reorganizandose por album. Gracias por revisar esta version mientras afinamos la memoria visual del Jokili.',
        'nav-fotos-viejas': 'Fotos Viejas',
        'nav-desfile': 'Desfile',
        'nav-personajes': 'Personajes',
        'nav-rituales': 'Rituales',
        'sec-fotos-viejas': 'Fotos <span>Viejas</span>',
        'sec-desfile': 'El <span>Desfile</span>',
        'sec-personajes': 'Los <span>Personajes</span>',
        'sec-rituales': 'Los <span>Rituales</span>'
      },
      aria: {
        banner: 'Galería Jokili',
        nav: 'Secciones de la galería',
        albumModal: 'Álbum de fotos',
        albumClose: 'Cerrar álbum',
        lightbox: 'Vista de imagen',
        close: 'Cerrar',
        prev: 'Anterior',
        next: 'Siguiente',
        betaClose: 'Cerrar aviso'
      },
      beta: {
        show: 'Ver detalles',
        hide: 'Ocultar detalles'
      },
      title: 'Galería - Jokili Verein',
      gallery: {
        fotos: {
          raices: [
            { titulo: 'Raíces Jokili', meta: 'Origen del carnaval' },
            { titulo: 'Generaciones', meta: 'Tradición familiar' }
          ],
          archivoHistorico: [
            { titulo: 'Memoria Carnavalera', meta: 'Colección histórica' }
          ],
          archivoVivo: [
            { titulo: 'Archivo Vivo', meta: 'Historia del carnaval' }
          ],
          desfileApertura: [
            { titulo: 'Desfile Principal', meta: 'Carnaval · Colonia Tovar' },
            { titulo: 'Estandartes', meta: 'Inicio del recorrido' }
          ],
          desfileRecorrido: [
            { titulo: 'Recorrido Jokili', meta: 'Tradición y desfile' },
            { titulo: 'Calle y Fiesta', meta: 'Desfile popular' }
          ],
          desfileCierre: [
            { titulo: 'Despedida', meta: 'Cierre de temporada' },
            { titulo: 'Último Recorrido', meta: 'Final del carnaval' }
          ],
          oberjokiliCiguena: [
            { titulo: 'Cigüeña', meta: 'Personaje tradicional' },
            { titulo: 'Oberjokili', meta: 'Personaje emblemático' },
            { titulo: 'Traje y Personajes', meta: 'Comparsa Jokili' },
            { titulo: 'Guardia Jokili', meta: 'Personajes del año' },
            { titulo: 'Jokili en Acción', meta: 'Carnaval' }
          ],
          zunfmeistern: [
            { titulo: 'Zunfmeistern', meta: 'Comparsa Jokili' },
            { titulo: 'Batas Blancas', meta: 'Personajes del desfile' },
            { titulo: 'Tradición Viva', meta: 'Carnaval y comunidad' }
          ],
          stattierNochCrop: [
            { titulo: 'Stadttier', meta: 'Personaje tradicional' },
            { titulo: 'Noch Crop', meta: 'Personajes del año' },
            { titulo: 'Jokili en Acción', meta: 'Carnaval' }
          ],
          ritualMisa: [
            { titulo: 'Misa Tradicional', meta: 'Rituales del carnaval' },
            { titulo: 'Entrada a la Iglesia', meta: 'Inicio ceremonial' }
          ],
          ritualBautismo: [
            { titulo: 'Bautismo Jokili', meta: 'Ceremonia comunitaria' },
            { titulo: 'Tradición en Escena', meta: 'Rituales y cultura' }
          ],
          ritualFasnet: [
            { titulo: 'Fasnet Jokili', meta: 'Ceremonias anuales' },
            { titulo: 'Celebración Fasnet', meta: 'Carnaval y comunidad' }
          ],
          ritualDespedida: [
            { titulo: 'Despedida del Espíritu', meta: 'Cierre del carnaval' },
            { titulo: 'Último Ritual', meta: 'Final de temporada' }
          ],
          rituales: [
            { titulo: 'Misa Tradicional', meta: 'Rituales del carnaval' },
            { titulo: 'Encuentro Ritual', meta: 'Ceremonia comunitaria' },
            { titulo: 'Tradición en Escena', meta: 'Rituales y cultura' },
            { titulo: 'Los Rituales', meta: 'Ceremonias anuales' }
          ]
        },
        albumesFotosViejas: {
          raices: { titulo: 'Raíces Jokili', meta: 'Origen y primeras memorias' },
          archivoHistorico: { titulo: 'Archivo Histórico', meta: 'Registros antiguos del carnaval' },
          archivoVivo: { titulo: 'Archivo Vivo', meta: 'Recuerdos que siguen presentes' }
        },
        albumesDesfile: {
          desfileApertura: { titulo: 'Apertura del Desfile', meta: 'Primeros pasos del recorrido' },
          desfileRecorrido: { titulo: 'Recorrido Jokili', meta: 'Calles, comparsa y tradición' },
          desfileCierre: { titulo: 'Cierre y Despedida', meta: 'El final de la temporada' }
        },
        albumesPersonajes: {
          oberjokiliCiguena: { titulo: 'Oberjokili Cigüeña', meta: 'Personajes centrales de la tradicion' },
          zunfmeistern: { titulo: 'Zunfmeistern', meta: 'Figuras y guardianes del carnaval' },
          stattierNochCrop: { titulo: 'Stattier und Noch Crop', meta: 'Personajes del recorrido Jokili' }
        },
        albumesRituales: {
          ritualMisa: { titulo: 'Misa', meta: 'Celebracion religiosa del carnaval' },
          ritualBautismo: { titulo: 'Bautismo Jokili', meta: 'Rito de bienvenida y tradicion' },
          ritualFasnet: { titulo: 'Fasnet', meta: 'Fiesta y ceremonia carnavalesca' },
          ritualDespedida: { titulo: 'Despedida del Espiritu del Carnaval', meta: 'Cierre ritual de la temporada' }
        }
      }
    },
    de: {
      ui: {
        'banner-eyebrow': 'Lebendige Erinnerung der Fasnet',
        'banner-titulo': 'Jokili Galerie',
        'beta-kicker': 'Beta-Version',
        'beta-title': 'Galerie wird aktualisiert',
        'beta-text': 'Wir aktualisieren die Fotos der Alben. Einige Bilder oder Sammlungen können sich ändern, während die Galerie vervollständigt wird.',
        'beta-toggle-show': 'Details anzeigen',
        'beta-details': 'Die Bereiche können bereits durchsucht werden, doch der fotografische Inhalt wird weiter wachsen und nach Alben neu geordnet. Danke, dass du diese Version prüfst, während wir das visuelle Gedächtnis des Jokili verfeinern.',
        'nav-fotos-viejas': 'Alte Fotos',
        'nav-desfile': 'Umzug',
        'nav-personajes': 'Figuren',
        'nav-rituales': 'Rituale',
        'sec-fotos-viejas': 'Alte <span>Fotos</span>',
        'sec-desfile': 'Der <span>Umzug</span>',
        'sec-personajes': 'Die <span>Figuren</span>',
        'sec-rituales': 'Die <span>Rituale</span>'
      },
      aria: {
        banner: 'Jokili Galerie',
        nav: 'Bereiche der Galerie',
        albumModal: 'Fotoalbum',
        albumClose: 'Album schließen',
        lightbox: 'Bildansicht',
        close: 'Schließen',
        prev: 'Zurück',
        next: 'Weiter',
        betaClose: 'Hinweis schließen'
      },
      beta: {
        show: 'Details anzeigen',
        hide: 'Details ausblenden'
      },
      title: 'Galerie - Jokili Verein',
      gallery: {
        fotos: {
          raices: [
            { titulo: 'Jokili-Wurzeln', meta: 'Ursprung der Fasnet' },
            { titulo: 'Generationen', meta: 'Familientradition' }
          ],
          archivoHistorico: [
            { titulo: 'Fasnet-Erinnerung', meta: 'Historische Sammlung' }
          ],
          archivoVivo: [
            { titulo: 'Lebendiges Archiv', meta: 'Geschichte der Fasnet' }
          ],
          desfileApertura: [
            { titulo: 'Hauptumzug', meta: 'Fasnet · Colonia Tovar' },
            { titulo: 'Standarten', meta: 'Beginn des Rundgangs' }
          ],
          desfileRecorrido: [
            { titulo: 'Jokili-Rundgang', meta: 'Tradition und Umzug' },
            { titulo: 'Straße und Fest', meta: 'Volksumzug' }
          ],
          desfileCierre: [
            { titulo: 'Abschied', meta: 'Ende der Saison' },
            { titulo: 'Letzter Rundgang', meta: 'Abschluss der Fasnet' }
          ],
          oberjokiliCiguena: [
            { titulo: 'Storch', meta: 'Traditionelle Figur' },
            { titulo: 'Oberjokili', meta: 'Sinnbildliche Figur' },
            { titulo: 'Kostüm und Figuren', meta: 'Jokili-Gruppe' },
            { titulo: 'Jokili-Wache', meta: 'Figuren des Jahres' },
            { titulo: 'Jokili in Aktion', meta: 'Fasnet' }
          ],
          zunfmeistern: [
            { titulo: 'Zunftmeister', meta: 'Jokili-Gruppe' },
            { titulo: 'Weiße Hemden', meta: 'Figuren des Umzugs' },
            { titulo: 'Lebendige Tradition', meta: 'Fasnet und Gemeinschaft' }
          ],
          stattierNochCrop: [
            { titulo: 'Stadttier', meta: 'Traditionelle Figur' },
            { titulo: 'Noch Crop', meta: 'Figuren des Jahres' },
            { titulo: 'Jokili in Aktion', meta: 'Fasnet' }
          ],
          ritualMisa: [
            { titulo: 'Traditionelle Messe', meta: 'Rituale der Fasnet' },
            { titulo: 'Eingang zur Kirche', meta: 'Zeremonieller Beginn' }
          ],
          ritualBautismo: [
            { titulo: 'Jokili-Taufe', meta: 'Gemeinschaftliche Zeremonie' },
            { titulo: 'Tradition auf der Bühne', meta: 'Rituale und Kultur' }
          ],
          ritualFasnet: [
            { titulo: 'Jokili-Fasnet', meta: 'Jährliche Zeremonien' },
            { titulo: 'Fasnet-Feier', meta: 'Fasnet und Gemeinschaft' }
          ],
          ritualDespedida: [
            { titulo: 'Abschied vom Geist', meta: 'Abschluss der Fasnet' },
            { titulo: 'Letztes Ritual', meta: 'Ende der Saison' }
          ],
          rituales: [
            { titulo: 'Traditionelle Messe', meta: 'Rituale der Fasnet' },
            { titulo: 'Rituelles Treffen', meta: 'Gemeinschaftliche Zeremonie' },
            { titulo: 'Tradition auf der Bühne', meta: 'Rituale und Kultur' },
            { titulo: 'Die Rituale', meta: 'Jährliche Zeremonien' }
          ]
        },
        albumesFotosViejas: {
          raices: { titulo: 'Jokili-Wurzeln', meta: 'Ursprung und erste Erinnerungen' },
          archivoHistorico: { titulo: 'Historisches Archiv', meta: 'Alte Aufzeichnungen der Fasnet' },
          archivoVivo: { titulo: 'Lebendiges Archiv', meta: 'Erinnerungen, die weiterleben' }
        },
        albumesDesfile: {
          desfileApertura: { titulo: 'Eröffnung des Umzugs', meta: 'Die ersten Schritte des Rundgangs' },
          desfileRecorrido: { titulo: 'Jokili-Rundgang', meta: 'Straßen, Gruppe und Tradition' },
          desfileCierre: { titulo: 'Abschluss und Abschied', meta: 'Das Ende der Saison' }
        },
        albumesPersonajes: {
          oberjokiliCiguena: { titulo: 'Oberjokili und Storch', meta: 'Zentrale Figuren der Tradition' },
          zunfmeistern: { titulo: 'Zunftmeister', meta: 'Figuren und Hüter der Fasnet' },
          stattierNochCrop: { titulo: 'Stadttier und Noch Crop', meta: 'Figuren des Jokili-Rundgangs' }
        },
        albumesRituales: {
          ritualMisa: { titulo: 'Messe', meta: 'Religiöse Feier der Fasnet' },
          ritualBautismo: { titulo: 'Jokili-Taufe', meta: 'Willkommensritus und Tradition' },
          ritualFasnet: { titulo: 'Fasnet', meta: 'Fest und Fasnetszeremonie' },
          ritualDespedida: { titulo: 'Abschied vom Fasnetgeist', meta: 'Ritueller Abschluss der Saison' }
        }
      }
    }
  };

  function applyTranslations(lang) {
    const dict = T[lang] || T.es;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict.ui[key] !== undefined) el.innerHTML = dict.ui[key];
    });

    const banner = document.querySelector('.galeria-banner');
    const nav = document.querySelector('.sec-nav');
    const albumModal = document.getElementById('albumModal');
    const albumClose = document.getElementById('albumClose');
    const lightbox = document.getElementById('lightbox');
    const close = document.getElementById('lbClose');
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    const betaClose = document.getElementById('galeriaBetaClose');

    if (banner) banner.setAttribute('aria-label', dict.aria.banner);
    if (nav) nav.setAttribute('aria-label', dict.aria.nav);
    if (albumModal) albumModal.setAttribute('aria-label', dict.aria.albumModal);
    if (albumClose) albumClose.setAttribute('aria-label', dict.aria.albumClose);
    if (lightbox) lightbox.setAttribute('aria-label', dict.aria.lightbox);
    if (close) close.setAttribute('aria-label', dict.aria.close);
    if (prev) prev.setAttribute('aria-label', dict.aria.prev);
    if (next) next.setAttribute('aria-label', dict.aria.next);
    if (betaClose) betaClose.setAttribute('aria-label', dict.aria.betaClose);

    window.__galeriaBetaLabels = dict.beta;
    if (typeof window.__galeriaUpdateBetaToggle === 'function') {
      window.__galeriaUpdateBetaToggle();
    }

    if (typeof window.__galeriaApplyI18n === 'function') {
      window.__galeriaApplyI18n(lang, dict.gallery);
    }

    document.documentElement.lang = lang;
    document.title = dict.title;
  }

  window.__setLang = function (lang) {
    applyTranslations(lang);
  };

  const init = localStorage.getItem('jokili-lang') || 'es';
  applyTranslations(init);
})();
