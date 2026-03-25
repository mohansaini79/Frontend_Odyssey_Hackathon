/**
 * Frontend Odyssey — script.js
 * The Life of a Developer
 * Interactive storytelling engine
 */

'use strict';

/* ============================================================
   CONSTANTS & STATE
   ============================================================ */
const state = {
  coffeeCount: 0,
  panicLevel: 20,
  checklistIndex: 3, // first unchecked item index
  isLightMode: false,
  statsAnimated: false,
  devProgressSet: false,
  successProgressSet: false,
  skillsAnimated: false,
  countdownStarted: false,
  loaderDone: false,
};

const devQuotes = [
  '"It works on my machine."',
  '"That\'s not a bug, it\'s a feature."',
  '"I\'ll fix it after the deadline."',
  '"Who wrote this code? ...Oh. It was me."',
  '"Works in prod, ship it."',
  '"Just turn it off and on again."',
  '"I\'ll just push a hotfix."',
  '"Nobody will ever click that button anyway."',
  '"The tests pass locally."',
  '"It was working before I started."',
];

const bugFixMessages = [
  'Scanning 4,000+ files...',
  'Running unit tests... 847 failed 🤦',
  'Googling the error message...',
  'Copying Stack Overflow answer...',
  'Checking if it works in production...',
  'It\'s a DNS issue. It\'s always DNS.',
  'Blaming the intern...',
  'Restarting the server...',
  '✅ Bug fixed! (Somehow. Don\'t touch it.)',
];

const confettiColors = [
  '#6366f1', '#8b5cf6', '#ec4899',
  '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#f0f4ff',
];

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/** Clamp a number between min and max */
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/** Linear interpolation */
const lerp = (a, b, t) => a + (b - a) * t;

/** Show a toast message */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/** Animate a number counter */
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    const value = Math.round(lerp(startVal, target, easeOut(progress)));
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ============================================================
   PAGE LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = '100%';
      clearInterval(interval);

      setTimeout(() => {
        loader.classList.add('hidden');
        state.loaderDone = true;
        document.body.style.overflow = 'auto';

        // Trigger hero animations after loader
        setTimeout(() => triggerHeroAnimations(), 100);
      }, 500);
    } else {
      bar.style.width = `${progress}%`;
    }
  }, 120);

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
  const el = document.getElementById('typedTitle');
  const words = ['Developer', 'Problem Solver', 'Stack Overflower', 'Coffee Addict', 'Legend'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      el.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isDeleting = false;
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; requestAnimationFrame(type); }, 2200);
        return;
      }
    } else {
      el.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    if (!isPaused) {
      setTimeout(() => requestAnimationFrame(type), isDeleting ? 60 : 100);
    }
  }

  type();
}

/* ============================================================
   PARTICLES SYSTEM
   ============================================================ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const opacity = Math.random() * 0.5 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(p);
  }
}

/* ============================================================
   HERO ANIMATIONS (post-loader)
   ============================================================ */
