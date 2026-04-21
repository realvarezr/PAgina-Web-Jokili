/**
 * header.js — Header universal Jokili Verein
 * Se inyecta automáticamente en todas las páginas.
 * Para añadir una página nueva al menú, solo modifica este archivo.
 */
(function () {

  // ── Estilos del botón de idioma ─────────────────────────
  const flagLink = document.createElement('link');
  flagLink.rel  = 'stylesheet';
  flagLink.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css';
  document.head.appendChild(flagLink);

  const langStyle = document.createElement('style');
  langStyle.textContent = `
    .header-top-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .header-top-row .lang-toggle-btn {
      position: absolute;
      right: 0;
      transform: scale(1.15);
      transform-origin: right center;
    }
    .lang-toggle-btn {
      background: transparent;
      border: 1px solid rgba(201,151,43,.35);
      border-radius: 20px;
      padding: .22rem .65rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: .28rem;
      transition: border-color .2s;
      line-height: 1;
    }
    .lang-toggle-btn:hover { border-color: rgba(201,151,43,.7); }
    .lang-opt {
      display: inline-block;
      font-size: 1.1rem;
      width: 1.333em;
      height: 1em;
      opacity: .45;
      transition: opacity .2s;
      vertical-align: middle;
    }
    .lang-opt.lang-active { opacity: 1; }
    .lang-sep-char {
      font-size: .52rem;
      color: rgba(201,151,43,.3);
    }
    .mobile-lang-btn {
      background: transparent;
      border: 1px solid rgba(201,151,43,.3);
      border-radius: 20px;
      padding: .3rem .7rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .3rem;
      margin-right: .6rem;
    }
  `;
  document.head.appendChild(langStyle);

  // ── Detectar página actual ──────────────────────────────
  const pageRaw = window.location.pathname.split('/').pop() || 'index.html';
  const normalize = (value) => {
    if (!value || value === '/') return 'index';
    return value.replace(/\.html$/i, '');
  };
  const page = normalize(pageRaw);
  const isIndex = (page === 'index');
  const route = (slug) => slug === 'index' ? 'index.html' : `${slug}.html`;
  const homeHref = isIndex ? './' : 'index.html';

  // Subpáginas del dropdown "El Jokili" (sin Historia)
  const jokiliPages = ['personajes','traje','sprichli','eventos','rituales'];
  const jokiliActive = jokiliPages.includes(page);

  // Marca el link activo en dorado
  function active(target) {
    return page === normalize(target) ? ' style="color:var(--dorado-claro)"' : '';
  }

  // ── HTML del header ─────────────────────────────────────
  const html = `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">

      <div class="header-top-row">
        <a href="${homeHref}" class="header-logo" aria-label="Tovarerjokili – Inicio">
          <div class="logo-placeholder">
            <img src="imagenes/Gorro.png" alt="Tovarerjokili Logo">
          </div>
        </a>
        <button class="lang-toggle-btn" id="langToggle" aria-label="Cambiar idioma / Sprache wechseln">
          <span class="lang-opt fi fi-es" data-lang="es"></span>
          <span class="lang-sep-char">|</span>
          <span class="lang-opt fi fi-de" data-lang="de"></span>
        </button>
      </div>

      <div class="header-nav">
        <ul class="nav-left">
          <li><a href="${homeHref}"${active('index.html')}>Inicio</a></li>
          <li><span class="nav-divider">◆</span></li>
          <li><a href="${route('historia')}"${active('historia.html')}>Historia</a></li>
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
              <li><a href="${route('personajes')}"${active('personajes.html')} role="menuitem">Personajes</a></li>
              <li><a href="${route('traje')}"${active('traje.html')} role="menuitem">Traje</a></li>
              <li><a href="${route('sprichli')}"${active('sprichli.html')} role="menuitem">El Sprichli</a></li>
              <li><a href="${route('rituales')}"${active('rituales.html')} role="menuitem">Rituales</a></li>
              <li class="dropdown-divider"></li>
              <li><a href="${route('eventos')}"${active('eventos.html')} class="drop-highlight" role="menuitem">Eventos&nbsp;/&nbsp;Carnaval</a></li>
            </ul>
          </li>
          <li><span class="nav-divider">◆</span></li>
          <li><a href="${route('galeria')}"${active('galeria.html')}>Galeria</a></li>
          <li><span class="nav-divider">◆</span></li>
          <li><a href="${route('contacto')}"${active('contacto.html')}>Contacto</a></li>
        </ul>
      </div>

      <div class="mobile-toggle-wrap" style="display:none;">
        <button class="mobile-lang-btn" id="mobileLangToggle" aria-label="Cambiar idioma">
          <span class="lang-opt fi fi-es" data-lang="es"></span>
          <span class="lang-sep-char">|</span>
          <span class="lang-opt fi fi-de" data-lang="de"></span>
        </button>
        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>
  </header>

  <nav class="mobile-nav" id="mobileNav">
    <a href="${homeHref}">Inicio</a>
    <a href="${route('historia')}">Historia</a>
    <button class="mobile-section-toggle" id="mobileJokiliToggle" aria-expanded="false">
      El Jokili <span class="mobile-toggle-arrow">▾</span>
    </button>
    <div class="mobile-submenu" id="mobileJokiliSub">
      <a href="${route('personajes')}" class="mobile-sub">Personajes</a>
      <a href="${route('traje')}" class="mobile-sub">Traje</a>
      <a href="${route('sprichli')}" class="mobile-sub">El Sprichli</a>
      <a href="${route('rituales')}" class="mobile-sub">Rituales</a>
      <a href="${route('eventos')}" class="mobile-sub">Eventos / Carnaval</a>
    </div>
    <a href="${route('galeria')}">Galeria</a>
    <a href="${route('contacto')}">Contacto</a>
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

    dropItem.addEventListener('mouseenter', openDrop);
    dropItem.addEventListener('mouseleave', closeDrop);

    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropMenu.classList.contains('open');
      isOpen ? closeDrop() : openDrop();
    });

    document.addEventListener('click', closeDrop);
    dropMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // ── Scroll ───────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Responsive hamburguesa ───────────────────────────────
  const mq = window.matchMedia('(max-width: 960px)');
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
    if (jokiliPages.includes(page)) {
      jokiliSub.classList.add('open');
      jokiliToggle.setAttribute('aria-expanded', 'true');
    }
    jokiliToggle.addEventListener('click', () => {
      const open = jokiliSub.classList.toggle('open');
      jokiliToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ── Toggle de idioma ─────────────────────────────────────
  function applyLangUI(lang) {
    document.querySelectorAll('.lang-opt').forEach(el => {
      el.classList.toggle('lang-active', el.dataset.lang === lang);
    });
    if (typeof window.__setLang === 'function') window.__setLang(lang);
  }

  function handleLangClick() {
    const current = localStorage.getItem('jokili-lang') || 'es';
    const next    = current === 'es' ? 'de' : 'es';
    localStorage.setItem('jokili-lang', next);
    applyLangUI(next);
  }

  const langBtn       = document.getElementById('langToggle');
  const mobileLangBtn = document.getElementById('mobileLangToggle');
  if (langBtn)       langBtn.addEventListener('click', handleLangClick);
  if (mobileLangBtn) mobileLangBtn.addEventListener('click', handleLangClick);

  const savedLang = localStorage.getItem('jokili-lang') || 'es';
  applyLangUI(savedLang);

})();
