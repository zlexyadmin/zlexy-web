
// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('open');
  });
}

// Back-to-top
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backBtn.classList.add('visible');
    else backBtn.classList.remove('visible');
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// i18n with EN reset
const translations = {
  fr: {"nav.home":"Accueil","nav.services":"Services","nav.industries":"Secteurs","nav.pricing":"Tarifs","nav.about":"À propos","nav.contact":"Devis",
       "hero.title":"Des solutions linguistiques précises et humaines — adaptées pour l'impact.","hero.cta1":"Demander un devis","hero.cta2":"En savoir plus",
       "home.services":"Nos Services","home.why":"Pourquoi nous choisir","home.testimonials":"Témoignages","home.industries":"Secteurs que nous servons"},
  de: {"nav.home":"Start","nav.services":"Leistungen","nav.industries":"Branchen","nav.pricing":"Preise","nav.about":"Über uns","nav.contact":"Angebot",
       "hero.title":"Präzise, menschlich geführte Sprachlösungen — maßgeschneidert für Wirkung.","hero.cta1":"Angebot anfordern","hero.cta2":"Mehr erfahren",
       "home.services":"Unsere Leistungen","home.why":"Warum wir","home.testimonials":"Kundenstimmen","home.industries":"Branchen, die wir bedienen"},
  nl: {"nav.home":"Home","nav.services":"Diensten","nav.industries":"Sectoren","nav.pricing":"Prijzen","nav.about":"Over ons","nav.contact":"Offerte",
       "hero.title":"Nauwkeurige, mensgerichte taaldiensten — op maat gemaakt voor impact.","hero.cta1":"Offerte aanvragen","hero.cta2":"Meer weten",
       "home.services":"Onze diensten","home.why":"Waarom kiezen voor ons","home.testimonials":"Referenties","home.industries":"Sectoren die we bedienen"}
};
function applyI18n(lang){
  if(lang==='en'){
    document.querySelectorAll('[data-i18n]').forEach(el=>{ if(!el.dataset.i18nOrig){ el.dataset.i18nOrig = el.textContent; } el.textContent = el.dataset.i18nOrig; });
    return;
  }
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    if(!el.dataset.i18nOrig){ el.dataset.i18nOrig = el.textContent; }
    const k = el.getAttribute('data-i18n'); const b = translations[lang];
    if (b && b[k]) el.textContent = b[k];
  });
}
const langSelect = document.getElementById('lang');
if (langSelect){
  langSelect.addEventListener('change', e=>{ localStorage.setItem('zlexy-lang', e.target.value); applyI18n(e.target.value); });
  const saved = localStorage.getItem('zlexy-lang') || 'en'; langSelect.value = saved; applyI18n(saved);
}

// Pricing calc (kept from previous)
function initPriceCalculator(){
  const typeEl = document.getElementById('price-type');
  const rateEl = document.getElementById('rate');
  const qtyEl = document.getElementById('qty');
  const resultEl = document.getElementById('result');
  const currencyEl = document.getElementById('currency');
  if (!typeEl || !rateEl || !qtyEl || !resultEl) return;

  const defaultRatesByCurrency = {
    INR: { per_word: 6.0,  per_minute: 120.0,  per_hour: 1500.0 },
    USD: { per_word: 0.10, per_minute: 2.00,   per_hour: 30.0 },
    EUR: { per_word: 0.09, per_minute: 1.90,   per_hour: 28.0 }
  };
  let currency = currencyEl ? currencyEl.value : 'INR';
  function symbol(c){ return c==='USD'?'$':(c==='EUR'?'€':'₹'); }
  function rates(){ return defaultRatesByCurrency[currency] || defaultRatesByCurrency['INR']; }

  function recalc(){
    const t = typeEl.value;
    const rate = parseFloat(rateEl.value || rates()[t]);
    const qty = parseFloat(qtyEl.value || 0);
    const total = isFinite(rate * qty) ? rate * qty : 0;
    resultEl.textContent = `Estimated: ${symbol(currency)} ${total.toFixed(2)} (excl. taxes)`;
  }

  typeEl.addEventListener('change', ()=>{ rateEl.value = rates()[typeEl.value]; recalc(); });
  rateEl.addEventListener('input', recalc);
  qtyEl.addEventListener('input', recalc);
  if (currencyEl){
    currencyEl.addEventListener('change', ()=>{ currency = currencyEl.value; rateEl.value = rates()[typeEl.value]; recalc(); });
  }
  rateEl.value = rates()[typeEl.value];
  recalc();
}
document.addEventListener('DOMContentLoaded', initPriceCalculator);

