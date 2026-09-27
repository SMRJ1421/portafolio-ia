// Carrusel simple para la página de detalle de proyecto.
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carrusel-slides');
  const slides = Array.from(document.querySelectorAll('.carrusel-slide'));
  const prevBtn = document.querySelector('.carrusel-prev');
  const nextBtn = document.querySelector('.carrusel-next');
  const dotsContainer = document.querySelector('.carrusel-dots');

  if (!track || slides.length === 0) return;

  let current = 0;

  // Genera un puntito por cada slide
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    update();
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Navegación con flechas del teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  update();
});
