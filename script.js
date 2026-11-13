document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const nav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  /* ---------- Modo oscuro ---------- */
  function applyTheme(isDark) {
    body.classList.toggle('dark', isDark);
    nav.classList.toggle('bg-dark', isDark);
    nav.classList.toggle('bg-primary', !isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    themeIcon.classList.toggle('fa-moon', !isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  function getSavedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem('theme', value); } catch (e) { /* sin almacenamiento */ }
  }

  const saved = getSavedTheme();
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(saved ? saved === 'dark' : media.matches);

  themeToggle.addEventListener('click', () => {
    const goDark = !body.classList.contains('dark');
    applyTheme(goDark);
    saveTheme(goDark ? 'dark' : 'light');
  });

  // Si el usuario no eligió manualmente, sigue el sistema
  media.addEventListener('change', (e) => {
    if (!getSavedTheme()) applyTheme(e.matches);
  });

  /* ---------- Scroll suave con offset del navbar ---------- */
  const navCollapse = document.getElementById('navMenu');
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight - 1);
      window.scrollTo({ top: id === '#inicio' ? 0 : top, behavior: 'smooth' });
      if (navCollapse.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  /* ---------- Enlace activo en el navbar ---------- */
  const sections = document.querySelectorAll('header[id], section[id]');
  const navLinks = document.querySelectorAll('.navbar .nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal + barras de progreso ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.progress-bar').forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => revealObs.observe(el));

  /* ---------- Imágenes con respaldo ---------- */
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/>' +
    '<stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
    '<rect width="600" height="400" fill="url(#g)"/>' +
    '<text x="50%" y="52%" text-anchor="middle" font-family="Arial" font-size="28" fill="#fff">Imagen no disponible</text></svg>'
  );
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.src !== fallbackSvg) img.src = fallbackSvg;
    }, { once: true });
  });

  /* ---------- Formulario (envío simulado) ---------- */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombre || !emailOk || !mensaje) {
      alert('Por favor completa todos los campos con datos válidos.');
      return;
    }
    alert('¡Mensaje enviado! 📧');
    form.reset();

    form.querySelector('button[type="submit"]').blur();
  });

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});