/* ══════════════════════════════════════════════════════════════
   🎂 BIRTHDAY WEBSITE — MAIN SCRIPT
   ══════════════════════════════════════════════════════════════

   ✏️ CUSTOMIZE SECTION — Edit these values!
   ══════════════════════════════════════════════════════════════ */

// ✏️ List your image filenames from the /images folder here:
const photos = [
  'images/0CD597EB-CC22-4EAB-923C-3387234B2A67_1_105_c.jpeg',
  'images/115B5420-AC7D-4772-A1E3-F8A16B803286_1_105_c.jpeg',
  'images/1248776D-53F1-43B6-AEEA-C0963D80F6BE_1_105_c.jpeg',
  'images/2A887599-EF56-4F7E-8D0F-2D734D8B5F71_1_102_o.jpeg',
  'images/7A669558-7547-46FA-BAB9-CAF4715DB6FF_1_102_o.jpeg',
  'images/92132DC4-63E0-4AD7-9923-62FF63F263D2_1_105_c.jpeg',
  'images/99F7086A-8A05-4C36-A728-1F0688D39062_1_105_c.jpeg',
  'images/AC54E2BC-2343-4623-8104-A0C0552EFA73_1_105_c.jpeg',
  'images/AF8BD994-7030-4CCF-9278-2EDF3AC6E637_1_102_o.jpeg',
  'images/B36E91C2-9869-4A9B-974A-074F8AA8B1E0_1_105_c.jpeg',
  'images/D99279D6-137B-4A89-A756-D5E10E0521B8_1_105_c.jpeg',
  // Add more: 'images/filename.jpeg', etc.
];

// ✏️ Optional captions for each photo (same order as above).
// Leave empty string for auto-caption "Memory #N"
const captions = [
  '',  // Memory #1
  '',  // Memory #2
  '',  // Memory #3
  '',  // Memory #4
  '',  // Memory #5
  '',  // Memory #6
  '',  // Memory #7
  '',  // Memory #8
  '',  // Memory #9
  '',  // Memory #10
  '',  // Memory #11
];

// ✏️ Number of candles on the cake
const CANDLE_COUNT = 5;

// ✏️ COUNTDOWN TARGET: Set the birthday date/time (midnight, local time)
// Format: year, month (0-indexed!), day, hour, minute
const BIRTHDAY_TARGET = new Date(2026, 4, 4, 0, 0, 0); // May 4, 2026 00:00:00

/* ══════════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════════ */
let currentLightbox = 0;
let musicPlaying = false;
let candlesBlown = 0;
let easterEggClicks = 0;
let midnightInterval = null;

/* ══════════════════════════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initMidnightCountdown();
  buildCandles();
  setupClickHearts();
  setupScrollTop();
  setupEasterEgg();
  autoPlayMusic();
});

/* ══════════════════════════════════════════════════════════════
   AUTO-PLAY MUSIC
   Browsers block autoplay, so we try immediately and also
   set a fallback that plays on the user's first interaction.
   ══════════════════════════════════════════════════════════════ */
function autoPlayMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (!audio) return;

  function startMusic() {
    audio.play().then(() => {
      musicPlaying = true;
      if (btn) {
        btn.classList.add('playing');
        btn.querySelector('.music-icon').textContent = '🔊';
      }
    }).catch(() => { /* blocked — will retry on interaction */ });
  }

  // Try autoplay immediately
  startMusic();

  // Fallback: play on first user tap/click if autoplay was blocked
  function onFirstInteraction() {
    if (!musicPlaying) startMusic();
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
  }
  document.addEventListener('click', onFirstInteraction, { once: false });
  document.addEventListener('touchstart', onFirstInteraction, { once: false });
}

/* ══════════════════════════════════════════════════════════════
   MIDNIGHT COUNTDOWN
   ══════════════════════════════════════════════════════════════ */
function initMidnightCountdown() {
  const overlay = document.getElementById('midnight-countdown');
  const landing = document.getElementById('landing');
  const now = new Date();

  // If birthday has already arrived, skip countdown entirely
  if (now >= BIRTHDAY_TARGET) {
    overlay.classList.add('hidden');
    landing.style.display = '';
    initParticles();
    createBalloons();
    return;
  }

  // Hide landing while countdown is active
  landing.style.display = 'none';

  // Init countdown particles
  initCountdownParticles();

  // Start ticking
  updateMidnightTimer();
  midnightInterval = setInterval(updateMidnightTimer, 1000);
}