// Testimonials controls
(function(){
  const view = document.querySelector('.testimonial-view');
  if (!view) return;
  const items = Array.from(view.querySelectorAll('.testimonial'));
  let idx = 0;
  function show(i){ items.forEach((el,n)=>{ el.hidden = n!==i; }); }
  const prev = view.querySelector('.t-prev');
  const next = view.querySelector('.t-next');
  if (prev && next) {
    prev.addEventListener('click', ()=>{ idx = (idx-1+items.length)%items.length; show(idx); });
    next.addEventListener('click', ()=>{ idx = (idx+1)%items.length; show(idx); });
  }
  show(idx);
})();


// Submenu toggle on mobile
function toggleSubmenusForMobile(){
  const mainNav = document.querySelector('.main-nav');
  if (!mainNav) return;
  mainNav.querySelectorAll('.has-sub > a').forEach(a => {
    a.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(max-width: 960px)').matches || document.querySelector('.main-nav').classList.contains('open');
      if (isMobile){
        // If clicking parent, toggle submenu instead of navigating immediately
        e.preventDefault();
        const li = a.parentElement;
        li.classList.toggle('show-sub');
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', toggleSubmenusForMobile);

// Zlexy Cookies Consent
(() => {
  const KEY = 'zlexyConsent'; // "granted" | "denied"
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  const getConsent = () => localStorage.getItem(KEY);
  const setConsent = (value) => {
    localStorage.setItem(KEY, value);
    banner.setAttribute('data-show', 'false');
    banner.hidden = true;
    // Fire an event for anything that should react to consent
    window.dispatchEvent(new CustomEvent('consent:changed', { detail: { value } }));
  };

  // Expose a tiny helper if you need to check from other scripts
  window.zlexyConsentGranted = () => getConsent() === 'granted';

  // Show banner only if not decided before
  const current = getConsent();
  if (current !== 'granted' && current !== 'denied') {
    banner.hidden = false;
    banner.setAttribute('data-show', 'true');
  }

  // Wire actions
  acceptBtn?.addEventListener('click', () => {
    setConsent('granted');
    // Place deferred loaders here or listen to the event below
    // loadAnalytics(); // optional, see stub below
  });

  declineBtn?.addEventListener('click', () => setConsent('denied'));

  // Example: defer analytics until consent is granted
  function loadAnalytics() {
    if (!window.zlexyConsentGranted()) return;
    // --- Google Analytics example (gtag) ---
    // const s = document.createElement('script');
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // s.async = true;
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); }
    // window.gtag = gtag;
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
  }

  // If the user had previously accepted (e.g., on another page load), you can initialize here:
  if (current === 'granted') {
    // loadAnalytics(); // uncomment if you’re using analytics
  }

  // Optional: listen globally elsewhere
  // window.addEventListener('consent:changed', (e) => { if (e.detail.value === 'granted') loadAnalytics(); });
})();

document.addEventListener("DOMContentLoaded", function () {
  const cvInput = document.getElementById("cv");
  const cvFileName = document.getElementById("cv-filename");

  // Utility: middle-ellipsis truncation that tries to keep the extension visible
  function middleEllipsisFilename(name, max = 45) {
    if (name.length <= max) return name;

    // Try to preserve extension
    const lastDot = name.lastIndexOf(".");
    const ext = lastDot > 0 ? name.slice(lastDot) : "";
    const base = lastDot > 0 ? name.slice(0, lastDot) : name;

    const reserve = Math.max(8, ext.length + 3); // space for "…"+ext
    const keep = Math.max(6, Math.floor((max - reserve) / 2));

    const start = base.slice(0, keep);
    const end = base.slice(-keep);
    return `${start}…${end}${ext}`;
  }

  if (cvInput && cvFileName) {
    cvInput.addEventListener("change", function () {
      if (cvInput.files && cvInput.files.length > 0) {
        const fullName = cvInput.files[0].name;
        cvFileName.textContent = middleEllipsisFilename(fullName, 45);
        cvFileName.title = fullName; // show full name on hover
      } else {
        cvFileName.textContent = "No file chosen";
        cvFileName.title = "";
      }
    });
  }
});
