/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          ÉLÉGANCE PRESSING — main.js                         ║
 * ║          Application de gestion de pressing                  ║
 * ║          Côte d'Ivoire — Vanilla JS + Bootstrap 5            ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Ce fichier est le point d'entrée JavaScript unique pour toutes
 * les maquettes statiques (14 pages HTML) de l'application.
 *
 * Sections :
 *   1.  UTILITAIRES GLOBAUX
 *   2.  LAYOUT & NAVIGATION
 *   3.  NOTIFICATIONS TOAST
 *   4.  NOUVELLE COMMANDE — Tableau vêtements
 *   5.  NOUVELLE COMMANDE — Autocomplete client
 *   6.  NOUVELLE COMMANDE — Calcul dates
 *   7.  DASHBOARD — Graphique Chart.js
 *   8.  RAPPORTS — Graphiques Chart.js
 *   9.  TRAITEMENT LAVAGE / REPASSAGE — Gestion des lots
 *  10.  REGROUPEMENT CLIENT — Validation quantités
 *  11.  PAIEMENT — Mode conditionnel & calcul
 *  12.  REMISE — Modal confirmation
 *  13.  ADMIN VÊTEMENTS — Drag & Drop simulé
 *  14.  RECHERCHE & FILTRES TABLEAUX
 *  15.  INITIALISATION PRINCIPALE
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// 1. UTILITAIRES GLOBAUX
// ═══════════════════════════════════════════════════════════════

/**
 * Formate un montant numérique en chaîne FCFA avec séparateur de milliers.
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté, ex : "1 500 FCFA"
 */
function formatFCFA(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(Number(amount)) + ' FCFA';
}

/**
 * Parse une chaîne FCFA et retourne la valeur numérique.
 * @param {string} str - Chaîne à parser, ex : "1 500 FCFA"
 * @returns {number}
 */
function parseFCFA(str) {
  if (!str) return 0;
  return parseInt(str.replace(/\s/g, '').replace('FCFA', ''), 10) || 0;
}

/**
 * Applique le formatage FCFA sur tous les éléments portant la classe .currency.
 * À appeler au chargement de la page.
 */
function initCurrencyFormat() {
  document.querySelectorAll('.currency').forEach(function (el) {
    var raw = parseFloat(el.dataset.value || el.textContent.replace(/\s/g, '').replace('FCFA', ''));
    if (!isNaN(raw)) {
      el.textContent = formatFCFA(raw);
    }
  });
}

/**
 * Retourne le nom du fichier HTML courant (sans chemin).
 * @returns {string} ex : "03_nouvelle_commande.html"
 */
function getCurrentPage() {
  var parts = window.location.pathname.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Calcule la date en ajoutant un nombre de jours ouvrés (hors dimanche).
 * @param {Date} date       - Date de départ
 * @param {number} daysToAdd - Nombre de jours à ajouter (hors dimanche)
 * @returns {Date} Nouvelle date
 */
function nextWorkingDay(date, daysToAdd) {
  var result = new Date(date);
  var added = 0;
  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    // 0 = dimanche → on saute
    if (result.getDay() !== 0) {
      added++;
    }
  }
  return result;
}

/**
 * Formate une date en chaîne yyyy-mm-dd (format <input type="date">).
 * @param {Date} date
 * @returns {string}
 */
function toInputDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

// ═══════════════════════════════════════════════════════════════
// 2. LAYOUT & NAVIGATION
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise le comportement responsive de la sidebar :
 * - Le bouton hamburger #sidebarToggle ouvre/ferme la sidebar
 * - Un clic en dehors de la sidebar la ferme sur mobile
 */
function initSidebar() {
  var sidebar = document.getElementById('sidebar');
  var toggleBtn = document.getElementById('sidebarToggle');

  if (!sidebar) return;

  // Clic sur le bouton hamburger
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

  // Clic en dehors de la sidebar → fermeture
  document.addEventListener('click', function (e) {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggleBtn) {
      sidebar.classList.remove('open');
    }
  });
}

/**
 * Détecte la page HTML courante et ajoute la classe CSS "active"
 * au lien de navigation correspondant dans la sidebar.
 */