function updateMidnightTimer() {
  const now = new Date();
  const diff = BIRTHDAY_TARGET - now;

  if (diff <= 0) {
    clearInterval(midnightInterval);
    onMidnightReached();
    return;
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

function onMidnightReached() {
  // 🎉 Big confetti explosion at midnight!
  if (typeof confetti === 'function') {
    const end = Date.now() + 4000;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#e8a4c8','#a78bfa','#f9c74f','#ff6b6b'] });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#e8a4c8','#a78bfa','#f9c74f','#ff6b6b'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // Fade out countdown
  const overlay = document.getElementById('midnight-countdown');
  overlay.classList.add('fade-out');

  setTimeout(() => {
    overlay.classList.add('hidden');
    // Show & init landing
    const landing = document.getElementById('landing');
    landing.style.display = '';
    initParticles();
    createBalloons();
  }, 1000);
}

function initCountdownParticles() {
  const canvas = document.getElementById('countdown-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + .5,
      dx: (Math.random() - .5) * .3,
      dy: (Math.random() - .5) * .3,
      o: Math.random() * .4 + .1,
      color: ['#e8a4c8','#a78bfa','#f9c74f','#fff'][Math.floor(Math.random()*4)]
    });
  }

  function animate() {
    if (canvas.classList?.contains('hidden') || !document.body.contains(canvas)) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.o;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════════════════════════════════════
   PARTICLES BACKGROUND (landing)
   ══════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + .5,
      dx: (Math.random() - .5) * .4,
      dy: (Math.random() - .5) * .4,
      o: Math.random() * .5 + .2,
      color: ['#e8a4c8','#a78bfa','#f9c74f','#fff'][Math.floor(Math.random()*4)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.o;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════════════════════════════════════
   BALLOONS (landing)
   ══════════════════════════════════════════════════════════════ */
function createBalloons() {
  const container = document.getElementById('balloons-container');
  if (!container) return;
  const colors = ['#e8a4c8','#a78bfa','#f9c74f','#87ceeb','#ff6b6b','#98d8aa','#ffd1dc'];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = Math.random() * 100 + '%';
    b.style.background = colors[i % colors.length];
    b.style.animationDuration = (6 + Math.random() * 6) + 's';
    b.style.animationDelay = Math.random() * 8 + 's';
    b.style.width = (35 + Math.random() * 25) + 'px';
    b.style.height = (45 + Math.random() * 30) + 'px';
    container.appendChild(b);
  }
}

/* ══════════════════════════════════════════════════════════════
   OPEN SURPRISE — Landing → Main
   ══════════════════════════════════════════════════════════════ */
function openSurprise() {
  // Confetti burst!
  if (typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#e8a4c8','#a78bfa','#f9c74f','#ff6b6b','#87ceeb'] });
  }
  const landing = document.getElementById('landing');
  landing.classList.add('fade-out');
  setTimeout(() => {
    landing.classList.add('hidden');
    document.body.style.overflow = '';
    const main = document.getElementById('main-content');
    main.classList.remove('hidden');
    buildGallery();
    buildTimeline();
    buildFinalHearts();
    initScrollAnimations();
    // Entrance confetti
    setTimeout(() => {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 } });
      }
    }, 400);
  }, 800);
}

/* ══════════════════════════════════════════════════════════════
   MUSIC TOGGLE
   ══════════════════════════════════════════════════════════════ */
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (!audio) return;
  if (musicPlaying) {
    audio.pause();
    btn.classList.remove('playing');
    btn.querySelector('.music-icon').textContent = '🎵';
  } else {
    audio.play().catch(() => {});
    btn.classList.add('playing');
    btn.querySelector('.music-icon').textContent = '🔊';
  }
  musicPlaying = !musicPlaying;
}

/* ══════════════════════════════════════════════════════════════
   PHOTO GALLERY
   ══════════════════════════════════════════════════════════════ */
function buildGallery() {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery || photos.length === 0) return;
  gallery.innerHTML = '';

  photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = (i * 0.1) + 's';

    const glow = document.createElement('div');
    glow.className = 'gallery-glow';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory #${i + 1}`;
    img.loading = 'lazy';

    const cap = document.createElement('div');
    cap.className = 'gallery-caption';
    cap.textContent = (captions[i] && captions[i].length > 0) ? captions[i] : `Memory #${i + 1}`;

    item.appendChild(glow);
    item.appendChild(img);
    item.appendChild(cap);
    item.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(item);
  });
}

