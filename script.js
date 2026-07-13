/* ═══════════════════════════════════
   MURTAZIM ACADEMY — script.js
   ═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ─── 2. HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const spans = hamburger.querySelectorAll('span');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity = open ? '0' : '';
    spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));

  /* ─── 3. DARK MODE ─── */
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('ma-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ma-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  /* ─── 4. PARTICLES ─── */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a = Math.random() * 0.35 + 0.08;
      // Alternate green and blue particles
      this.color = Math.random() > 0.5 ? '5,154,71' : '17,120,184';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a})`;
      ctx.fill();
    }
  }

  const initP = () => { particles = Array.from({ length: 80 }, () => new Particle()); };
  initP();

  const connectP = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(5,154,71,${0.08 * (1 - d / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  const animP = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectP();
    requestAnimationFrame(animP);
  };
  animP();

  /* ─── 5. SCROLL REVEAL ─── */
  const revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revEls.forEach(el => revObs.observe(el));

  /* ─── 6. STAT COUNTERS ─── */
  const counters = document.querySelectorAll('.hnum');
  let counted = false;

  const runCounters = () => {
    counters.forEach(el => {
      const target = +el.getAttribute('data-target');
      let frame = 0;
      const steps = 65;
      const tick = () => {
        frame++;
        const eased = 1 - Math.pow(1 - frame / steps, 3);
        el.textContent = Math.round(target * eased);
        if (frame < steps) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    });
    counted = true;
  };

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) runCounters();
  }, { threshold: 0.3 }).observe(document.querySelector('.hero'));

  /* ─── 7. COURSE FILTER ─── */
  const filterBtns = document.querySelectorAll('.f-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      courseCards.forEach(card => {
        const cats = card.getAttribute('data-cat') || '';
        const match = filter === 'all' || cats.split(' ').includes(filter);
        card.classList.toggle('hidden', !match);
        if (match) {
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 60);
        }
      });
    });
  });

  /* ─── 8. CONTACT FORM (Web3Forms) ─── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    success.classList.remove('show');
    errorEl.classList.remove('show');

    try {
      const data = new FormData(form);
      const res  = await fetch('https://api.web3forms.com/submit', {
        method : 'POST',
        body   : data
      });
      const json = await res.json();

      if (json.success) {
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 6000);
      } else {
        errorEl.classList.add('show');
        setTimeout(() => errorEl.classList.remove('show'), 6000);
      }
    } catch (err) {
      errorEl.classList.add('show');
      setTimeout(() => errorEl.classList.remove('show'), 6000);
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });

  /* ─── 9. SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 10. ACTIVE NAV LINK ─── */
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav-links a');

  sections.forEach(s => {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        allLinks.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (match) match.classList.add('active');
      }
    }, { threshold: 0.4 }).observe(s);
  });

  /* ─── 11. HERO PARALLAX ─── */
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroContent) heroContent.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });

  /* ─── 12. TEACHER CARD STAGGER ─── */
  const teacherCards = document.querySelectorAll('.teacher-card');
  teacherCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });

  /* ─── 13. PILLAR CARD STAGGER ─── */
  const pillarCards = document.querySelectorAll('.pillar-card');
  pillarCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

});