function initActiveNav() {
  var currentPage = getCurrentPage();
  if (!currentPage) return;

  // Sélectionne tous les liens de la sidebar
  var navLinks = document.querySelectorAll('#sidebar .nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.indexOf(currentPage) !== -1) {
      // Retire la classe active d'éventuels liens déjà actifs (style inline)
      link.style.background = 'rgba(201,160,32,0.2)';
      link.style.color = '#C9A020';
      link.style.fontWeight = '700';
      link.classList.add('active');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. NOTIFICATIONS TOAST
// ═══════════════════════════════════════════════════════════════

/**
 * Affiche une notification Bootstrap Toast dans le coin bas-droit.
 * @param {string} message - Texte du message
 * @param {string} type    - 'success' | 'error' | 'warning' | 'info'
 */
function showToast(message, type) {
  type = type || 'success';

  // Correspondance type → couleurs Bootstrap
  var config = {
    success: { bg: '#1C3D2A', icon: 'fa-check-circle', label: 'Succès' },
    error:   { bg: '#dc3545', icon: 'fa-times-circle',  label: 'Erreur' },
    warning: { bg: '#C9A020', icon: 'fa-exclamation-triangle', label: 'Attention' },
    info:    { bg: '#0d6efd', icon: 'fa-info-circle',   label: 'Info' }
  };
  var c = config[type] || config.success;

  // Conteneur des toasts (créé une seule fois)
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(container);
  }

  // Construction du toast
  var toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white border-0 show';
  toastEl.style.cssText = 'background:' + c.bg + ';min-width:280px;max-width:380px;box-shadow:0 4px 16px rgba(0,0,0,0.2);border-radius:8px;';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML =
    '<div class="d-flex">' +
      '<div class="toast-body d-flex align-items-center gap-2">' +
        '<i class="fas ' + c.icon + ' fs-5"></i>' +
        '<span>' + message + '</span>' +
      '</div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Fermer"></button>' +
    '</div>';

  container.appendChild(toastEl);

  // Bouton fermeture manuelle
  toastEl.querySelector('.btn-close').addEventListener('click', function () {
    toastEl.remove();
  });

  // Auto-disparition après 3 secondes avec animation
  setTimeout(function () {
    toastEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(30px)';
    setTimeout(function () { toastEl.remove(); }, 400);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// 4. NOUVELLE COMMANDE — Tableau vêtements dynamique
// ═══════════════════════════════════════════════════════════════

/** Prix par défaut (FCFA) selon le type de vêtement */
var PRIX_DEFAUT = {
  'Chemise':          500,
  'Pantalon':         700,
  'Robe':             900,
  'Veste':           1200,
  'Costume':         2000,
  'Linge de maison':  400
};

/** Compteur interne pour les IDs de ligne */
var vetementRowCounter = 0;

/**
 * Crée et retourne un élément <tr> représentant une ligne vêtement.
 * @returns {HTMLTableRowElement}
 */
function createVetementRow() {
  vetementRowCounter++;
  var id = vetementRowCounter;

  var tr = document.createElement('tr');
  tr.id = 'vet-row-' + id;

  // Options du select type
  var options = Object.keys(PRIX_DEFAUT).map(function (type) {
    return '<option value="' + type + '" data-prix="' + PRIX_DEFAUT[type] + '">' + type + '</option>';
  }).join('');

  tr.innerHTML =
    '<td>' +
      '<select class="form-select form-select-sm vet-type" style="min-width:150px;">' +
        options +
      '</select>' +
    '</td>' +
    '<td>' +
      '<input type="number" class="form-control form-control-sm vet-qty text-center" ' +
             'value="1" min="1" max="99" style="width:70px;">' +
    '</td>' +
    '<td>' +
      '<input type="number" class="form-control form-control-sm vet-prix text-center" ' +
             'value="' + Object.values(PRIX_DEFAUT)[0] + '" min="0" style="width:90px;">' +
    '</td>' +
    '<td class="vet-subtotal text-end fw-semibold" style="color:#1C3D2A;">' +
      formatFCFA(Object.values(PRIX_DEFAUT)[0]) +
    '</td>' +
    '<td class="text-center">' +
      '<button type="button" class="btn btn-sm btn-outline-danger vet-remove" ' +
              'title="Supprimer cette ligne">' +
        '<i class="fas fa-trash-alt"></i>' +
      '</button>' +
    '</td>';

  // Événements sur la ligne
  var selectType = tr.querySelector('.vet-type');
  var inputQty   = tr.querySelector('.vet-qty');
  var inputPrix  = tr.querySelector('.vet-prix');
  var btnRemove  = tr.querySelector('.vet-remove');

  // Changement de type → mise à jour du prix par défaut
  selectType.addEventListener('change', function () {
    var selectedOption = selectType.options[selectType.selectedIndex];
    var prix = selectedOption.dataset.prix || PRIX_DEFAUT[selectType.value] || 0;
    inputPrix.value = prix;
    updateVetementSubtotal(tr);
    updateVetementTotal();
  });

  // Changement de quantité → recalcul
  inputQty.addEventListener('input', function () {
    updateVetementSubtotal(tr);
    updateVetementTotal();
  });

  // Changement de prix unitaire → recalcul
  inputPrix.addEventListener('input', function () {
    updateVetementSubtotal(tr);
    updateVetementTotal();
  });

  // Suppression de la ligne
  btnRemove.addEventListener('click', function () {
    tr.style.transition = 'opacity 0.25s ease';
    tr.style.opacity = '0';
    setTimeout(function () {
      tr.remove();
      updateVetementTotal();
    }, 250);
  });

  return tr;
}

/**
 * Met à jour le sous-total affiché d'une ligne vêtement.
 * @param {HTMLTableRowElement} row - La ligne concernée
 */
function updateVetementSubtotal(row) {
  var qty   = parseInt(row.querySelector('.vet-qty').value, 10)  || 0;
  var prix  = parseFloat(row.querySelector('.vet-prix').value)   || 0;
  var sub   = qty * prix;
  row.querySelector('.vet-subtotal').textContent = formatFCFA(sub);
}

/**
 * Recalcule et affiche le total global de toutes les lignes vêtements.
 */
function updateVetementTotal() {
  var total = 0;
  document.querySelectorAll('#vetementTable tbody tr').forEach(function (row) {
    var qty  = parseInt(row.querySelector('.vet-qty').value, 10)  || 0;
    var prix = parseFloat(row.querySelector('.vet-prix').value)   || 0;
    total += qty * prix;
  });
  var totalEl = document.getElementById('vetementTotal');
  if (totalEl) {
    totalEl.textContent = formatFCFA(total);
  }
}

/**
 * Initialise le module tableau vêtements de la page Nouvelle Commande.
 * Attache l'événement sur le bouton "Ajouter un vêtement".
 */
function initVetementTable() {
  var btnAdd = document.getElementById('addVetementBtn');
  var tbody  = document.querySelector('#vetementTable tbody');

  if (!btnAdd || !tbody) return;

  // Ajoute une première ligne par défaut
  tbody.appendChild(createVetementRow());
  updateVetementTotal();

  // Clic sur "Ajouter"
  btnAdd.addEventListener('click', function () {
    var newRow = createVetementRow();
    newRow.style.opacity = '0';
    tbody.appendChild(newRow);
    // Animation d'apparition
    requestAnimationFrame(function () {
      newRow.style.transition = 'opacity 0.3s ease';
      newRow.style.opacity = '1';
    });
    updateVetementTotal();
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. NOUVELLE COMMANDE — Autocomplete client
// ═══════════════════════════════════════════════════════════════

/** Données fictives de clients pour la démonstration */
var CLIENTS_DEMO = [
  { nom: 'Koné',    prenom: 'Amadou',    tel: '+225 07 12 34 56', email: 'akone@mail.ci' },
  { nom: 'Diallo',  prenom: 'Fatoumata', tel: '+225 05 98 76 54', email: '' },
  { nom: 'Traoré',  prenom: 'Ibrahim',   tel: '+225 01 23 45 67', email: 'itraore@mail.ci' },
  { nom: 'Ouattara',prenom: 'Awa',       tel: '+225 07 87 65 43', email: '' },
  { nom: 'Bamba',   prenom: 'Seydou',    tel: '+225 05 11 22 33', email: 'sbamba@mail.ci' },
  { nom: 'Coulibaly',prenom: 'Mariam',   tel: '+225 01 44 55 66', email: 'mcoulibaly@mail.ci' },
  { nom: 'Yao',     prenom: 'Koffi',     tel: '+225 07 33 44 55', email: '' },
  { nom: 'N\'Guessan',prenom: 'Akissi',  tel: '+225 05 66 77 88', email: 'anguessan@mail.ci' },
];

/**
 * Initialise l'autocomplete sur le champ #clientSearch.
 * Filtre les clients CLIENTS_DEMO et remplit les champs du formulaire.
 */
function initClientAutocomplete() {
  var searchInput = document.getElementById('clientSearch');
  if (!searchInput) return;

  // Crée la liste déroulante de suggestions
  var suggList = document.createElement('ul');
  suggList.id = 'clientSuggestions';
  suggList.style.cssText =
    'position:absolute;z-index:1000;background:#fff;border:1px solid #dee2e6;' +
    'border-radius:6px;list-style:none;padding:0;margin:0;width:100%;' +
    'max-height:220px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,0.1);display:none;';

  // Positionne la liste sous le champ de recherche
  var wrapper = searchInput.parentElement;
  wrapper.style.position = 'relative';
  wrapper.appendChild(suggList);

  /**
   * Affiche les suggestions filtrées selon la saisie.
   * @param {string} query - Texte saisi par l'utilisateur
   */
  function renderSuggestions(query) {
    suggList.innerHTML = '';
    if (!query || query.length < 2) {
      suggList.style.display = 'none';
      return;
    }

    var q = query.toLowerCase();
    var results = CLIENTS_DEMO.filter(function (c) {
      return (c.nom + ' ' + c.prenom).toLowerCase().indexOf(q) !== -1 ||
             c.tel.replace(/\s/g, '').indexOf(q.replace(/\s/g, '')) !== -1;
    });

    if (results.length === 0) {
      suggList.style.display = 'none';
      return;
    }

    results.forEach(function (client) {
      var li = document.createElement('li');
      li.style.cssText = 'padding:0.55rem 1rem;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:0.88rem;';
      li.innerHTML =
        '<strong>' + client.nom + ' ' + client.prenom + '</strong>' +
        '<span class="d-block text-muted" style="font-size:0.8rem;">' + client.tel + '</span>';

      li.addEventListener('mouseenter', function () { li.style.background = 'rgba(28,61,42,0.08)'; });
      li.addEventListener('mouseleave', function () { li.style.background = ''; });

      // Clic → remplit les champs du formulaire
      li.addEventListener('click', function () {
        fillClientFields(client);
        searchInput.value = client.nom + ' ' + client.prenom;
        suggList.style.display = 'none';
      });

      suggList.appendChild(li);
    });

    suggList.style.display = 'block';
  }

  // Écoute la saisie
  searchInput.addEventListener('input', function () {
    renderSuggestions(searchInput.value);
  });

  // Ferme la liste si clic ailleurs
  document.addEventListener('click', function (e) {
    if (e.target !== searchInput) {
      suggList.style.display = 'none';
    }
  });
}

/**
 * Remplit les champs client du formulaire Nouvelle Commande.
 * @param {Object} client - Objet client { nom, prenom, tel, email }
 */
function fillClientFields(client) {
  var fields = {
    clientNom:    client.nom,
    clientPrenom: client.prenom,
    clientTel:    client.tel,
    clientEmail:  client.email || ''
  };
  Object.keys(fields).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = fields[id];
  });
}

// ═══════════════════════════════════════════════════════════════
// 6. NOUVELLE COMMANDE — Calcul automatique des dates
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise le calcul automatique des dates (lavage et sortie)
 * en fonction de la date de dépôt saisie.
 */
function initDateCalculation() {
  var inputDepot  = document.getElementById('dateDépôt') || document.getElementById('dateDepot');
  var inputLavage = document.getElementById('dateLavage');
  var inputSortie = document.getElementById('dateSortie');

  if (!inputDepot) return;

  /**
   * Recalcule les dates dérivées selon la date de dépôt.
   */
  function recalcDates() {
    var val = inputDepot.value;
    if (!val) return;

    var depot  = new Date(val + 'T00:00:00'); // force heure locale
    var lavage = nextWorkingDay(depot, 1);    // dépôt + 1 jour ouvré
    var sortie = nextWorkingDay(depot, 3);    // dépôt + 3 jours ouvrés

    if (inputLavage) inputLavage.value = toInputDate(lavage);
    if (inputSortie) inputSortie.value = toInputDate(sortie);
  }

  inputDepot.addEventListener('change', recalcDates);

  // Calcul initial si la date est déjà préremplie
  if (inputDepot.value) recalcDates();
}

// ═══════════════════════════════════════════════════════════════
// 7. DASHBOARD — Graphique Chart.js
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise le graphique d'activité hebdomadaire sur le dashboard.
 * Ne s'exécute que si le canvas #commandesChart est présent sur la page.
 */
function initDashboardChart() {
  var canvas = document.getElementById('commandesChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Labels : 7 derniers jours
  var labels = (function () {
    var days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    var result = [];
    var today = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push(days[d.getDay()] + ' ' + d.getDate());
    }
    return result;
  })();

  var data = [8, 14, 11, 17, 13, 22, 9]; // Données fictives réalistes

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Commandes',
        data: data,
        backgroundColor: 'rgba(28, 61, 42, 0.82)',
        borderColor: '#1C3D2A',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: '#C9A020'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) { return ' ' + ctx.parsed.y + ' commandes'; }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#555', font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5, color: '#555', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.06)' }
        }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 8. RAPPORTS — Graphiques Chart.js
// ═══════════════════════════════════════════════════════════════

/** Données fictives — commandes par semaine (7 semaines) */
var WEEKLY_DATA = [22, 18, 31, 27, 24, 19, 28];

/** Données fictives — répartition des types de vêtements */
var TYPE_DATA = {
  'Chemises':  38,
  'Pantalons': 28,
  'Robes':     15,
  'Vestes':    12,
  'Autres':     7
};

/**
 * Initialise les graphiques de la page Rapports.
 * - #weeklyChart : barres commandes par semaine
 * - #typeChart   : camembert répartition vêtements
 */
function initRapportsCharts() {
  if (typeof Chart === 'undefined') return;

  // --- Graphique barres : commandes par semaine ---
  var weeklyCanvas = document.getElementById('weeklyChart');
  if (weeklyCanvas) {
    var weekLabels = WEEKLY_DATA.map(function (_, i) {
      return 'Sem. ' + (i + 1);
    });
    new Chart(weeklyCanvas, {
      type: 'bar',
      data: {
        labels: weekLabels,
        datasets: [{
          label: 'Commandes',
          data: WEEKLY_DATA,
          backgroundColor: 'rgba(28, 61, 42, 0.80)',
          borderColor: '#1C3D2A',
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: '#C9A020'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Commandes par semaine',
            color: '#1C3D2A',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } }
        }
      }
    });
  }

  // --- Graphique camembert : répartition par type ---
  var typeCanvas = document.getElementById('typeChart');
  if (typeCanvas) {
    var typeColors = ['#1C3D2A', '#C9A020', '#3a7d5a', '#e8c547', '#7ab893'];
    new Chart(typeCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(TYPE_DATA),
        datasets: [{
          data: Object.values(TYPE_DATA),
          backgroundColor: typeColors,
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 12 } }
          },
          title: {
            display: true,
            text: 'Répartition par type de vêtement',
            color: '#1C3D2A',
            font: { size: 14, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.label + ' : ' + ctx.parsed + ' %';
              }
            }
          }
        }
      }
    });
  }
}