function triggerHeroAnimations() {
  const reveals = document.querySelectorAll('#hero .reveal-up, #hero .reveal-left, #hero .reveal-right');
  reveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '72px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.padding = '20px';
    navLinks.style.background = 'rgba(8,11,20,0.95)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        navLinks.style.display = 'none';
      }
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   GLOBAL PROGRESS BAR
   ============================================================ */
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  const label = document.getElementById('progressLabel');

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? clamp((scrollTop / docHeight) * 100, 0, 100) : 0;
    bar.style.width = `${pct}%`;
    label.textContent = `${Math.round(pct)}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   SCROLL-TRIGGERED REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  // Don't observe hero reveals — those are handled post-loader
  revealEls.forEach(el => {
    if (!el.closest('#hero')) {
      observer.observe(el);
    }
  });
}

/* ============================================================
   HERO STAT COUNTERS
   ============================================================ */
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.statsAnimated) {
        state.statsAnimated = true;
        statNums.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target), 2200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.skillsAnimated) {
        state.skillsAnimated = true;
        fills.forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = `${fill.dataset.width}%`;
          }, i * 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const cardsGrid = document.querySelector('.cards-grid');
  if (cardsGrid) observer.observe(cardsGrid);
}

/* ============================================================
   DEVELOPER PROGRESS BAR (Learning Section)
   ============================================================ */
function initDevProgress() {
  const fill = document.getElementById('devProgress');
  const label = document.getElementById('devLevelLabel');
  const levels = ['Intern', 'Junior', 'Mid', 'Senior', 'Legend'];

  const milestones = [
    { pct: 8,  label: 'Intern'  },
    { pct: 30, label: 'Junior'  },
    { pct: 55, label: 'Mid'     },
    { pct: 80, label: 'Senior'  },
    { pct: 100, label: 'Legend' },
  ];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.devProgressSet) {
        state.devProgressSet = true;
        let current = 0;
        let target = 42; // "Junior-to-mid" developer
        const start = performance.now();
        const duration = 2000;

        function tick(now) {
          const t = clamp((now - start) / duration, 0, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const val = Math.round(lerp(0, target, ease));
          fill.style.width = `${val}%`;

          // Update label
          const level = milestones.slice().reverse().find(m => val >= m.pct * (target / 100));
          if (level) label.textContent = level.label;

          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const progressTrack = document.querySelector('.progress-track');
  if (progressTrack) observer.observe(progressTrack);
}

/* ============================================================
   MOOD TOGGLE (dark / light)
   ============================================================ */
function initMoodToggle() {
  const btn = document.getElementById('moodToggle');
  const icon = btn.querySelector('.toggle-icon');
  const lbl = btn.querySelector('.toggle-label');

  btn.addEventListener('click', () => {
    state.isLightMode = !state.isLightMode;
    document.body.classList.toggle('light-mode', state.isLightMode);
    document.body.classList.toggle('dark-mode', !state.isLightMode);

    if (state.isLightMode) {
      icon.textContent = '🌙';
      lbl.textContent = 'Dark Mode';
      showToast('☀️ Light mode — easy on the eyes!');
    } else {
      icon.textContent = '☀️';
      lbl.textContent = 'Light Mode';
      showToast('🌙 Dark mode — the natural habitat.');
    }
  });
}

/* ============================================================
   DEBUGGING SECTION INTERACTIVITY
   ============================================================ */
function initDebugging() {
  // ---- Fix Bug Button ----
  const fixBtn = document.getElementById('fixBugBtn');
  const modal = document.getElementById('bugModal');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalMsg = document.getElementById('modalMsg');
  const modalBar = document.getElementById('modalBar');
  const modalClose = document.getElementById('modalClose');

  fixBtn.addEventListener('click', () => {
    modal.classList.add('active');
    modalIcon.textContent = '🔧';
    modalTitle.textContent = 'Fixing Bug...';
    modalMsg.textContent = bugFixMessages[0];
    modalBar.style.width = '0%';
    modalClose.style.display = 'none';
    fixBtn.disabled = true;

    let step = 0;
    const stepsTotal = bugFixMessages.length;
    const stepDuration = 600;

    const interval = setInterval(() => {
      step++;
      const pct = Math.round((step / stepsTotal) * 100);
      modalBar.style.width = `${pct}%`;

      if (step < stepsTotal) {
        modalMsg.textContent = bugFixMessages[step];
        if (step === stepsTotal - 1) {
          modalIcon.textContent = '✅';
          modalTitle.textContent = 'Bug Fixed!';
        }
      } else {
        clearInterval(interval);
        modalMsg.textContent = bugFixMessages[stepsTotal - 1];
        modalClose.style.display = 'inline-flex';
        fixBtn.disabled = false;
        showToast('🐛 Bug squashed! Until the next one...');
      }
    }, stepDuration);
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // ---- Clear Console ----
  const clearBtn = document.getElementById('clearConsole');
  const errorConsole = document.getElementById('errorConsole');

  clearBtn.addEventListener('click', () => {
    errorConsole.innerHTML = '<div class="ec-row ec-info" style="color:#94a3b8; font-style:italic;">🔵 Console cleared. For 3 seconds. Then it refills itself.</div>';
    showToast('Cleared! (They\'ll be back.)');

    setTimeout(() => {
      const errors = [
        { cls: 'ec-error', msg: '🔴 TypeError: Cannot read property \'map\' of undefined' },
        { cls: 'ec-warn',  msg: '🟡 Warning: Each child should have a unique key' },
        { cls: 'ec-error', msg: '🔴 Uncaught ReferenceError: $ is not defined' },
        { cls: 'ec-error', msg: '🔴 SyntaxError: Unexpected end of input' },
        { cls: 'ec-info',  msg: '🔵 console.log("Am I even being called??")' },
        { cls: 'ec-error', msg: '🔴 CORS policy: blocked by CORS policy' },
      ];

      errors.forEach((err, i) => {
        setTimeout(() => {
          const row = document.createElement('div');
          row.className = `ec-row ${err.cls}`;
          row.textContent = err.msg;
          row.style.opacity = '0';
          row.style.transform = 'translateX(-10px)';
          row.style.transition = 'all 0.3s ease';
          errorConsole.appendChild(row);
          requestAnimationFrame(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
          });
        }, i * 400);
      });
    }, 3000);
  });

  // ---- Dev Quotes ----
  const quoteEl = document.getElementById('debugQuote');
  const newQuoteBtn = document.getElementById('newQuoteBtn');
  let currentQuoteIdx = 0;

  newQuoteBtn.addEventListener('click', () => {
    currentQuoteIdx = (currentQuoteIdx + 1) % devQuotes.length;
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      quoteEl.textContent = devQuotes[currentQuoteIdx];
      quoteEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 200);
  });

  quoteEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  // ---- Coffee Counter ----
  const coffeeCount = document.getElementById('coffeeCount');
  const addCoffeeBtn = document.getElementById('addCoffeeBtn');

  addCoffeeBtn.addEventListener('click', () => {
    state.coffeeCount++;
    coffeeCount.textContent = state.coffeeCount;
    coffeeCount.style.transform = 'scale(1.3)';
    setTimeout(() => { coffeeCount.style.transform = 'scale(1)'; coffeeCount.style.transition = 'transform 0.2s ease'; }, 200);

    const messages = [
      '☕ Caffeinated!',
      '☕ One more...',
      '☕ You need help.',
      '☕ Is this even coffee anymore?',
      '☕ Your hands are vibrating.',
      '☕ At this point just inject it.',
    ];
    showToast(messages[Math.min(state.coffeeCount - 1, messages.length - 1)]);

    // Update panic level slightly
    state.panicLevel = clamp(state.panicLevel + 2, 0, 100);
  });
}

/* ============================================================
   DEADLINE SECTION
   ============================================================ */
function initDeadline() {
  // ---- Countdown Timer ----
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMins');
  const secsEl  = document.getElementById('cdSecs');
  const panicFill = document.getElementById('panicFill');
  const panicLabel = document.getElementById('panicLabel');

  const panicThresholds = [
    { pct: 0,  color: '#10b981', emoji: '🙂 Calm'        },
    { pct: 25, color: '#f59e0b', emoji: '😰 Nervous'     },
    { pct: 50, color: '#ef4444', emoji: '😱 Panicking'   },
    { pct: 75, color: '#dc2626', emoji: '🔥 Code is Fire' },
    { pct: 90, color: '#7f1d1d', emoji: '💀 We\'re done.' },
  ];

  // Start at 8h 47m
  let totalSeconds = 8 * 3600 + 47 * 60;
  const maxSeconds = totalSeconds;

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.countdownStarted) {
        state.countdownStarted = true;
        startCountdown();
        sectionObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const deadlineSection = document.getElementById('deadline');
  if (deadlineSection) sectionObserver.observe(deadlineSection);

  function startCountdown() {
    setInterval(() => {
      if (totalSeconds > 0) totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent  = String(m).padStart(2, '0');
      secsEl.textContent  = String(s).padStart(2, '0');

      // Update panic level based on time remaining
      const elapsed = maxSeconds - totalSeconds;
      const panicPct = clamp((elapsed / (maxSeconds * 0.3)) * 100, 0, 100);
      state.panicLevel = panicPct;
      panicFill.style.width = `${panicPct}%`;

      const threshold = panicThresholds.slice().reverse().find(t => panicPct >= t.pct);
      if (threshold) {
        panicFill.style.background = threshold.color;
        panicFill.style.boxShadow = `0 0 12px ${threshold.color}66`;
        panicLabel.textContent = threshold.emoji;
      }
    }, 1000);
  }

  // ---- Checklist ----
  const checkItems = document.querySelectorAll('#checklist .check-item');
  const checkBtn = document.getElementById('checkItem');
  let nextCheck = 3; // first unchecked index

  checkBtn.addEventListener('click', () => {
    if (nextCheck >= checkItems.length) {
      showToast('🎉 All done! You shipped it!');
      checkBtn.textContent = '🚀 All done!';
      checkBtn.disabled = true;
      return;
    }

    const item = checkItems[nextCheck];
    item.classList.add('done', 'just-done');
    item.querySelector('.check-box').textContent = '✅';

    setTimeout(() => item.classList.remove('just-done'), 600);
    nextCheck++;

    const messages = [
      '📱 Testing on mobile — brave!',
      '📝 Docs? Nobody reads those anyway.',
      '💤 Sleep? Maybe after launch.',
    ];

    showToast(messages[Math.min(nextCheck - 4, messages.length - 1)] || '✅ Task done!');

    if (nextCheck >= checkItems.length) {
      checkBtn.textContent = '🚀 Ship it!';
    }
  });
}

/* ============================================================
   SUCCESS SECTION
   ============================================================ */
function initSuccess() {
  // Animate the final progress bar when section is visible
  const successProgress = document.getElementById('successProgress');
  const successPct = document.getElementById('successPct');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.successProgressSet) {
        state.successProgressSet = true;
        animateSuccessProgress(successProgress, successPct);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const successSection = document.getElementById('success');
  if (successSection) observer.observe(successSection);

  // Celebrate button
  const celebrateBtn = document.getElementById('celebrateBtn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      launchConfetti();
      showToast('🎉 You\'re a legend! Now go build something amazing.');
    });
  }
}

function animateSuccessProgress(barEl, pctEl) {
  const target = 100;
  const duration = 2500;
  const start = performance.now();

  function tick(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(lerp(0, target, ease));
    barEl.style.width = `${val}%`;
    pctEl.textContent = `${val}%`;
    if (t < 1) requestAnimationFrame(tick);
    else setTimeout(launchConfetti, 400);
  }

  requestAnimationFrame(tick);
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const count = window.innerWidth < 768 ? 60 : 120;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = Math.random() * 2 + 2;
    const size = Math.random() * 10 + 6;
    const borderRadius = Math.random() > 0.5 ? '50%' : '2px';

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${borderRadius};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 500);
  }
}

/* ============================================================
   PARALLAX EFFECTS
   ============================================================ */
function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = (i % 3 + 1) * 0.06;
          const dir = i % 2 === 0 ? 1 : -1;
          blob.style.transform = `translateY(${scrollY * speed * dir}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   TERMINAL TYPEWRITER (Learning Section)
   ============================================================ */
function initTerminalAnimation() {
  const lines = document.querySelectorAll('.t-line');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach((line, i) => {
          line.style.opacity = '0';
          setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease';
            line.style.opacity = '1';
          }, i * 300);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const terminal = document.querySelector('.terminal-card');
  if (terminal) observer.observe(terminal);
}

/* ============================================================
   SECTION-BASED BACKGROUND TRANSITIONS
   ============================================================ */
function initSectionColors() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Could add section-specific body class if needed
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   KEYBOARD ACCESSIBILITY
   ============================================================ */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    // Close modal with Escape
    if (e.key === 'Escape') {
      document.getElementById('bugModal').classList.remove('active');
    }
  });
}

/* ============================================================
   INIT — BOOTSTRAP EVERYTHING
   ============================================================ */
function init() {
  initLoader();
  initTypingAnimation();
  initParticles();
  initNavigation();
  initProgressBar();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initDevProgress();
  initMoodToggle();
  initDebugging();
  initDeadline();
  initSuccess();
  initParallax();
  initTerminalAnimation();
  initSectionColors();
  initKeyboard();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
