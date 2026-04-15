# Plan des Maquettes — Élégance Pressing
Version : 1.0 | Date : 2026-04-13

---

## Charte Graphique (à respecter)

| Élément | Valeur |
|---|---|
| Couleur primaire | `#1C3D2A` (Vert forêt) |
| Couleur accent | `#C9A020` (Or doré) |
| Fond crème | `#F5F5DC` |
| Fond clair | `#FFFFFF` |
| Texte principal | `#1A1A1A` |
| Texte secondaire | `#6C757D` |
| Succès | `#28A745` |
| Alerte | `#FFC107` |
| Danger | `#DC3545` |
| Police | Inter / Poppins (Google Fonts) |
| Framework | Bootstrap 5 |
| Style | Material Design épuré |

## Badges de Statut (couleurs)

| Statut | Couleur Badge |
|---|---|
| Reçu | Bleu clair `#17A2B8` |
| En lavage | Bleu `#007BFF` |
| Lavé | Cyan `#0DCAF0` |
| En repassage | Orange `#FD7E14` |
| Repassé | Orange clair `#FFC107` |
| Prêt | Vert `#28A745` |
| Retiré | Gris `#6C757D` |

| Paiement | Couleur Badge |
|---|---|
| Non payé | Rouge `#DC3545` |
| Partiel | Orange `#FD7E14` |
| Payé | Vert `#28A745` |

---

## Liste des Maquettes

### MAQUETTE 01 — Login
**Fichier :** `mockups/01_login.html`
**Layout :** Bipartite (image gauche + formulaire droite)
**Éléments :**
- Logo Élégance Pressing
- Formulaire (email + mot de passe + bouton connexion)
- Image de pressing côté gauche
- Couleurs : vert foncé + or

---

### MAQUETTE 02 — Dashboard
**Fichier :** `mockups/02_dashboard.html`
**Layout :** Sidebar + contenu principal
**Éléments :**
- Sidebar navigation (gauche)
- 4 KPI cards : Commandes du jour / Lots en attente / Commandes prêtes / Chiffre du jour
- Tableau des dernières commandes
- Alertes retards (commandes en rouge)
- Graphique hebdomadaire (simple, JS)

---

### MAQUETTE 03 — Nouvelle Commande (UC1)
**Fichier :** `mockups/03_nouvelle_commande.html`
**Layout :** Formulaire en deux colonnes
**Éléments :**
- Bloc client (recherche autocomplete + champs)
- Tableau vêtements dynamique (ajout de lignes)
- Bloc dates (lavage + sortie)
- Récapitulatif total
- Boutons : Valider / Annuler

---

### MAQUETTE 04 — Liste des Commandes
**Fichier :** `mockups/04_liste_commandes.html`
**Layout :** Tableau avec filtres
**Éléments :**
- Filtres (statut, date, client, recherche)
- Tableau commandes (n°, client, dépôt, sortie prévue, statut, paiement, actions)
- Bouton "Nouvelle commande"
- Pagination

---

### MAQUETTE 05 — Planification Lots (UC2)
**Fichier :** `mockups/05_planification_lots.html`
**Layout :** Vue calendrier + liste
**Éléments :**
- Sélecteur de date
- Liste vêtements à planifier (groupés par type)
- Zone de création de lot (drag ou sélection + bouton)
- Lots existants du jour

---

### MAQUETTE 06 — Traitement Lavage (UC3)
**Fichier :** `mockups/06_traitement_lavage.html`
**Layout :** Liste de lots par jour
**Éléments :**
- Sélecteur de date
- Cards de lots (statut, type, nombre de pièces)
- Détail d'un lot (vêtements inclus, commandes)
- Boutons : Démarrer / Valider / Reporter
- Modal de report (motif)

---

### MAQUETTE 07 — Traitement Repassage (UC4)
**Fichier :** `mockups/07_traitement_repassage.html`
**Layout :** Identique à UC3
**Différence :** Titre "Repassage", filtre sur vêtements lavés

---

### MAQUETTE 08 — Regroupement Client (UC5)
**Fichier :** `mockups/08_regroupement_client.html`
**Layout :** Liste clients + détail
**Éléments :**
- Liste clients avec vêtements repassés (nom, nb pièces)
- Panel droit : vêtements par commande
- Checklist de vérification
- Bouton de validation "Marquer comme prêt"

---

### MAQUETTE 09 — Paiement (UC6)
**Fichier :** `mockups/09_paiement.html`
**Layout :** Formulaire simple + historique
**Éléments :**
- Info commande (numéro, client, total)
- Montant versé / Restant
- Formulaire versement (montant, mode, référence)
- Historique des versements

---

### MAQUETTE 10 — Remise Vêtements (UC7)
**Fichier :** `mockups/10_remise.html`
**Layout :** Fiche de remise
**Éléments :**
- Récapitulatif commande
- Badge statut (doit être PRÊT)
- Statut paiement (alerte si incomplet)
- Checklist des vêtements
- Bouton de confirmation finale

---

### MAQUETTE 11 — Détail Commande
**Fichier :** `mockups/11_detail_commande.html`
**Layout :** Fiche complète
**Éléments :**
- Toutes les infos commande
- Timeline de statuts
- Liste vêtements avec statuts individuels
- Historique paiements
- Actions contextuelles

---

### MAQUETTES ADMIN (12–14)
- `mockups/12_admin_vetements.html` — Types de vêtements + tarifs
- `mockups/13_admin_clients.html` — Liste et fiche client
- `mockups/14_admin_rapports.html` — Rapports et graphiques

---

## Organisation des Fichiers Maquettes

```
mockups/
├── assets/
│   ├── css/
│   │   └── style.css          ← CSS commun (charte graphique)
│   ├── js/
│   │   └── main.js            ← JS commun (sidebar, interactions)
│   └── img/
│       └── logo.png
├── components/
│   ├── sidebar.html           ← Sidebar réutilisable
│   └── navbar.html            ← Topbar réutilisable
├── 01_login.html
├── 02_dashboard.html
├── 03_nouvelle_commande.html
├── 04_liste_commandes.html
├── 05_planification_lots.html
├── 06_traitement_lavage.html
├── 07_traitement_repassage.html
├── 08_regroupement_client.html
├── 09_paiement.html
├── 10_remise.html
├── 11_detail_commande.html
├── 12_admin_vetements.html
├── 13_admin_clients.html
└── 14_admin_rapports.html
```