/* ══════════════════════════════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════════════════════════════ */
function openLightbox(index) {
  currentLightbox = index;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = photos[index];
  cap.textContent = (captions[index] && captions[index].length > 0) ? captions[index] : `Memory #${index + 1}`;
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}
function prevImage(e) {
  e && e.stopPropagation();
  currentLightbox = (currentLightbox - 1 + photos.length) % photos.length;
  document.getElementById('lightbox-img').src = photos[currentLightbox];
  document.getElementById('lightbox-caption').textContent =
    (captions[currentLightbox] && captions[currentLightbox].length > 0) ? captions[currentLightbox] : `Memory #${currentLightbox + 1}`;
}
function nextImage(e) {
  e && e.stopPropagation();
  currentLightbox = (currentLightbox + 1) % photos.length;
  document.getElementById('lightbox-img').src = photos[currentLightbox];
  document.getElementById('lightbox-caption').textContent =
    (captions[currentLightbox] && captions[currentLightbox].length > 0) ? captions[currentLightbox] : `Memory #${currentLightbox + 1}`;
}
// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (lb.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

/* ══════════════════════════════════════════════════════════════
   MEMORY TIMELINE
   ══════════════════════════════════════════════════════════════ */
function buildTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline || photos.length === 0) return;
  timeline.innerHTML = '';

  photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const card = document.createElement('div');
    card.className = 'timeline-card';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory #${i + 1}`;
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'timeline-card-body';

    const title = document.createElement('h4');
    title.className = 'timeline-card-title';
    title.textContent = (captions[i] && captions[i].length > 0) ? captions[i] : `Memory #${i + 1}`;

    const text = document.createElement('p');
    text.className = 'timeline-card-text';
    text.textContent = `A beautiful moment captured forever — chapter ${i + 1} of our story together.`;

    body.appendChild(title);
    body.appendChild(text);
    card.appendChild(img);
    card.appendChild(body);
    item.appendChild(card);
    timeline.appendChild(item);
  });
}

/* ══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (GSAP ScrollTrigger or fallback)
   ══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  // Timeline items — reveal on scroll
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.timeline-item').forEach((item) => {
      gsap.fromTo(item,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30, scale: .95 },
        { opacity: 1, y: 0, scale: 1, duration: .5, delay: i * .05, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 90%' }
        }
      );
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: .6, ease: 'power2.out',
          scrollTrigger: { trigger: title, start: 'top 85%' }
        }
      );
    });

  } else {
    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .15 });
    document.querySelectorAll('.timeline-item, .gallery-item').forEach(el => observer.observe(el));
  }
}

/* ══════════════════════════════════════════════════════════════
   CANDLE ANIMATION
   ══════════════════════════════════════════════════════════════ */
function buildCandles() {
  const row = document.getElementById('candles-row');
  if (!row) return;
  for (let i = 0; i < CANDLE_COUNT; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    const flame = document.createElement('div');
    flame.className = 'candle-flame';
    candle.appendChild(flame);
    candle.addEventListener('click', () => blowCandle(candle));
    row.appendChild(candle);
  }
}

function blowCandle(candle) {
  if (candle.classList.contains('blown')) return;
  candle.classList.add('blown');
  candlesBlown++;

  if (candlesBlown >= CANDLE_COUNT) {
    setTimeout(() => {
      document.getElementById('wish-instruction').classList.add('hidden');
      const result = document.getElementById('wish-result');
      result.classList.remove('hidden');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 }, colors: ['#ffd700','#e8a4c8','#a78bfa'] });
      }
    }, 500);
  }
}

/* ══════════════════════════════════════════════════════════════
   3D FLIP CARD
   ══════════════════════════════════════════════════════════════ */
function toggleCard() {
  const inner = document.getElementById('flip-card-inner');
  inner.classList.toggle('flipped');
  // Small confetti on flip
  if (typeof confetti === 'function' && inner.classList.contains('flipped')) {
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 }, colors: ['#e8a4c8','#ffd700'] });
  }
}

/* ══════════════════════════════════════════════════════════════
   COUNTDOWN → FINAL REVEAL
   ══════════════════════════════════════════════════════════════ */
