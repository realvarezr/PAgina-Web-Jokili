/**
 * header.js — Header universal Jokili Verein
 * Se inyecta automáticamente en todas las páginas.
 * Para añadir una página nueva al menú, solo modifica este archivo.
 */
(function () {

  // ── Detectar página actual ──────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = (page === 'index.html' || page === '');
  const homeHref = isIndex ? '/' : './';

  // Subpáginas del dropdown "El Jokili" (sin Historia)
  const jokiliPages = ['personajes.html','traje.html','sprichli.html','eventos.html','rituales.html'];
  const jokiliActive = jokiliPages.includes(page);

  // Marca el link activo en dorado
  function active(target) {
    return page === target ? ' style="color:var(--dorado-claro)"' : '';
  }

  // ── HTML del header ─────────────────────────────────────
  const html = `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">

      <a href="${homeHref}" class="header-logo" aria-label="Tovarerjokili – Inicio">
        <div class="logo-placeholder">
          <img src="imagenes/Gorro.png" alt="Tovarerjokili Logo">
        </div>
      </a>

      <div class="header-nav">
        <ul class="nav-left">
          <li><a href="${homeHref}"${active('index.html')}>Inicio</a></li>
          <li><span class="nav-divider">◆</span></li>
          <li><a href="historia"${active('historia.html')}>Historia</a></li>
        </ul>
        <span class="nav-divider nav-center-divider">◆</span>
        <ul class="nav-right">
          <li class="has-dropdown${jokiliActive ? ' dropdown-active' : ''}">
            <button class="dropdown-trigger" aria-expanded="false" aria-haspopup="true">
              El Jokili
              <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <ul class="dropdown-menu" role="menu">
              <li><a href="personajes"${active('personajes.html')} role="menuitem">Personajes</a></li>
              <li><a href="traje"${active('traje.html')} role="menuitem">Traje</a></li>
              <li><a href="sprichli"${active('sprichli.html')} role="menuitem">El Sprichli</a></li>
              <li><a href="rituales"${active('rituales.html')} role="menuitem">Rituales</a></li>
              <li class="dropdown-divider"></li>
              <li><a href="eventos"${active('eventos.html')} class="drop-highlight" role="menuitem">Eventos&nbsp;/&nbsp;Carnaval</a></li>
            </ul>
          </li>
          <li><span class="nav-divider">◆</span></li>
          <li><a href="contacto"${active('contacto.html')}>Contacto</a></li>
        </ul>
      </div>

      <div class="mobile-toggle-wrap" style="display:none;">
        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>
  </header>

  <nav class="mobile-nav" id="mobileNav">
    <a href="${homeHref}">Inicio</a>
    <a href="historia">Historia</a>
    <button class="mobile-section-toggle" id="mobileJokiliToggle" aria-expanded="false">
      El Jokili <span class="mobile-toggle-arrow">▾</span>
    </button>
    <div class="mobile-submenu" id="mobileJokiliSub">
      <a href="personajes" class="mobile-sub">Personajes</a>
      <a href="traje" class="mobile-sub">Traje</a>
      <a href="sprichli" class="mobile-sub">El Sprichli</a>
      <a href="rituales" class="mobile-sub">Rituales</a>
      <a href="eventos" class="mobile-sub">Eventos / Carnaval</a>
    </div>
    <a href="contacto">Contacto</a>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── Referencias ─────────────────────────────────────────
  const header     = document.getElementById('siteHeader');
  const toggle     = document.getElementById('menuToggle');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileWrap = document.querySelector('.mobile-toggle-wrap');
  const dropItem   = document.querySelector('.has-dropdown');
  const dropBtn    = dropItem ? dropItem.querySelector('.dropdown-trigger') : null;
  const dropMenu   = dropItem ? dropItem.querySelector('.dropdown-menu') : null;

  // ── Dropdown desktop ─────────────────────────────────────
  if (dropBtn && dropMenu) {
    function openDrop() {
      dropMenu.classList.add('open');
      dropBtn.setAttribute('aria-expanded', 'true');
    }
    function closeDrop() {
      dropMenu.classList.remove('open');
      dropBtn.setAttribute('aria-expanded', 'false');
    }

    // Hover (desktop)
    dropItem.addEventListener('mouseenter', openDrop);
    dropItem.addEventListener('mouseleave', closeDrop);

    // Click / touch
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropMenu.classList.contains('open');
      isOpen ? closeDrop() : openDrop();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', closeDrop);
    dropMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // ── Scroll ───────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Responsive hamburguesa ───────────────────────────────
  const mq = window.matchMedia('(max-width: 768px)');
  function handleMQ(e) {
    mobileWrap.style.display = e.matches ? 'flex' : 'none';
  }
  mq.addEventListener('change', handleMQ);
  handleMQ(mq);

  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // ── Acordeón "El Jokili" en móvil ───────────────────────
  const jokiliToggle = document.getElementById('mobileJokiliToggle');
  const jokiliSub    = document.getElementById('mobileJokiliSub');
  if (jokiliToggle && jokiliSub) {
    // Si la página actual es una subpágina del dropdown, abrirlo por defecto
    if (jokiliPages.includes(page)) {
      jokiliSub.classList.add('open');
      jokiliToggle.setAttribute('aria-expanded', 'true');
    }
    jokiliToggle.addEventListener('click', () => {
      const open = jokiliSub.classList.toggle('open');
      jokiliToggle.setAttribute('aria-expanded', String(open));
    });
  }

})();
