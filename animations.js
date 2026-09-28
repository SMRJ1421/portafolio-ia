// Animaciones compartidas: barra de progreso, aparición al scroll, efecto de escritura y foco en tarjetas.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Barra de progreso de lectura --- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  const updateBar = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  /* --- Aparición al hacer scroll ---
     Los hijos de un contenedor con data-stagger="ms" entran escalonados (por lote visible).
     Un elemento con data-delay="ms" usa ese retraso fijo (útil para la portada). */
  const items = document.querySelectorAll('.reveal');
  const show = (el, delay) => {
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.classList.add('in');
  };

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => show(el, 0));
  } else {
    const observer = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach(entry => {
        // Lo que quedó por encima de la pantalla (recarga a mitad de página) se muestra sin esperar
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        const el = entry.target;
        const group = el.parentElement && el.parentElement.closest('[data-stagger]');
        const step = group ? Number(group.dataset.stagger) || 80 : 0;
        const delay = el.dataset.delay !== undefined ? Number(el.dataset.delay) : n * step;
        if (group) n++;
        show(el, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => observer.observe(el));
  }

  /* --- Efecto de escritura en la portada --- */
  const typed = document.getElementById('typed');
  if (typed && !reduceMotion) {
    const phrases = (typed.dataset.phrases || '').split('|').filter(Boolean);
    if (phrases.length > 1) {
      let phrase = 0, chars = 0, deleting = false;
      const tick = () => {
        const text = phrases[phrase];
        typed.textContent = text.slice(0, chars);
        let wait = deleting ? 28 : 60;
        if (!deleting && chars === text.length) { deleting = true; wait = 1800; }
        else if (deleting && chars === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; wait = 350; }
        else { chars += deleting ? -1 : 1; }
        setTimeout(tick, wait);
      };
      typed.textContent = '';
      setTimeout(tick, 900);
    }
  }

  /* --- Foco de luz que sigue al cursor en las tarjetas de proyecto --- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
