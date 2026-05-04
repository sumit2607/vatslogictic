// ─── NAVBAR SCROLL ───────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── HAMBURGER MENU ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ─── FADE-IN OBSERVER ────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── ANIMATED COUNTERS ───────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = (current >= 1000 ? (current / 1000).toFixed(1) + 'K' : Math.floor(current)) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── CANVAS PARTICLE ANIMATION ───────────────────────────────────────────────
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,209,255' : '123,97,255';
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 120; i++) particles.push(new Particle());
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,209,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── CONTACT FORM ────────────────────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const req = document.getElementById('requirement').value.trim();
    if (!name || !phone || !req) { alert('Please fill all fields.'); return; }
    const msg = `Hi, I'm ${name} (${phone}). My requirement: ${req}`;
    const url = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    form.reset();
  });
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── GALLERY FILTER ──────────────────────────────────────────────────────────
const galleryData = [
  { src: 'portfolio_images/port1.jpeg', title: 'Bulk Storage Operations',        cat: 'Warehouse',  desc: 'Secure stacking & organized inventory management at our partner warehouse' },
  { src: 'portfolio_images/port2.jpeg', title: 'Dispatch Ready Inventory',       cat: 'Warehouse',  desc: 'Professionally packed and labelled shipments queued for delivery dispatch' },
  { src: 'portfolio_images/port3.jpeg', title: 'Premium Vehicle Packaging',      cat: 'Packaging',  desc: 'Full bubble wrap & tape protection for fragile two-wheelers — zero damage guaranteed' },
  { src: 'portfolio_images/port4.jpeg', title: '360° Protective Wrap',           cat: 'Packaging',  desc: 'Complete rear-to-front protection for safe intercity vehicle transportation' },
  { src: 'portfolio_images/port5.jpeg', title: 'Long-Distance Vehicle Shipping', cat: 'Transport',  desc: 'Secured two-wheeler transport across India with full insurance coverage' },
];

const filterBtns   = document.querySelectorAll('.gallery-filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    const filter = btn.dataset.filter;
    galleryItems.forEach((item, i) => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) {
        item.style.display = '';
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animationDelay = (i * 60) + 'ms';
        item.style.animation = 'galleryFadeIn 0.45s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

let currentLBIndex = 0;

function getVisibleItems() {
  return [...galleryItems].filter(item => item.style.display !== 'none');
}

function openLightbox(idx) {
  const visible = getVisibleItems();
  if (!visible.length) return;
  currentLBIndex = ((idx % visible.length) + visible.length) % visible.length;
  const dataIdx  = parseInt(visible[currentLBIndex].dataset.index);
  const data     = galleryData[dataIdx];
  lightboxImg.src           = data.src;
  lightboxImg.alt           = data.title;
  lightboxCaption.textContent = data.title + ' — ' + data.desc;
  lightboxCounter.textContent = (currentLBIndex + 1) + ' / ' + visible.length;
  lightboxOverlay.classList.add('active');
  lightboxOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOverlay.classList.remove('active');
  lightboxOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

function showLBNext() { openLightbox(currentLBIndex + 1); }
function showLBPrev() { openLightbox(currentLBIndex - 1); }

// Zoom button → open lightbox
document.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const item    = btn.closest('.gallery-item');
    const visible = getVisibleItems();
    openLightbox(visible.indexOf(item));
  });
});

// Card click → open lightbox
galleryItems.forEach(item => {
  item.addEventListener('click', e => {
    if (e.target.closest('.gallery-zoom-btn')) return;
    const visible = getVisibleItems();
    openLightbox(visible.indexOf(item));
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click',  e => { e.stopPropagation(); showLBNext(); });
lightboxPrev.addEventListener('click',  e => { e.stopPropagation(); showLBPrev(); });
lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightboxOverlay.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') showLBNext();
  if (e.key === 'ArrowLeft')  showLBPrev();
});

let touchStartX = 0;
lightboxOverlay.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightboxOverlay.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showLBNext() : showLBPrev();
});