/**
 * Détecte la page et déclenche le bon graphique.
 * Appelle initDashboardChart ou initRapportsCharts selon le contexte.
 */
function initCharts() {
  initDashboardChart();
  initRapportsCharts();
}

// ═══════════════════════════════════════════════════════════════
// 9. TRAITEMENT LAVAGE / REPASSAGE — Gestion des lots
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise les boutons d'action sur les cartes de lots
 * (Démarrer, Valider, Reporter) pour les pages de traitement.
 *
 * Structure HTML attendue par carte :
 *   .lot-card[data-lot-id="X"]
 *     .lot-badge              → badge de statut
 *     .btn-demarrer           → déclenche "EN COURS"
 *     .btn-valider-lot        → déclenche modal de confirmation
 *     .btn-reporter           → ouvre modal de report avec motif
 */
function initTraitementLots() {
  // --- Boutons DÉMARRER ---
  document.querySelectorAll('.btn-demarrer').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card   = btn.closest('.lot-card');
      var badge  = card ? card.querySelector('.lot-badge') : null;
      var valBtn = card ? card.querySelector('.btn-valider-lot') : null;

      if (badge) {
        badge.textContent = 'EN COURS';
        badge.className   = 'badge lot-badge';
        badge.style.cssText = 'background:#0d6efd;color:#fff;font-size:0.8rem;padding:0.35em 0.75em;border-radius:20px;transition:all 0.3s ease;';
      }
      // Active le bouton "Valider"
      if (valBtn) {
        valBtn.disabled = false;
        valBtn.style.opacity = '1';
      }
      // Désactive "Démarrer"
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-play me-1"></i>En cours…';

      showToast('Lot démarré avec succès.', 'info');
    });
  });

  // --- Boutons VALIDER (avec modal Bootstrap) ---
  document.querySelectorAll('.btn-valider-lot').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.lot-card');

      // Ouvre une modal Bootstrap de confirmation si disponible
      var modalEl = document.getElementById('modalValiderLot');
      if (modalEl && typeof bootstrap !== 'undefined') {
        // Stocke la card dans la modal pour récupération au confirm
        modalEl.dataset.targetCard = card ? card.id : '';
        var modal = new bootstrap.Modal(modalEl);
        modal.show();
      } else {
        // Fallback : confirmation native
        if (confirm('Confirmer la validation de ce lot ?')) {
          validerLot(card, btn);
        }
      }
    });
  });

  // Bouton de confirmation dans la modal #modalValiderLot
  var btnConfirmModal = document.getElementById('btnConfirmValiderLot');
  if (btnConfirmModal) {
    btnConfirmModal.addEventListener('click', function () {
      var modalEl = document.getElementById('modalValiderLot');
      var cardId  = modalEl ? modalEl.dataset.targetCard : '';
      var card    = cardId ? document.getElementById(cardId) : null;
      var btn     = card ? card.querySelector('.btn-valider-lot') : null;

      validerLot(card, btn);

      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    });
  }

  // --- Boutons REPORTER ---
  document.querySelectorAll('.btn-reporter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card   = btn.closest('.lot-card');
      var lotId  = card ? card.dataset.lotId : '?';
      var motif  = prompt('Motif du report pour le lot ' + lotId + ' :');
      if (motif && motif.trim()) {
        showToast('Lot ' + lotId + ' reporté : ' + motif.trim(), 'warning');
        btn.innerHTML = '<i class="fas fa-clock me-1"></i>Reporté';
        btn.disabled  = true;
        btn.className = btn.className.replace('btn-outline-warning', 'btn-secondary');
      }
    });
  });
}

