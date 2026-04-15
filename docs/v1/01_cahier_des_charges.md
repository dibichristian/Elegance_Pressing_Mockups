# Cahier des Charges — Application de Gestion Pressing
**Élégance Pressing | Côte d'Ivoire**
Version : 1.0 | Date : 2026-04-13

---

## 1. Contexte & Objectif

Élégance Pressing est un service de pressing professionnel basé en Côte d'Ivoire.
L'application a pour objectif de **digitaliser et automatiser** la gestion interne :
enregistrement des vêtements, suivi de production par lots, facturation et paiements.

## 2. Stack Technique

| Couche | Technologie |
|---|---|
| Backend | Laravel (PHP) |
| Frontend | Blade + Bootstrap 5 + JS |
| Base de données | MySQL |
| Authentification | Laravel Breeze / Sanctum |

## 3. Acteurs du Système

| Acteur | Rôle |
|---|---|
| **Employé** | Enregistre les commandes, traite les lots, gère les paiements |
| **Administrateur** | Configure le système, supervise, accède aux rapports complets |
| **Client** | Dépose et récupère ses vêtements (pas d'accès direct à l'app interne) |

> Le client n'a pas de compte dans cette version. Il est identifié par son nom/téléphone.

## 4. Périmètre Fonctionnel (v1.0)

### 4.1 Fonctionnalités incluses
- [x] Gestion des clients (création, fiche)
- [x] Enregistrement des commandes (UC1)
- [x] Planification des lots de lavage (UC2)
- [x] Traitement des lots de lavage (UC3)
- [x] Traitement du repassage (UC4)
- [x] Regroupement par client (UC5)
- [x] Gestion des paiements (UC6)
- [x] Remise des vêtements (UC7)
- [x] Dashboard de supervision
- [x] Gestion des types de vêtements et tarifs

### 4.2 Fonctionnalités exclues (v1.0)
- [ ] Portail client en ligne
- [ ] Notifications SMS/Email automatiques
- [ ] Application mobile
- [ ] Gestion du stock produits (détergents, etc.)

## 5. Flux Global du Système

```
[CLIENT DÉPOSE]
      ↓
  UC1 — ENREGISTREMENT COMMANDE
  → Statut : REÇU
      ↓
  UC2 — PLANIFICATION LOT LAVAGE
  → Groupement par date + type
      ↓
  UC3 — TRAITEMENT LAVAGE
  → Statut : LAVÉ
      ↓
  UC4 — TRAITEMENT REPASSAGE
  → Statut : REPASSÉ
      ↓
  UC5 — REGROUPEMENT PAR CLIENT
  → Statut : PRÊT
      ↓
  UC6 — PAIEMENT (peut intervenir à tout moment)
      ↓
  UC7 — REMISE VÊTEMENTS
  → Statut : RETIRÉ
```

## 6. Contraintes Métier

- Un vêtement suit obligatoirement le flux de statuts dans l'ordre
- Le paiement peut être enregistré à n'importe quelle étape
- La remise est bloquée si la commande n'est pas au statut "Prêt"
- Les dates (lavage J+1, sortie J+3) sont calculées automatiquement mais modifiables
- Le traitement est organisé par **lots** (pas commande par commande)

## 7. Contraintes Non-Fonctionnelles

- Interface responsive (mobile + desktop)
- Charte graphique : Élégance Pressing (vert #1C3D2A, or #C9A020, crème #F5F5DC)
- Langue : Français
- Sécurité : authentification obligatoire, rôles (admin / employé)
