/**
 * script.js — Futuristic Portfolio Interactive Logic
 * Features: Particle system, typing effect, scroll reveal,
 *           skill bar animation, mobile nav, form validation.
 */

'use strict';

/* ============================================================
   1. DOM Ready Helper
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
  initActiveNavLinks();
});

/* ============================================================
   2. Particle System (Canvas)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  const CONFIG = {
    count: 70,
    maxRadius: 2.2,
    speed: 0.4,
    connectionDistance: 130,
    connectionOpacity: 0.12,
    colors: ['#00d4ff', '#7b2fff', '#ff006e'],
  };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
      this.r  = Math.random() * CONFIG.maxRadius + 0.5;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = -(Math.random() * CONFIG.speed + 0.2);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
      if (this.x < -10 || this.x > canvas.width + 10) {
        this.vx *= -1;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDistance) {
          const opacity = (1 - dist / CONFIG.connectionDistance) * CONFIG.connectionOpacity;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(loop);
  }

  // Init
  resize();
  buildParticles();
  loop();

  // Handle resize with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      buildParticles();
      loop();
    }, 200);
  });
}

/* ============================================================
   3. Typing Effect
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const strings = [
    'Robotics Engineer',
    'ROS2 Developer',
    'Computer Vision Enthusiast',
    'Mathematics Explorer',
    'ML Researcher',
  ];

  let strIdx   = 0;
  let charIdx  = 0;
  let deleting = false;
  let pauseEnd = false;

  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 400;

  function tick() {
    const current = strings[strIdx];

    if (!deleting && !pauseEnd) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pauseEnd = true;
        setTimeout(() => { pauseEnd = false; deleting = true; tick(); }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else if (deleting) {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        strIdx   = (strIdx + 1) % strings.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  setTimeout(tick, 800);
}

/* ============================================================
   4. Navbar Scroll Behavior
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply on load
}

/* ============================================================
   5. Active Nav Link Highlighting (IntersectionObserver)
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   6. Mobile Hamburger Menu
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   7. Scroll Reveal (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const elements = document.querySelectorAll(revealClasses.join(','));

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   8. Skill Bar Animation
   ============================================================ */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const bars = skillSection.querySelectorAll('.skill-bar-item');
  if (!bars.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          bars.forEach(bar => {
            const fill  = bar.querySelector('.skill-bar-fill');
            const level = bar.getAttribute('data-level');
            if (fill && level) {
              // Slight delay so the section is fully visible first
              setTimeout(() => {
                bar.classList.add('animate');
                fill.style.width = level;
              }, 200);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillSection);
}

/* ============================================================
   9. Contact Form Validation
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  function showError(group, message) {
    const el = group.querySelector('.form-error');
    if (el) el.textContent = message;
    group.classList.add('has-error');
  }

  function clearError(group) {
    group.classList.remove('has-error');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live validation: clear error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) clearError(group);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameGroup    = form.querySelector('#group-name');
    const emailGroup   = form.querySelector('#group-email');
    const subjectGroup = form.querySelector('#group-subject');
    const msgGroup     = form.querySelector('#group-message');

    const nameVal    = form.querySelector('#name').value.trim();
    const emailVal   = form.querySelector('#email').value.trim();
    const subjectVal = form.querySelector('#subject').value.trim();
    const msgVal     = form.querySelector('#message').value.trim();

    let valid = true;

    // Clear all errors first
    [nameGroup, emailGroup, subjectGroup, msgGroup].forEach(g => {
      if (g) clearError(g);
    });

    if (nameVal.length < 2) {
      showError(nameGroup, 'Name must be at least 2 characters.');
      valid = false;
    }
    if (!validateEmail(emailVal)) {
      showError(emailGroup, 'Please enter a valid email address.');
      valid = false;
    }
    if (subjectVal.length < 3) {
      showError(subjectGroup, 'Please enter a subject.');
      valid = false;
    }
    if (msgVal.length < 10) {
      showError(msgGroup, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // Simulate form submission (replace with actual API call)
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      form.reset();
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1400);
  });
}

/* ============================================================
   10. Smooth Scroll for Anchor Links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