/**
 * Marque un lot comme TERMINÉ et grise la card.
 * @param {HTMLElement} card - La card du lot
 * @param {HTMLElement} btn  - Le bouton valider
 */
function validerLot(card, btn) {
  if (card) {
    var badge = card.querySelector('.lot-badge');
    if (badge) {
      badge.textContent = 'TERMINÉ';
      badge.style.cssText = 'background:#1C3D2A;color:#fff;font-size:0.8rem;padding:0.35em 0.75em;border-radius:20px;transition:all 0.3s ease;';
    }
    // Grisage de la card
    card.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
    card.style.opacity    = '0.55';
    card.style.filter     = 'grayscale(0.4)';
    card.style.pointerEvents = 'none';
  }
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-check me-1"></i>Validé';
  }
  showToast('Lot validé et marqué comme TERMINÉ !', 'success');
}

// ═══════════════════════════════════════════════════════════════
// 10. REGROUPEMENT CLIENT — Validation quantités
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise la validation des quantités présentes vs commandées.
 * Gère l'activation du bouton "Valider le regroupement".
 *
 * Structure HTML attendue :
 *   <input class="qty-present" data-expected="N"> → saisie quantité présente
 *   <td class="qty-status"> → affiche l'icône OK / KO
 *   #btnValiderRegroupement  → activé seulement si tout est correct
 */
