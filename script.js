const cursor = document.getElementById('cursor');
const dot    = document.getElementById('cursorDot');
let mx=0, my=0, cx=0, cy=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
(function moveCursor(){
  cx += (mx-cx)*0.12; cy += (my-cy)*0.12;
  cursor.style.left=cx+'px'; cursor.style.top=cy+'px';
  requestAnimationFrame(moveCursor);
})();
document.querySelectorAll('a,button,.skill-pill,.acc-card,.contact-btn,.btn').forEach(el => {
  el.addEventListener('mouseenter', ()=> cursor.classList.add('hover'));
  el.addEventListener('mouseleave', ()=> cursor.classList.remove('hover'));
});

function toggleAcc(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.acc-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    setTimeout(() => {
      const rect = item.getBoundingClientRect();
      if (rect.top < 80) item.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

/* ---- Sidebar Toggle ---- */
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function openSidebar() {
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  sidebar.classList.add('open');
  sidebar.setAttribute('aria-hidden', 'false');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  sidebar.classList.remove('open');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

const sidebarClose = document.getElementById('sidebarClose');
if (sidebarClose) {
  sidebarClose.addEventListener('click', closeSidebar);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
});

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    closeSidebar();
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  });
});


const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= 150) current = s.id;
  });
  sidebarLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('data-section') === current) {
      l.classList.add('active');
    }
  });
}, { passive: true });

/* ---- Skill pill a11y ---- */
document.querySelectorAll('.skill-pill').forEach(p => {
  p.setAttribute('tabindex', '0');
  p.setAttribute('role', 'listitem');
});

document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    link.style.setProperty('--mouse-x', x + '%');
    link.style.setProperty('--mouse-y', y + '%');
  });
});

(function () {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const cs = getComputedStyle(document.documentElement);
  const colorSage   = cs.getPropertyValue('--sage').trim()     || '#C8D5C0';
  const colorAccent = cs.getPropertyValue('--accent').trim()   || '#00ACFC';
  const colorMint   = cs.getPropertyValue('--mint').trim()     || '#DCE9DF';
  const colorLav    = cs.getPropertyValue('--lavender').trim() || '#E8E2F4';

  const CELL = 40;
  let W, H, cols, rows, t = 0;
  let dpr = window.devicePixelRatio || 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    cols = Math.ceil(W / CELL) + 2;
    rows = Math.ceil(H / CELL) + 2;
  }

  function hexToRgb(hex) {
    const h = parseInt(hex.replace('#', ''), 16);
    return [(h >> 16) & 0xff, (h >> 8) & 0xff, h & 0xff];
  }

  function lerpColor(a, b, amt) {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return [
      Math.round(ar + (br - ar) * amt),
      Math.round(ag + (bg - ag) * amt),
      Math.round(ab + (bb - ab) * amt)
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.014;

    for (let ci = 0; ci < cols; ci++) {
      ctx.beginPath();
      for (let ri = 0; ri <= rows; ri++) {
        const wx = Math.cos(t * 0.7 + ci * 0.35 + ri * 0.15) * 6;
        const wy = Math.sin(t       + ci * 0.45 + ri * 0.20) * 7;
        const px = ci * CELL + wx;
        const py = ri * CELL + wy;
        ri === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      const op = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(t + ci * 0.6));
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(26,26,26,${op})`;
      ctx.stroke();
    }

    for (let ri = 0; ri < rows; ri++) {
      ctx.beginPath();
      for (let ci = 0; ci <= cols; ci++) {
        const wx = Math.cos(t * 0.7 + ci * 0.35 + ri * 0.15) * 6;
        const wy = Math.sin(t       + ci * 0.45 + ri * 0.20) * 7;
        const px = ci * CELL + wx;
        const py = ri * CELL + wy;
        ci === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      const op = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(t * 0.8 + ri * 0.5));
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(26,26,26,${op})`;
      ctx.stroke();
    }


    for (let ci = 0; ci < cols; ci++) {
      for (let ri = 0; ri < rows; ri++) {
        const wx = Math.cos(t * 0.7 + ci * 0.35 + ri * 0.15) * 6;
        const wy = Math.sin(t       + ci * 0.45 + ri * 0.20) * 7;
        const px = ci * CELL + wx;
        const py = ri * CELL + wy;

        const phase = Math.sin(t * 1.3 + ci * 0.7 + ri * 0.5);
        const r = 2.8 + phase * 1.6;

        const cp = (Math.sin(t * 0.5 + ci * 0.3 + ri * 0.2) + 1) / 2;
        let rgb;
        if      (cp < 0.33) rgb = lerpColor(colorSage,   colorMint,   cp / 0.33);
        else if (cp < 0.66) rgb = lerpColor(colorMint,   colorLav,    (cp - 0.33) / 0.33);
        else                rgb = lerpColor(colorLav,    colorAccent, (cp - 0.66) / 0.34);

        const alpha = 0.5 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.9 + ci * 0.5 + ri * 0.3));

        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
