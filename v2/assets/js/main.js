/**
 * ÉLÉGANCE PRESSING — V2 JavaScript
 * Site public + Espace Client
 */

'use strict';

/* ========================================================
   1. Navbar scroll effect
   ======================================================== */
(function initNavbar() {
  const navbar = document.querySelector('.ep-navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ========================================================
   2. Smooth scroll for anchor links
   ======================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ========================================================
   3. Intersection Observer — fade-up animations
   ======================================================== */
(function initAnimations() {
  const els = document.querySelectorAll('.ep-fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
})();

/* ========================================================
   4. Counter animation (stats section)
   ======================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const duration = 1500;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString('fr-FR');
        if (current >= target) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ========================================================
   5. Mobile sidebar toggle (espace client)
   ======================================================== */
(function initSidebar() {
  const toggleBtn = document.getElementById('ep-sidebar-toggle');
  const sidebar = document.querySelector('.ep-sidebar');
  const overlay = document.getElementById('ep-sidebar-overlay');
  if (!toggleBtn || !sidebar) return;

  const open = () => {
    sidebar.classList.add('open');
    if (overlay) overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  if (overlay) overlay.addEventListener('click', close);
})();

/* ========================================================
   6. Form validation (registration & contact)
   ======================================================== */
(function initForms() {
  // Generic Bootstrap-style validation
  const forms = document.querySelectorAll('.ep-needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Password strength meter
  const pwInput = document.getElementById('ep-password');
  const strengthBar = document.getElementById('ep-pw-strength');
  if (pwInput && strengthBar) {
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      let strength = 0;
      if (val.length >= 8)          strength++;
      if (/[A-Z]/.test(val))        strength++;
      if (/[0-9]/.test(val))        strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;
      const colors = ['#dc3545', '#ffc107', '#0dcaf0', '#198754'];
      const widths = [25, 50, 75, 100];
      strengthBar.style.width  = widths[strength - 1] + '%';
      strengthBar.style.background = colors[strength - 1];
    });
  }

  // Password confirm match
  const pwConfirm = document.getElementById('ep-password-confirm');
  if (pwInput && pwConfirm) {
    const check = () => {
      if (pwConfirm.value && pwConfirm.value !== pwInput.value) {
        pwConfirm.setCustomValidity('Les mots de passe ne correspondent pas');
      } else {
        pwConfirm.setCustomValidity('');
      }
    };
    pwInput.addEventListener('input', check);
    pwConfirm.addEventListener('input', check);
  }
})();

/* ========================================================
   7. Cookie banner
   ======================================================== */
(function initCookies() {
  const banner = document.getElementById('ep-cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('ep_cookies_ok')) { banner.style.display = 'none'; return; }
  document.getElementById('ep-cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('ep_cookies_ok', '1');
    banner.style.display = 'none';
  });
  document.getElementById('ep-cookie-decline')?.addEventListener('click', () => {
    banner.style.display = 'none';
  });
})();

/* ========================================================
   8. Toast notifications
   ======================================================== */
window.epToast = function(message, type = 'success') {
  const container = document.getElementById('ep-toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'ep-toast-container';
    c.style.cssText = 'position:fixed;top:1.25rem;right:1.25rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;';
    document.body.appendChild(c);
    return c;
  })();

  const icons = { success: 'check-circle', danger: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };
  const colors = { success: '#198754', danger: '#dc3545', info: '#0d6efd', warning: '#b08500' };

  const toast = document.createElement('div');
  toast.style.cssText = `background:#fff;border-left:4px solid ${colors[type]};border-radius:8px;padding:.85rem 1.25rem;box-shadow:0 4px 20px rgba(0,0,0,.12);display:flex;align-items:center;gap:.65rem;font-size:.9rem;min-width:280px;animation:slideIn .3s ease;`;
  toast.innerHTML = `<i class="fas fa-${icons[type]}" style="color:${colors[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; setTimeout(() => toast.remove(), 400); }, 3500);
};

/* ========================================================
   9. Service page — tab / accordion
   ======================================================== */
(function initServiceTabs() {
  const tabs = document.querySelectorAll('[data-ep-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = document.getElementById(tab.dataset.epTab);
      document.querySelectorAll('.ep-tab-content').forEach(c => c.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));
      if (target) { target.classList.add('active'); tab.classList.add('active'); }
    });
  });
})();

/* ========================================================
   10. Contact form — simulated submission
   ======================================================== */
(function initContactForm() {
  const form = document.getElementById('ep-contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = orig;
      window.epToast('Votre message a bien été envoyé. Nous vous répondrons dans les 24 h.', 'success');
      form.reset();
      form.classList.remove('was-validated');
    }, 1800);
  });
})();

/* ========================================================
   11. Order filter (mes commandes page)
   ======================================================== */
(function initOrderFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const rows = document.querySelectorAll('[data-status]');
  if (!filterBtns.length || !rows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.status === filter) ? '' : 'none';
      });
    });
  });
})();

/* ========================================================
   12. Dashboard charts (Chart.js)
   ======================================================== */
window.initDashboardCharts = function() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  Chart.defaults.color = '#6c757d';

  // Dépenses par mois
  const ctxDep = document.getElementById('chartDepenses');
  if (ctxDep) {
    new Chart(ctxDep, {
      type: 'bar',
      data: {
        labels: ['Oct','Nov','Déc','Jan','Fév','Mar'],
        datasets: [{
          label: 'Montant (FCFA)',
          data: [12000, 18500, 9000, 21000, 15500, 24000],
          backgroundColor: 'rgba(28,61,42,.7)',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { callback: v => v.toLocaleString('fr-FR') + ' F' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Statuts vêtements (donut)
  const ctxStatus = document.getElementById('chartStatuts');
  if (ctxStatus) {
    new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: ['Reçu','En lavage','Lavé','En repassage','Repassé','Prêt','Retiré'],
        datasets: [{
          data: [2, 3, 5, 2, 4, 6, 18],
          backgroundColor: ['#6c757d','#0d6efd','#0dcaf0','#ffc107','#fd7e14','#198754','#1C3D2A'],
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } } }
      }
    });
  }

  // Points fidélité par mois
  const ctxPoints = document.getElementById('chartPoints');
  if (ctxPoints) {
    new Chart(ctxPoints, {
      type: 'line',
      data: {
        labels: ['Oct','Nov','Déc','Jan','Fév','Mar'],
        datasets: [{
          label: 'Points cumulés',
          data: [50, 120, 180, 280, 350, 430],
          borderColor: '#C9A020',
          backgroundColor: 'rgba(201,160,32,.08)',
          tension: .4,
          fill: true,
          pointBackgroundColor: '#C9A020',
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,.04)' }, beginAtZero: true },
          x: { grid: { display: false } }
        }
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart !== 'undefined') window.initDashboardCharts();
});