function initRegroupementQty() {
  var inputs = document.querySelectorAll('.qty-present');
  if (inputs.length === 0) return;

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      checkAllQty();
    });
  });

  /**
   * Vérifie toutes les lignes et met à jour les icônes de statut.
   * Active ou désactive le bouton de validation global.
   */
  function checkAllQty() {
    var allOk = true;
    var btnValider = document.getElementById('btnValiderRegroupement');

    inputs.forEach(function (input) {
      var expected = parseInt(input.dataset.expected, 10) || 0;
      var actual   = parseInt(input.value, 10) || 0;
      var statusEl = input.closest('tr') ? input.closest('tr').querySelector('.qty-status') : null;

      if (actual === expected) {
        if (statusEl) {
          statusEl.innerHTML =
            '<span class="text-success fw-bold" title="Quantité correcte">' +
            '<i class="fas fa-check-circle fs-5"></i></span>';
        }
      } else {
        allOk = false;
        if (statusEl) {
          statusEl.innerHTML =
            '<span class="text-danger fw-bold" title="Quantité incorrecte">' +
            '<i class="fas fa-times-circle fs-5"></i></span>';
        }
      }
    });

    if (btnValider) {
      btnValider.disabled = !allOk;
      btnValider.style.opacity = allOk ? '1' : '0.5';
    }

    if (!allOk) {
      var alertEl = document.getElementById('alertQtyError');
      if (alertEl) alertEl.style.display = 'flex';
    } else {
      var alertEl = document.getElementById('alertQtyError');
      if (alertEl) alertEl.style.display = 'none';
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 11. PAIEMENT — Mode conditionnel & calcul du reste
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise le formulaire de paiement :
 * - Affiche/cache le champ de référence selon le mode de paiement
 * - Calcule en temps réel le reste à payer
 * - Empêche le versement de dépasser le montant dû
 */
function initPaiement() {
  var selectMode       = document.getElementById('modePaiement');
  var champReference   = document.getElementById('wrapperReference');
  var inputVersement   = document.getElementById('montantVersement');
  var inputTotal       = document.getElementById('montantTotal');
  var displayReste     = document.getElementById('resteAPayer');

  if (!selectMode) return;

  /** Modes nécessitant une référence de transaction */
  var MODES_MOBILE_MONEY = ['MTN Money', 'Orange Money', 'Wave', 'Moov Money'];

  /**
   * Affiche ou cache le champ de référence selon le mode sélectionné.
   */
  function toggleReference() {
    if (!champReference) return;
    var mode = selectMode.value;
    if (MODES_MOBILE_MONEY.indexOf(mode) !== -1) {
      champReference.style.display = 'block';
      champReference.style.transition = 'opacity 0.3s ease';
      champReference.style.opacity = '1';
    } else {
      champReference.style.opacity = '0';
      setTimeout(function () {
        champReference.style.display = 'none';
      }, 300);
    }
  }

  /**
   * Calcule et affiche le reste à payer.
   * Limite le versement saisi au montant dû.
   */
  function calcReste() {
    if (!inputTotal || !inputVersement || !displayReste) return;

    var total    = parseFloat(inputTotal.value)     || 0;
    var verse    = parseFloat(inputVersement.value) || 0;

    // Empêche de saisir plus que le total
    if (verse > total) {
      inputVersement.value = total;
      verse = total;
      showToast('Le versement ne peut pas dépasser le total dû.', 'warning');
    }

    var reste = total - verse;
    displayReste.textContent = formatFCFA(reste);

    // Coloration visuelle du reste
    if (displayReste) {
      displayReste.style.color = reste <= 0 ? '#1C3D2A' : '#dc3545';
    }
  }

  selectMode.addEventListener('change', toggleReference);
  if (inputVersement) inputVersement.addEventListener('input', calcReste);

  // Initialisation
  toggleReference();
  calcReste();
}

// ═══════════════════════════════════════════════════════════════
// 12. REMISE — Modal confirmation avec checkbox
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise les boutons "Remettre" sur la page Remise.
 * Chaque bouton ouvre une modal Bootstrap.
 * La checkbox de confirmation doit être cochée pour activer le bouton final.
 * La confirmation marque la commande comme "RETIRÉ".
 */
function initRemise() {
  // --- Activation du bouton confirmer selon la checkbox ---
  document.querySelectorAll('.checkbox-confirmation').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var modal   = checkbox.closest('.modal');
      var btnConf = modal ? modal.querySelector('.btn-confirmer-remise') : null;
      if (btnConf) {
        btnConf.disabled     = !checkbox.checked;
        btnConf.style.opacity = checkbox.checked ? '1' : '0.5';
      }
    });
  });

  // --- Bouton confirmer → désactive la card + badge RETIRÉ ---
  document.querySelectorAll('.btn-confirmer-remise').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal  = btn.closest('.modal');
      var cardId = modal ? modal.dataset.targetCard : null;
      var card   = cardId ? document.getElementById(cardId) : null;

      if (card) {
        // Met à jour le badge
        var badge = card.querySelector('.badge-statut');
        if (badge) {
          badge.textContent = 'RETIRÉ';
          badge.className   = 'badge badge-statut';
          badge.style.cssText = 'background:#6c757d;color:#fff;font-size:0.8rem;' +
                                 'padding:0.35em 0.75em;border-radius:20px;';
        }
        // Grise la card
        card.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
        card.style.opacity    = '0.6';
        card.style.filter     = 'grayscale(0.5)';
      }

      // Ferme la modal
      var bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();

      showToast('Commande remise au client avec succès !', 'success');
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 13. ADMIN VÊTEMENTS — Drag & Drop simulé (boutons ↑ ↓)
// ═══════════════════════════════════════════════════════════════

