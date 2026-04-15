# Modèle de Données — Élégance Pressing
Version : 1.0 | Date : 2026-04-13

---

## 1. Schéma des Tables

### Table : `users` (Utilisateurs)
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| name | VARCHAR(100) | NOT NULL | Nom complet |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashé |
| role | ENUM | NOT NULL | `admin` / `employe` |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `clients`
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| nom | VARCHAR(100) | NOT NULL | Nom de famille |
| prenom | VARCHAR(100) | NULL | Prénom |
| telephone | VARCHAR(20) | NOT NULL | Téléphone principal |
| email | VARCHAR(150) | NULL | Email optionnel |
| adresse | TEXT | NULL | Adresse physique |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `type_vetements` (Référentiel)
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| nom | VARCHAR(100) | NOT NULL | Ex: Chemise, Pantalon, Robe |
| prix_defaut | DECIMAL(10,2) | NOT NULL | Prix unitaire par défaut |
| ordre_priorite | INT | NOT NULL | Ordre de traitement dans les lots |
| actif | BOOLEAN | DEFAULT true | Activer/désactiver |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `commandes`
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| numero | VARCHAR(30) | UNIQUE, NOT NULL | Format: EP-YYYYMMDD-XXX |
| client_id | BIGINT | FK clients.id | Client concerné |
| user_id | BIGINT | FK users.id | Employé qui a enregistré |
| date_depot | DATE | NOT NULL | Date de dépôt des vêtements |
| date_lavage_prevue | DATE | NOT NULL | J+1 par défaut |
| date_sortie_prevue | DATE | NOT NULL | J+3 par défaut |
| date_retrait | DATE | NULL | Rempli à la remise (UC7) |
| statut | ENUM | NOT NULL | `recu`, `en_lavage`, `lave`, `en_repassage`, `repasse`, `pret`, `retire` |
| statut_paiement | ENUM | NOT NULL | `non_paye`, `partiel`, `paye` |
| montant_total | DECIMAL(10,2) | NOT NULL | Somme des lignes vêtements |
| montant_verse | DECIMAL(10,2) | DEFAULT 0 | Somme des paiements reçus |
| notes | TEXT | NULL | Instructions spéciales |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `commande_vetements` (Lignes de commande)
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| commande_id | BIGINT | FK commandes.id | Commande parente |
| type_vetement_id | BIGINT | FK type_vetements.id | Type de vêtement |
| code | VARCHAR(30) | UNIQUE, NOT NULL | Code individuel de l'article — format : EP-YYYYMMDD-XXX-CHM-01 |
| quantite | INT | NOT NULL, MIN 1 | Nombre de pièces |
| prix_unitaire | DECIMAL(10,2) | NOT NULL | Prix au moment de la commande |
| couleur | VARCHAR(50) | NULL | Couleur du vêtement — Ex : Blanc, Bleu marine |
| marque | VARCHAR(100) | NULL | Marque du vêtement — Ex : Lacoste, Hugo Boss |
| statut | ENUM | NOT NULL | `recu`, `en_lavage`, `lave`, `en_repassage`, `repasse`, `pret`, `retire` |
| notes | TEXT | NULL | Ex: tache à droite |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `lots`
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| type | ENUM | NOT NULL | `lavage` / `repassage` |
| date_prevue | DATE | NOT NULL | Date planifiée du traitement |
| date_traitee | DATE | NULL | Date réelle de traitement |
| statut | ENUM | NOT NULL | `planifie`, `en_cours`, `termine`, `reporte` |
| motif_report | TEXT | NULL | Rempli si reporté |
| user_id | BIGINT | FK users.id | Employé responsable |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

### Table : `lot_commande_vetements` (Pivot lot ↔ lignes)
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| lot_id | BIGINT | FK lots.id | Lot concerné |
| commande_vetement_id | BIGINT | FK commande_vetements.id | Ligne de vêtement |
| created_at | TIMESTAMP | — | — |

---

### Table : `paiements`
| Colonne | Type | Contraintes | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant |
| commande_id | BIGINT | FK commandes.id | Commande concernée |
| user_id | BIGINT | FK users.id | Employé qui enregistre |
| montant | DECIMAL(10,2) | NOT NULL | Montant du versement |
| mode_paiement | ENUM | NOT NULL | `especes`, `mobile_money`, `carte` |
| reference | VARCHAR(100) | NULL | N° transaction (Mobile Money) |
| date_paiement | DATE | NOT NULL | Date du versement |
| created_at | TIMESTAMP | — | — |
| updated_at | TIMESTAMP | — | — |

---

## 2. Relations

```
users ──────────────────┬── commandes (user_id)
                        └── lots (user_id)
                        └── paiements (user_id)

clients ─────────────────── commandes (client_id)

commandes ───────────────── commande_vetements (commande_id)
                        └── paiements (commande_id)

commande_vetements ──────── lot_commande_vetements (commande_vetement_id)
lots ────────────────────── lot_commande_vetements (lot_id)

type_vetements ──────────── commande_vetements (type_vetement_id)
```

## 3. Format du Numéro de Commande

`EP-YYYYMMDD-XXX`
- `EP` = Élégance Pressing
- `YYYYMMDD` = date du dépôt
- `XXX` = séquence du jour (001, 002…)

**Exemple** : `EP-20260413-001`

## 4. Règles de Calcul

### Montant total commande
```
montant_total = Σ (quantite × prix_unitaire) pour chaque ligne vêtement
```

### Statut paiement (calculé automatiquement)
```
montant_verse = 0              → non_paye
0 < montant_verse < total      → partiel
montant_verse >= montant_total → paye
```

### Statut commande (progression automatique)
```
Tous les vetements = lave      → commande = lave
Tous les vetements = repasse   → commande = repasse
UC5 validé                     → commande = pret
UC7 validé                     → commande = retire
```
