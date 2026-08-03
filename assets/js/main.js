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
  // Language roots (e.g. '/' or '/zh-cn') are treated as home pages
  const langRoots = ['', '/zh-cn'];

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalizedHref = href.replace(/\/$/, '');

    // Home link: only highlight when actually on the home page
    if (langRoots.indexOf(normalizedHref) !== -1) {
      const isHome =
        currentPath === normalizedHref ||
        currentPath === normalizedHref + '/index' ||
        currentPath === normalizedHref + '/index.html' ||
        currentPath === '/index';
      if (isHome) link.classList.add('active');
      return;
    }

    // Other links: exact match or child path match
    if (
      currentPath === normalizedHref ||
      currentPath === normalizedHref + '.html' ||
      currentPath.indexOf(normalizedHref + '/') === 0
    ) {
      link.classList.add('active');
    }
  });

  // ─── Password visibility toggle (auth pages) ───
  document.querySelectorAll('.auth-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.auth-input-wrap');
      if (!wrap) return;
      const input = wrap.querySelector('.auth-password');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
    });
  });
})();
