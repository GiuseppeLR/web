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

  // ─── Easter egg: click avatar → starburst ───
  const eggAvatars = document.querySelectorAll('.hero-avatar, .nav-avatar');
  if (eggAvatars.length) {
    const EGG_COLORS = ['#1d4ed8', '#b45309', '#be185d', '#0e7490', '#7e22ce', '#15803d'];
    let eggLock = false;

    const burstAt = (cx, cy, avatar) => {
      // 1) Avatar bounce
      avatar.classList.remove('egg-pop');
      void avatar.offsetWidth; // restart animation
      avatar.classList.add('egg-pop');

      // 2) Expanding rings
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('span');
        ring.className = 'egg-ring';
        ring.style.left = cx + 'px';
        ring.style.top = cy + 'px';
        ring.style.animationDelay = (i * 0.12).toFixed(2) + 's';
        document.body.appendChild(ring);
      }

      // 3) Colored particles
      const count = window.innerWidth < 640 ? 14 : 22;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 70 + Math.random() * 100;
        const p = document.createElement('span');
        p.className = 'egg-particle';
        const size = 8 + Math.random() * 10;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.borderRadius = '50%';
        p.style.background = EGG_COLORS[i % EGG_COLORS.length];
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        p.style.animationDelay = (Math.random() * 0.15).toFixed(2) + 's';
        document.body.appendChild(p);
      }

      // 4) Twinkling stars (sparks)
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        const dist = 40 + Math.random() * 60;
        const s = document.createElement('span');
        s.className = 'egg-spark';
        s.textContent = '\u2726';
        s.style.left = cx + 'px';
        s.style.top = cy + 'px';
        s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        s.style.animationDelay = (Math.random() * 0.2).toFixed(2) + 's';
        document.body.appendChild(s);
      }

      // Cleanup
      setTimeout(() => {
        avatar.classList.remove('egg-pop');
        document.querySelectorAll('.egg-ring, .egg-particle, .egg-spark').forEach(n => n.remove());
        eggLock = false;
      }, 1200);
    };

    eggAvatars.forEach(avatar => {
      avatar.classList.add('egg-avatar');
      // Desktop: trigger on hover; touch devices: trigger on tap
      const canHover = window.matchMedia('(hover: hover)').matches;
      const trigger = () => {
        if (eggLock) return;
        eggLock = true;
        const rect = avatar.getBoundingClientRect();
        burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, avatar);
      };
      if (canHover) avatar.addEventListener('mouseenter', trigger);
      avatar.addEventListener('click', trigger);
    });
  }

  // ─── Scroll trail effect (all platforms) ───
  const TRAIL_COLORS = ['#1d4ed8', '#b45309', '#be185d', '#0e7490', '#7e22ce', '#15803d'];
  let lastScrollY = window.scrollY;
  let trailScheduled = false;

  const spawnScrollTrail = (dir) => {
    const count = window.innerWidth < 640 ? 3 : 5;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'scroll-trail';
      const size = 6 + Math.random() * 8;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      p.style.left = (Math.random() * window.innerWidth) + 'px';
      p.style.top = (dir === 'down' ? -12 : window.innerHeight + 12) + 'px';
      p.style.setProperty('--dx', (Math.random() * 100 - 50) + 'px');
      p.style.setProperty('--dy', (dir === 'down' ? 1 : -1) * (80 + Math.random() * 120) + 'px');
      p.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
      document.body.appendChild(p);
    }
    setTimeout(() => {
      document.querySelectorAll('.scroll-trail').forEach(n => n.remove());
    }, 900);
  };

  window.addEventListener('scroll', () => {
    if (trailScheduled) return;
    trailScheduled = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      if (Math.abs(delta) > 3) {
        spawnScrollTrail(delta > 0 ? 'down' : 'up');
      }
      trailScheduled = false;
    });
  }, { passive: true });

  // ─── QR Code Modal (WeChat / Alipay) ───
  const qrTriggers = document.querySelectorAll('.qr-trigger');
  const qrModal = document.getElementById('qr-modal');
  const qrModalImg = document.getElementById('qr-modal-img');
  const qrModalTitle = document.getElementById('qr-modal-title');
  const qrModalDesc = document.getElementById('qr-modal-desc');
  const qrModalClose = document.getElementById('qr-modal-close');

  if (qrTriggers.length && qrModal && qrModalImg) {
    qrTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.getAttribute('data-qr');
        const title = trigger.getAttribute('data-qr-title') || '';
        const desc = trigger.getAttribute('data-qr-desc') || '';
        if (src) {
          qrModalImg.src = src;
          qrModalImg.alt = title;
          if (qrModalTitle) qrModalTitle.textContent = title;
          if (qrModalDesc) qrModalDesc.textContent = desc;
          qrModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeQr = () => {
      qrModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (qrModalClose) qrModalClose.addEventListener('click', closeQr);
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQr();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && qrModal.classList.contains('active')) closeQr();
    });
  }
})();
