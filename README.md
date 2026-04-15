# Élégance Pressing — Maquettes interactives

Maquettes HTML/CSS/JS statiques de l'application **Élégance Pressing** (Côte d'Ivoire).
Déployées via **GitHub Pages** pour la présentation client.

## Voir la présentation

> **[Ouvrir les maquettes →](https://dibichristian.github.io/Elegance_Pressing_Mockups/)**

## Structure

```
index.html              ← Page d'accueil (choix V1 / V2)
v1/                     ← Application de gestion interne (14 pages)
v2/
  public/               ← Site vitrine (5 pages)
  espace-client/        ← Espace client (6 pages)
```

## Pages disponibles

### V1 — Gestion interne (employés & admin)
| # | Page |
|---|---|
| 01 | Connexion |
| 02 | Tableau de bord |
| 03 | Nouvelle commande |
| 04 | Liste des commandes |
| 05 | Planification des lots |
| 06 | Traitement lavage |
| 07 | Traitement repassage |
| 08 | Regroupement client |
| 09 | Enregistrer un paiement |
| 10 | Remise des vêtements |
| 11 | Détail commande |
| 12 | Admin — Types & tarifs |
| 13 | Admin — Clients |
| 14 | Admin — Rapports |

### V2 — Plateforme client
| # | Page |
|---|---|
| 01 | Accueil |
| 02 | Services & tarifs |
| 03 | Contact |
| 04 | Connexion client |
| 05 | Inscription |
| 06 | Dashboard client |
| 07 | Mes commandes |
| 08 | Détail commande (Cas 1) |
| 09 | Détail commande (Cas 2) |
| 10 | Programme fidélité |
| 11 | Mon profil |

## Stack

- HTML5 / CSS3 / JavaScript (Vanilla)
- Bootstrap 5.3 (CDN)
- Font Awesome 6 (CDN)
- Chart.js (CDN)

## Déploiement GitHub Pages

```bash
git init
git add .
git commit -m "Initial mockups — Élégance Pressing"
git branch -M main
git remote add origin https://github.com/votre-username/elegance-pressing-mockups.git
git push -u origin main
```

Activer GitHub Pages : **Settings → Pages → Source : main / (root)**
