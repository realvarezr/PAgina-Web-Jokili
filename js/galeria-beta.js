(function () {
  const aviso = document.getElementById('galeriaBetaAviso');
  const toggle = document.getElementById('galeriaBetaToggle');
  const close = document.getElementById('galeriaBetaClose');
  const storageKey = 'jokiliGaleriaBetaAvisoCerrado';

  if (!aviso || !toggle || !close) return;

  if (sessionStorage.getItem(storageKey) === '1') {
    aviso.classList.add('oculto');
    return;
  }

  function setToggleText() {
    const labels = window.__galeriaBetaLabels || {
      show: 'Ver detalles',
      hide: 'Ocultar detalles'
    };
    const expanded = aviso.classList.contains('expanded');
    toggle.textContent = expanded ? labels.hide : labels.show;
  }

  window.__galeriaUpdateBetaToggle = setToggleText;

  requestAnimationFrame(() => aviso.classList.add('visible'));
  setToggleText();

  toggle.addEventListener('click', () => {
    const expanded = aviso.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    setToggleText();
  });

  close.addEventListener('click', () => {
    aviso.classList.remove('visible', 'expanded');
    sessionStorage.setItem(storageKey, '1');

    window.setTimeout(() => {
      aviso.classList.add('oculto');
    }, 260);
  });
})();