function startCountdown() {
  const btn = document.getElementById('countdown-btn');
  const display = document.getElementById('countdown-display');
  const numEl = document.getElementById('countdown-number');
  btn.classList.add('hidden');
  display.classList.remove('hidden');

  let count = 3;
  numEl.textContent = count;
  numEl.style.animation = 'none';
  void numEl.offsetWidth;
  numEl.style.animation = 'countdown-pulse .5s ease-in-out';

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.textContent = count;
      numEl.style.animation = 'none';
      void numEl.offsetWidth;
      numEl.style.animation = 'countdown-pulse .5s ease-in-out';
    } else {
      clearInterval(interval);
      numEl.textContent = '🎉';
      numEl.style.animation = 'none';
      void numEl.offsetWidth;
      numEl.style.animation = 'countdown-pulse .5s ease-in-out';

      setTimeout(() => {
        display.classList.add('hidden');
        const final = document.getElementById('final-section');
        final.classList.remove('hidden');
        final.scrollIntoView({ behavior: 'smooth' });

        // Animate final lines
        if (typeof gsap !== 'undefined') {
          gsap.fromTo('.final-line-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, delay: .3 });
          gsap.fromTo('.final-line-2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, delay: .7 });
          gsap.fromTo('.final-message-box', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, delay: 1.2 });
          gsap.fromTo('.final-emojis', { opacity: 0 }, { opacity: 1, duration: .6, delay: 1.6 });
          gsap.fromTo('.btn-replay', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, delay: 2 });
        } else {
          document.querySelectorAll('.final-line, .final-message-box, .final-emojis, .btn-replay')
            .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
        }

        // Grand confetti finale
        if (typeof confetti === 'function') {
          const end = Date.now() + 3000;
          (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#e8a4c8','#a78bfa','#f9c74f'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#e8a4c8','#a78bfa','#f9c74f'] });
            if (Date.now() < end) requestAnimationFrame(frame);
          })();
        }
      }, 600);
    }
  }, 900);
}

/* ══════════════════════════════════════════════════════════════
   FINAL HEARTS
   ══════════════════════════════════════════════════════════════ */
function buildFinalHearts() {
  const container = document.getElementById('final-hearts');
  if (!container) return;
  const hearts = ['💖','💕','❤️','💗','💓','🩷'];
  for (let i = 0; i < 15; i++) {
    const h = document.createElement('span');
    h.className = 'final-floating-heart';
    h.textContent = hearts[i % hearts.length];
    h.style.left = Math.random() * 100 + '%';
    h.style.top = Math.random() * 100 + '%';
    h.style.fontSize = (.8 + Math.random() * 1.5) + 'rem';
    h.style.animationDelay = Math.random() * 4 + 's';
    h.style.animationDuration = (4 + Math.random() * 4) + 's';
    container.appendChild(h);
  }
}

/* ══════════════════════════════════════════════════════════════
   CLICK HEARTS (fun interaction)
   ══════════════════════════════════════════════════════════════ */
function setupClickHearts() {
  const container = document.getElementById('click-hearts-container');
  const emojis = ['💖','✨','💕','🌟','💗','⭐'];
  document.addEventListener('click', (e) => {
    // Don't fire on buttons/links/lightbox
    if (e.target.closest('button, a, .lightbox, .gallery-item, .flip-card, .candle')) return;
    const heart = document.createElement('span');
    heart.className = 'click-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 1100);
  });
}

/* ══════════════════════════════════════════════════════════════
   SCROLL-TO-TOP
   ══════════════════════════════════════════════════════════════ */
function setupScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════════════════════════
   EASTER EGG 🥚
   Click the age badge 7 times for a surprise!
   ══════════════════════════════════════════════════════════════ */
function setupEasterEgg() {
  const badge = document.querySelector('.age-badge');
  if (!badge) return;
  badge.style.cursor = 'pointer';
  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    easterEggClicks++;
    if (easterEggClicks >= 7) {
      easterEggClicks = 0;
      // Rainbow explosion!
      if (typeof confetti === 'function') {
        const colors = ['#ff0000','#ff7700','#ffff00','#00ff00','#0077ff','#8b00ff'];
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            confetti({ particleCount: 30, angle: 60 * i, spread: 40, startVelocity: 40,
              origin: { x: .5, y: .5 }, colors: [colors[i]] });
          }, i * 100);
        }
      }
      badge.querySelector('.age-number').textContent = '🥳';
      setTimeout(() => { badge.querySelector('.age-number').textContent = '26'; }, 2000);
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   REPLAY ALL
   ══════════════════════════════════════════════════════════════ */
function replayAll() {
  // Reset state
  candlesBlown = 0;
  document.querySelectorAll('.candle').forEach(c => c.classList.remove('blown'));
  document.getElementById('wish-instruction').classList.remove('hidden');
  document.getElementById('wish-result').classList.add('hidden');
  document.getElementById('flip-card-inner').classList.remove('flipped');
  document.getElementById('countdown-btn').classList.remove('hidden');
  document.getElementById('countdown-display').classList.add('hidden');
  document.getElementById('final-section').classList.add('hidden');

  // Scroll to top of main content
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Confetti
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 100, origin: { y: .5 } });
  }
}
