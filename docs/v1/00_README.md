# Documentation — Application Élégance Pressing
**Projet :** Gestion de Pressing | **Client :** Élégance Pressing, Côte d'Ivoire
**Stack :** Laravel + MySQL | **Date :** 2026-04-13

---

## Index des Documents

| # | Document | Description |
|---|---|---|
| 01 | [Cahier des charges](01_cahier_des_charges.md) | Vue d'ensemble, acteurs, périmètre, flux global |
| 02 | [Flux & Statuts](02_flux_et_statuts.md) | Diagrammes de flux, statuts, règles de transition |
| 03 | [Spécifications fonctionnelles](03_specifications_fonctionnelles.md) | Détail de chaque UC (champs, règles, actions) |
| 04 | [Modèle de données](04_modele_de_donnees.md) | Tables, colonnes, relations, formats |
| 05 | [Navigation & Rôles](05_navigation_et_roles.md) | Permissions, structure de navigation, sidebar |
| 06 | [Règles de gestion](06_regles_de_gestion.md) | RG01 à RG12 — toutes les règles métier |
| 07 | [Plan des maquettes](07_plan_maquettes.md) | Charte graphique, liste des 14 maquettes |

---

## Phases du Projet

```
PHASE 1 — Documentation ✅ (en cours)
    └── Cahier des charges, flux, specs, modèle données

PHASE 2 — Maquettes HTML/CSS/JS (à venir)
    └── 14 pages statiques pour présentation client

PHASE 3 — Backend Laravel (à venir)
    └── Modèles, contrôleurs, vues Blade, migrations, API
```

---

## Points Ouverts (à valider)

- [ ] **RG01** — Les jours ouvrés : fermeture le dimanche uniquement, ou aussi les jours fériés ?
- [ ] **RG07** — Ordre de priorité des types de vêtements (valider la liste par défaut)
- [ ] **UC6** — Le paiement peut-il être enregistré AVANT la création de la commande (acompte) ?
- [ ] **UC7** — Faut-il imprimer un bon de remise / reçu de retrait ?
- [ ] **Tarifs** — Prix par type de vêtement (à fournir pour remplir le référentiel)
- [ ] **Modes de paiement** — Espèces + Mobile Money (MTN, Orange ?) + autre ?
- [ ] **Impression** — Format ticket commande (thermique A5, A4 ?)
- [ ] **Multisite** — L'application gère-t-elle un seul point de vente ou plusieurs ?
