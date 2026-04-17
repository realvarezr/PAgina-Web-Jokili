/**
 * footer.js - Footer universal Jokili Verein
 * Inyecta un pie de pagina reutilizable al final de <main>.
 */
(function () {
  const main = document.querySelector('main');
  if (!main || document.querySelector('.site-footer')) return;

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = page === 'index.html' || page === '';
  const homeHref = isIndex ? '/' : './';

  const html = `
  <footer class="site-footer" aria-labelledby="footer-title">
    <div class="footer-inner">
      <div class="footer-top">
        <section class="footer-brand" aria-label="Identidad institucional">
          <div class="footer-brand-mark">
            <img src="imagenes/Escudo_Jokili.png" alt="Escudo Jokili Verein">
            <div class="footer-brand-copy">
              <strong id="footer-title">Jokili Verein 1976</strong>
              <span><a href="https://www.coloniatovar.com" target="_blank" rel="noopener">Colonia Tovar</a> · Venezuela</span>
            </div>
          </div>
          <p class="footer-description">
            El Jokili Verein es la comparsa carnavalesca de la Colonia Tovar, guardiana de una tradicion que une dos mundos: el Kaiserstuhl aleman y las montanas venezolanas.
          </p>
          <div class="footer-redes" aria-label="Redes sociales">
            <a href="https://instagram.com/tovarerjokili" target="_blank" rel="noopener" class="footer-red" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://x.com/tovarerjokili" target="_blank" rel="noopener" class="footer-red" aria-label="X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://tiktok.com/@tovarerjokili" target="_blank" rel="noopener" class="footer-red" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
            </a>
          </div>
        </section>

        <nav class="footer-column" aria-label="Enlaces del sitio">
          <div class="footer-title footer-label">Explora</div>
          <ul class="footer-links">
            <li><a href="${homeHref}">Inicio</a></li>
            <li><a href="historia">Historia</a></li>
            <li><a href="personajes">Personajes</a></li>
            <li><a href="traje">Nuestro traje</a></li>
            <li><a href="eventos">Eventos y carnaval</a></li>
            <li><a href="contacto">Contacto</a></li>
          </ul>
        </nav>

        <section class="footer-column" aria-label="Informacion de contacto">
          <div class="footer-title footer-label">Contacto e informacion</div>
          <ul class="footer-contact-list">
            <li>
              <strong>Ubicacion</strong>
              <span>Colonia Tovar, Estado Aragua, Venezuela</span>
            </li>
            <li>
              <strong>Correo</strong>
              <a href="mailto:contacto@tovarerjokili.com">contacto@tovarerjokili.com</a>
            </li>
            <li>
              <strong>Web</strong>
              <a href="https://tovarerjokili.com" target="_blank" rel="noopener">www.tovarerjokili.com</a>
            </li>
            <li>
              <strong>Temporada</strong>
              <span>Carnaval, memoria cultural y actividades especiales durante el ano</span>
            </li>
          </ul>
        </section>
      </div>

      <div class="footer-divider" aria-hidden="true"></div>

      <div class="footer-bottom">
        <p>Asociacion de Arlequines de la Colonia Tovar 1976 e.V. Jokili Verein</p>
        <p>Diseno y desarrollo por <a href="https://am-itsolutions.de" target="_blank" rel="noopener">AM Solutions</a></p>
      </div>
    </div>
  </footer>`;

  main.insertAdjacentHTML('beforeend', html);
})();
