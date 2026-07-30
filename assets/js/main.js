(function() {
  'use strict';

  // ─── Dark Mode ───
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'dark' ? '\u263E' : '\u2600';
    });
  }

  // ─── Mobile Menu ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ─── Active Nav Highlight ───
  const currentPath = window.location.pathname.replace(/\/web\//, '/').replace(/\/$/, '') || '/index';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.startsWith(href.replace(/\/$/, '')) && href !== '/') {
      link.classList.add('active');
    }
    if (href === '/' && (currentPath === '/index' || currentPath === '')) {
      link.classList.add('active');
    }
  });
})();