/**
 * Initialise les boutons de déplacement de ligne dans la table
 * d'administration des types de vêtements (#vetTypesTable).
 * Met à jour les numéros d'ordre après chaque déplacement.
 */
function initVetTypesOrder() {
  var table = document.getElementById('vetTypesTable');
  if (!table) return;

  /**
   * Déplace une ligne vers le haut ou le bas.
   * @param {HTMLTableRowElement} row - La ligne à déplacer
   * @param {string} direction - 'up' | 'down'
   */
  function moveRow(row, direction) {
    var tbody = row.parentElement;

    if (direction === 'up') {
      var prev = row.previousElementSibling;
      if (prev) {
        tbody.insertBefore(row, prev);
      }
    } else if (direction === 'down') {
      var next = row.nextElementSibling;
      if (next) {
        tbody.insertBefore(next, row);
      }
    }

    // Animation flash
    row.style.transition = 'background 0.3s ease';
    row.style.background = 'rgba(201,160,32,0.15)';
    setTimeout(function () { row.style.background = ''; }, 300);

    updateOrderNumbers(tbody);
  }

  /**
   * Remet à jour les numéros d'ordre (#) dans la première colonne.
   * @param {HTMLElement} tbody
   */
  function updateOrderNumbers(tbody) {
    var rows = tbody.querySelectorAll('tr');
    rows.forEach(function (r, index) {
      var orderCell = r.querySelector('.order-num');
      if (orderCell) orderCell.textContent = index + 1;
    });
  }

  // Délégation d'événement sur le tbody
  var tbody = table.querySelector('tbody');
  if (!tbody) return;

  tbody.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-move-up, .btn-move-down');
    if (!btn) return;

    var row = btn.closest('tr');
    if (!row) return;

    if (btn.classList.contains('btn-move-up')) {
      moveRow(row, 'up');
    } else if (btn.classList.contains('btn-move-down')) {
      moveRow(row, 'down');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 14. RECHERCHE & FILTRES TABLEAUX
// ═══════════════════════════════════════════════════════════════

/**
 * Filtre les lignes d'un tableau en fonction d'une valeur recherchée.
 * La recherche est insensible à la casse et s'applique sur tout le texte de la ligne.
 *
 * @param {string} tableId    - L'id du tableau cible (ex : "commandesTable")
 * @param {string} searchValue - La valeur à rechercher
 */
function filterTable(tableId, searchValue) {
  var table = document.getElementById(tableId);
  if (!table) return;

  var q    = searchValue.toLowerCase().trim();
  var rows = table.querySelectorAll('tbody tr');

  rows.forEach(function (row) {
    var text = row.textContent.toLowerCase();
    row.style.display = (q === '' || text.indexOf(q) !== -1) ? '' : 'none';
  });
}

/**
 * Initialise la recherche en temps réel sur les tableaux principaux.
 * Attache les écouteurs sur les inputs de filtre identifiés par data-filter-table.
 *
 * Usage HTML : <input data-filter-table="commandesTable" placeholder="Rechercher...">
 */
function initTableFilters() {
  document.querySelectorAll('[data-filter-table]').forEach(function (input) {
    var tableId = input.dataset.filterTable;
    input.addEventListener('input', function () {
      filterTable(tableId, input.value);
    });
  });

  // Compatibilité avec les IDs explicites #searchCommandes et #searchClients
  var searchCommandes = document.getElementById('searchCommandes');
  if (searchCommandes) {
    searchCommandes.addEventListener('input', function () {
      filterTable('commandesTable', searchCommandes.value);
    });
  }

  var searchClients = document.getElementById('searchClients');
  if (searchClients) {
    searchClients.addEventListener('input', function () {
      filterTable('clientsTable', searchClients.value);
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// 15. INITIALISATION PRINCIPALE
// ═══════════════════════════════════════════════════════════════

/**
 * Point d'entrée principal.
 * Initialise tous les modules au chargement du DOM.
 * Chaque module vérifie lui-même la présence des éléments nécessaires
 * avant de s'activer, ce qui le rend sûr sur toutes les pages.
 */
document.addEventListener('DOMContentLoaded', function () {

  // --- Modules actifs sur toutes les pages ---
  initSidebar();
  initActiveNav();
  initCurrencyFormat();
  initTableFilters();

  // --- Modules conditionnels selon les éléments présents ---
  var page = getCurrentPage();

  // Nouvelle commande (03_nouvelle_commande.html)
  if (document.getElementById('addVetementBtn') || document.getElementById('vetementTable')) {
    initVetementTable();
  }
  if (document.getElementById('clientSearch')) {
    initClientAutocomplete();
  }
  if (document.getElementById('dateDepot') || document.getElementById('dateDépôt')) {
    initDateCalculation();
  }

  // Dashboard (02_dashboard.html)
  if (document.getElementById('commandesChart')) {
    initDashboardChart();
  }

  // Rapports (14_admin_rapports.html)
  if (document.getElementById('weeklyChart') || document.getElementById('typeChart')) {
    initRapportsCharts();
  }

  // Traitement lavage / repassage (06, 07)
  if (document.querySelector('.btn-demarrer') || document.querySelector('.lot-card')) {
    initTraitementLots();
  }

  // Regroupement client (08_regroupement_client.html)
  if (document.querySelector('.qty-present')) {
    initRegroupementQty();
  }

  // Paiement (09_paiement.html)
  if (document.getElementById('modePaiement')) {
    initPaiement();
  }

  // Remise (10_remise.html)
  if (document.querySelector('.btn-confirmer-remise') || document.querySelector('.checkbox-confirmation')) {
    initRemise();
  }

  // Admin types vêtements (12_admin_vetements.html)
  if (document.getElementById('vetTypesTable')) {
    initVetTypesOrder();
  }

  console.info('[Élégance Pressing] main.js chargé — page : ' + (page || 'inconnue'));
});
