# Documentation V2 — Plateforme Web Client
**Projet :** Elegance Pressing | **Date :** 2026-04-14

## Index

| # | Document | Description |
|---|---|---|
| 01 | 01_cahier_des_charges.docx | Contexte, objectifs, deux cas de deploiement |
| 02 | 02_flux_et_statuts.docx | Flux visiteur, inscription, suivi, fidelite |
| 03 | 03_specifications_fonctionnelles.docx | Pages publiques + Espace client detaille |
| 04 | 04_modele_de_donnees.docx | Tables V2 (Cas 1 etendue V1 / Cas 2 standalone) |
| 05 | 05_navigation_et_roles.docx | Roles, permissions, URLs, maquettes priorites |
| 06 | 06_regles_de_gestion.docx | RG-V2-01 a RG-V2-07 |
| 07 | 07_plan_maquettes.docx | Charte graphique, 12 maquettes V2 |

## Deux modes de deploiement

**CAS 1 - Integre V1**
V2 connectee a la base de V1. Le client voit ses vetements en temps reel.
Prerequis : V1 installee et operationnelle.

**CAS 2 - Independant**
V2 standalone. Site vitrine + espace client basique + programme de fidelite.
Peut etre deploye sans V1.

## Points ouverts a valider
- [ ] Mode de deploiement prefere : Cas 1 ou Cas 2 (ou les deux pour la presentation) ?
- [ ] Regles du programme de fidelite (points, expiration, valeur)
- [ ] La demande de depot en ligne est-elle en V2 ou V3 ?
- [ ] Mini-CMS pour modifier les textes du site ?
- [ ] Les tarifs sont-ils publics sur la page d'accueil ?
- [ ] Niveaux de fidelite (Bronze, Argent, Or) ?

## Espace Admin V2 (standalone)

| # | Page | Description |
|---|---|---|
| VA-01 | VA-01_login.html | Connexion administrateur |
| VA-02 | VA-02_dashboard.html | Tableau de bord admin |
| VA-03 | VA-03_clients.html | Gestion des clients inscrits |
| VA-04 | VA-04_messages.html | Messages & demandes contact |
| VA-05 | VA-05_fidelite.html | Configuration programme fidélité |
| VA-06 | VA-06_contenu.html | Gestion du contenu (mini-CMS) |

### Fonctionnalités de l'admin V2 standalone
- Suivi des inscriptions clients et de leur activité
- Gestion des messages reçus via le formulaire contact
- Configuration et gestion du programme de fidélité (niveaux Bronze/Argent/Or)
- Mini-CMS : tarifs, coordonnées, textes du site, SEO
