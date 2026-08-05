/* ═══════════════════════════════════════════
   PORTFOLIO SCRIPT
═══════════════════════════════════════════ */
'use strict';

/* ─── Theme Toggle ─── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ─── Custom Cursor ─── */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mx = 0, my = 0;
let tx = 0, ty = 0;
let raf;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateTrail() {
  tx += (mx - tx) * 0.14;
  ty += (my - ty) * 0.14;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  raf = requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .service-card, .project-card, .cert-card, .disc').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

/* ─── Mobile Drawer ─── */
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');

hamburger.addEventListener('click', () => mobileDrawer.classList.add('open'));
drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));

function closeDrawer() {
  mobileDrawer.classList.remove('open');
}
window.closeDrawer = closeDrawer;

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + id
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => activeSectionObserver.observe(s));

/* ─── Scroll Reveal ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger children if multiple in same batch
      entry.target.style.transitionDelay = (i % 4) * 0.1 + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Skill Bar Animation ─── */
const skillFills = document.querySelectorAll('.sk-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target.dataset.w;
      entry.target.style.width = w + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(el => skillObserver.observe(el));

/* ─── Animated counter ─── */
function animateCount(el, target, duration = 1400) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.hstat-n');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/(\d+)(.+)?/);
      if (match) {
        const num = parseInt(match[1]);
        const suffix = match[2] || '';
        el.dataset.suffix = suffix;
        animateCount(el, num);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* ─── Contact Form ───
   Sends real emails via Web3Forms (https://web3forms.com) — a free
   email-forwarding API for static sites, no backend required.

   ONE-TIME SETUP (Hanna does this once):
   1. Go to https://web3forms.com
   2. Enter hannademeke133@gmail.com and click "Create Access Key"
   3. Check that inbox, click the confirmation link
   4. Copy the access key you're given
   5. Paste it below, replacing "YOUR_WEB3FORMS_ACCESS_KEY"
   That's it — every submission will land in hannademeke133@gmail.com.
   Free tier: unlimited forms, up to 250 submissions/month.
*/
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

async function submitForm(btn) {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('cfStatus');
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
      valid = false;
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 2000);
    }
  });

  if (!valid) return;

  if (WEB3FORMS_ACCESS_KEY === "36bf76a3-7f0a-4216-bbc3-730e94d20bcf") {
    status.textContent = "⚠ Form isn't connected yet — add your Web3Forms access key in script.js (see comment above submitForm).";
    status.style.color = '#f59e0b';
    return;
  }

  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Sending…';
  status.textContent = '';

  const formData = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New portfolio message from ${form.name.value}`,
    from_name: form.name.value,
    name: form.name.value,
    email: form.email.value,
    interest: form.interest.value,
    message: form.message.value,
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await res.json();

    if (result.success) {
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #3f3f46, #a1a1aa)';
      status.textContent = "Thanks — I'll get back to you soon.";
      status.style.color = 'var(--text-2)';
      form.reset();
    } else {
      throw new Error(result.message || 'Send failed');
    }
  } catch (err) {
    btn.innerHTML = '✕ Failed — try again';
    status.textContent = "Something went wrong sending that. Try again, or email me directly.";
    status.style.color = '#ef4444';
  }

  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.background = '';
    btn.disabled = false;
  }, 3500);
}
window.submitForm = submitForm;

/* ─── Smooth scroll offset for fixed nav ─── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

/* ─── Parallax orbs on mouse move ─── */
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');

document.addEventListener('mousemove', (e) => {
  const rx = (e.clientX / window.innerWidth - 0.5);
  const ry = (e.clientY / window.innerHeight - 0.5);
  if (orb1) orb1.style.transform = `translate(${rx * 30}px, ${ry * 20}px)`;
  if (orb2) orb2.style.transform = `translate(${rx * -20}px, ${ry * -15}px)`;
}, { passive: true });

/* ─── Service card tilt effect ─── */
document.querySelectorAll('.service-card, .project-feature, .training-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });
});

/* ─── Typing effect for hero title ─── */
function typeEffect(el, words, speed = 90, pause = 2000) {
  if (!el) return;
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = word.substring(0, ci);

    if (!deleting && ci === word.length) {
      setTimeout(() => { deleting = true; tick(); }, pause);
      return;
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
    ci += deleting ? -1 : 1;
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

// Optionally target a subtitle element for typing:
// typeEffect(document.querySelector('.hero-type'), ['Quality Assurance', 'UI/UX Design', 'Web Development', 'AI/ML + Fintech']);

/* ─── Console Easter Egg ─── */
console.log('%c👋 Hey there, developer!', 'font-size:18px;font-weight:bold;color:#a1a1aa');
console.log('%c This portfolio was hand-crafted with love in Addis Ababa, Ethiopia 🇪🇹', 'font-size:13px;color:#a1a1aa');
console.log('%c Stack: HTML · CSS · Vanilla JS · Inter Font · IBM Plex Mono', 'font-size:12px;color:#5c5c63');

/* ─── Visitor / Page-View Counter (no email, no signup) ───
   Uses the free CountAPI.xyz hit counter. Every page load increments
   a shared number stored on their server and returns the new total —
   no account needed. Change the namespace below if you ever want to
   reset the count (a new namespace starts back at 0).
   Check it anytime just by visiting your own site and looking at the footer.
*/
(function () {
  const counterEl = document.getElementById('visitCounter');
  if (!counterEl) return;
  const NAMESPACE = 'hannasamuel-portfolio-addis';
  const KEY = 'pageviews';

  fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
    .then(res => res.json())
    .then(data => {
      counterEl.textContent = `👁 ${data.value.toLocaleString()} page views`;
    })
    .catch(() => {
      counterEl.textContent = '';
    });
})();
