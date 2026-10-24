/* ============================================================
   RIAD MAHMUD JOY — Portfolio JavaScript
   ============================================================ */

'use strict';

// ============================================================
// LOADER
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Start animations after load
    animateStats();
    initSkillBars();
    initTyping();
  }, 1600);
});

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor interactions
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('a, button, .service-card, .project-card, .testimonial-card, .tech-item')) {
    cursorRing.style.width = '50px';
    cursorRing.style.height = '50px';
    cursorRing.style.borderColor = 'rgba(0,212,255,0.8)';
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.matches('a, button, .service-card, .project-card, .testimonial-card, .tech-item')) {
    cursorRing.style.width = '32px';
    cursorRing.style.height = '32px';
    cursorRing.style.borderColor = 'rgba(0,212,255,0.5)';
  }
});

// ============================================================
// PARTICLE CANVAS
// ============================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
    const colors = ['#00d4ff', '#7b2fff', '#ff2d78', '#00ffaa'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < Math.min(count, 80); i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animId = requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
// NAVIGATION
// ============================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}
function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
      link.classList.add('active');
    }
  });
  // Trigger page-specific animations
  setTimeout(() => {
    if (pageId === 'about') initSkillBars();
    if (pageId === 'home') animateStats();
  }, 200);
}

// ============================================================
// TYPED TEXT ANIMATION
// ============================================================
const typedStrings = [
  'Web Designer',
  'Web Developer',
  'UI/UX Designer',
  'Digital Marketer',
  'SEO Specialist',
  'Brand Strategist'
];
let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typedEl = null;

function initTyping() {
  typedEl = document.getElementById('typedText');
  if (typedEl) typeLoop();
}

function typeLoop() {
  const currentString = typedStrings[typedIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = currentString.substring(0, charIndex);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentString.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedStrings.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateStats() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    updateCounter();
  });
}

// ============================================================
// SKILL BARS
// ============================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  bars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    setTimeout(() => {
      bar.style.width = width + '%';
    }, 100);
  });
}

// ============================================================
// PORTFOLIO FILTER
// ============================================================
function filterProjects(category, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter cards
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.classList.remove('hidden');
      card.style.animation = 'pageFadeIn 0.4s ease';
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  // Simulate sending
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    success.classList.add('visible');
  }, 1500);
}

// ============================================================
// INTERSECTION OBSERVER - Animate on scroll within page
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .project-card, .testimonial-card, .tech-item, .process-step').forEach(el => {
  observer.observe(el);
});

// ============================================================
// SMOOTH HOVER TILT EFFECT ON CARDS
// ============================================================
document.querySelectorAll('.service-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
});
