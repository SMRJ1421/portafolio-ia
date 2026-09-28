// Modo claro/oscuro compartido por todas las páginas.
// La preferencia se guarda en localStorage; el atributo data-theme se aplica en el <head> para evitar parpadeos.
(() => {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  if (!toggle || !icon) return;

  const root = document.documentElement;

  const syncIcon = () => {
    icon.className = root.getAttribute('data-theme') === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  };

  const toggleTheme = () => {
    const goDark = root.getAttribute('data-theme') !== 'dark';
    if (goDark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    syncIcon();
    try { localStorage.setItem('theme', goDark ? 'dark' : 'light'); } catch (e) {}
  };

  syncIcon();
  toggle.addEventListener('click', toggleTheme);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
  });
})();
