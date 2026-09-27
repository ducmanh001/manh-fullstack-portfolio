(() => {
  const root = document.documentElement;
  const THEME_KEY = 'portfolio-theme';

  // ---------- theme toggle ----------
  const themeToggle = document.getElementById('theme-toggle');
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  };
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) { /* storage unavailable */ }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // ---------- mobile nav ----------
  const menuBtn = document.getElementById('menu-btn');
  const navPill = document.getElementById('primary-nav');
  menuBtn?.addEventListener('click', () => {
    const isOpen = navPill.classList.toggle('mobile-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  navPill?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navPill.classList.remove('mobile-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- active section highlight ----------
  const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-pill a'));

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === id);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ---------- reveal on scroll ----------
  const revealTargets = document.querySelectorAll(
    '.hero-card, .card, .section-title, .section-sub, .stat-card, .info-card'
  );
  revealTargets.forEach((el) => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- scroll to top ----------
  const toTop = document.getElementById('to-top');
  const toggleToTop = () => {
    if (!toTop) return;
    toTop.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- footer year ----------
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  document.querySelectorAll('.footer-role').forEach((el) => {
    if (el.textContent?.includes('{YEAR}')) {
      el.textContent = el.textContent.replace('{YEAR}', String(new Date().getFullYear()));
    }
  });

  // ---------- contact form (mailto fallback, no backend) ----------
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:manhphan110801@gmail.com?subject=${subject}&body=${body}`;
  });
})();
