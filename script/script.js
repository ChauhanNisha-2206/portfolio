/* =========================================================
   CORE SITE BEHAVIOUR
   Navbar state, mobile menu, scroll-reveal, back-to-top,
   footer year, contact form (mailto), certificate lightbox.
   ========================================================= */

// ---------- Navbar scroll state ----------
const navbar = document.getElementById('navbar');
function updateNavbar() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = menuBtn.querySelector('i');
    if (icon) icon.classList.toggle('fa-bars'), icon.classList.toggle('fa-xmark');
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = menuBtn.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    });
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealIo.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealIo.observe(el));

// ---------- Back to top ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Contact form: opens the visitor's email client ----------
function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:nisha165963@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
window.handleContactForm = handleContactForm;

// ---------- Certificate lightbox (click a certificate to view it larger) ----------
(function () {
  const cards = document.querySelectorAll('.certificate-card');
  if (!cards.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'cert-lightbox';
  overlay.innerHTML = `
    <div class="cert-lightbox-inner">
      <button class="cert-lightbox-close" aria-label="Close">&times;</button>
      <img src="" alt="">
      <p></p>
    </div>`;
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    .cert-lightbox{ position:fixed; inset:0; z-index:500; display:none; align-items:center; justify-content:center;
      background:rgba(46,42,61,0.55); backdrop-filter:blur(8px); padding:6vw; }
    .cert-lightbox.active{ display:flex; }
    .cert-lightbox-inner{ position:relative; max-width:640px; width:100%; background:var(--glass-bg-strong, #fffaf2);
      border-radius:22px; overflow:hidden; box-shadow:0 30px 70px rgba(46,42,61,0.35); }
    .cert-lightbox-inner img{ width:100%; max-height:65vh; object-fit:contain; background:#fff; }
    .cert-lightbox-inner p{ padding:16px 20px; font-family:'Poppins',sans-serif; font-size:.9rem; color:#423d54; }
    .cert-lightbox-close{ position:absolute; top:14px; right:14px; width:34px; height:34px; border-radius:50%;
      border:none; background:rgba(255,255,255,0.9); font-size:18px; cursor:pointer; color:#2e2a3d; }
  `;
  document.head.appendChild(style);

  const img = overlay.querySelector('img');
  const caption = overlay.querySelector('p');
  const closeBtn = overlay.querySelector('.cert-lightbox-close');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const cardImg = card.querySelector('img');
      const text = card.querySelector('p');
      if (cardImg && cardImg.src) img.src = cardImg.src;
      caption.textContent = text ? text.textContent : '';
      overlay.classList.add('active');
    });
  });
  function close() { overlay.classList.remove('active'); }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();