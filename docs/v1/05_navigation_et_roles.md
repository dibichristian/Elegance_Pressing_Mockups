# Navigation & Rôles — Élégance Pressing
Version : 1.0 | Date : 2026-04-13

---

## 1. Rôles et Permissions

| Page / Action | Employé | Admin |
|---|:---:|:---:|
| Dashboard | ✅ | ✅ |
| Liste des commandes | ✅ | ✅ |
| Nouvelle commande (UC1) | ✅ | ✅ |
| Détail commande | ✅ | ✅ |
| Planification lots (UC2) | ✅ | ✅ |
| Traitement lavage (UC3) | ✅ | ✅ |
| Traitement repassage (UC4) | ✅ | ✅ |
| Regroupement client (UC5) | ✅ | ✅ |
| Paiement (UC6) | ✅ | ✅ |
| Remise vêtements (UC7) | ✅ | ✅ |
| Gestion clients | ✅ (lecture) | ✅ (CRUD) |
| Gestion types vêtements | ❌ | ✅ |
| Gestion utilisateurs | ❌ | ✅ |
| Rapports & statistiques | ❌ | ✅ |
| Configuration système | ❌ | ✅ |

---

## 2. Structure de Navigation

```
📱 APPLICATION ÉLÉGANCE PRESSING
│
├── 🔐 LOGIN
│
├── 🏠 DASHBOARD (accueil)
│   ├── Commandes du jour
│   ├── Lots en attente
│   ├── Commandes prêtes
│   ├── Alertes retards
│   └── Chiffre du jour
│
├── 📋 COMMANDES
│   ├── Liste des commandes (filtres : statut, date, client)
│   ├── Nouvelle commande [UC1]
│   └── Détail commande
│       ├── Informations générales
│       ├── Liste des vêtements
│       ├── Historique paiements
│       └── Actions (paiement, remise, impression)
│
├── 🧺 PRODUCTION
│   ├── Planification lots [UC2]
│   │   ├── Vue calendrier des lots
│   │   └── Créer / modifier un lot
│   ├── Traitement lavage [UC3]
│   │   ├── Sélection du jour
│   │   └── Lots du jour (démarrer / valider / reporter)
│   ├── Traitement repassage [UC4]
│   │   ├── Sélection du jour
│   │   └── Lots du jour
│   └── Regroupement client [UC5]
│       ├── Liste clients avec vêtements prêts
│       └── Validation par client
│
├── 💳 PAIEMENTS [UC6]
│   ├── Enregistrer un paiement
│   └── Historique des paiements
│
├── 📦 REMISES [UC7]
│   └── Commandes prêtes à remettre
│
└── ⚙️  ADMINISTRATION (Admin uniquement)
    ├── Clients (liste, fiche, historique)
    ├── Types de vêtements (CRUD + tarifs + priorités)
    ├── Utilisateurs (CRUD)
    └── Rapports
        ├── Commandes par période
        ├── Revenus
        └── Performance (délais, lots)
```

---

## 3. Sidebar de Navigation (Layout principal)

```
┌──────────────────────┐
│  [LOGO] ÉLÉGANCE     │
│         PRESSING     │
├──────────────────────┤
│  🏠 Dashboard        │
│  📋 Commandes        │
│  🧺 Production       │
│     · Planification  │
│     · Lavage         │
│     · Repassage      │
│     · Regroupement   │
│  💳 Paiements        │
│  📦 Remises          │
│  ⚙️  Administration  │  ← Admin only
├──────────────────────┤
│  👤 [Nom employé]    │
│  🚪 Déconnexion      │
└──────────────────────┘
```

---

## 4. Pages à Maquetter (ordre de priorité)

| Priorité | Page | Complexité |
|---|---|---|
| 1 | Login | Simple |
| 2 | Dashboard | Moyenne |
| 3 | Nouvelle commande | Haute |
| 4 | Liste des commandes | Moyenne |
| 5 | Planification lots | Haute |
| 6 | Traitement lavage | Moyenne |
| 7 | Traitement repassage | Moyenne |
| 8 | Regroupement client | Moyenne |
| 9 | Paiement | Simple |
| 10 | Remise vêtements | Simple |
| 11 | Détail commande | Haute |
| 12 | Admin — Types vêtements | Simple |
| 13 | Admin — Clients | Simple |
| 14 | Admin — Rapports | Haute |
