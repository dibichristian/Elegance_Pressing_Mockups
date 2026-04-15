# Spécifications Fonctionnelles Détaillées
**Élégance Pressing** | Version 1.0 | 2026-04-13

---

## UC1 — Enregistrement d'une Commande

### Objectif
Créer une nouvelle commande pour un client.

### Déclencheur
Un client se présente au pressing pour déposer ses vêtements.

### Acteur
Employé

### Écran : Nouvelle Commande

**Bloc 1 — Client**
| Champ | Type | Règle |
|---|---|---|
| Recherche client | Texte (autocomplete) | Cherche par nom ou téléphone |
| Nom | Texte | Obligatoire si nouveau client |
| Prénom | Texte | Optionnel |
| Téléphone | Texte | Obligatoire, format +225XXXXXXXXXX |
| Email | Email | Optionnel |

**Bloc 2 — Vêtements**
| Champ | Type | Règle |
|---|---|---|
| Type de vêtement | Select | Liste des types configurés (chemise, pantalon, robe…) |
| Quantité | Nombre | Min 1 |
| Prix unitaire | Nombre | Auto-rempli d'après le type, modifiable |
| Couleur | Texte | Optionnel — Ex : Blanc, Bleu marine |
| Marque | Texte | Optionnel — Ex : Lacoste, Hugo Boss |
| Note | Texte | Optionnel — Ex : Tache col, Traitement délicat |
| Sous-total | Calculé | Quantité × Prix unitaire |
| Bouton "Ajouter" | Action | Ajoute une ligne vêtement |

**Bloc 3 — Dates & Récapitulatif**
| Champ | Type | Règle |
|---|---|---|
| Date de dépôt | Date | Auto = aujourd'hui |
| Date de lavage | Date | Auto = J+1, modifiable |
| Date de sortie | Date | Auto = J+3, modifiable |
| Total commande | Calculé | Somme des sous-totaux |
| Notes | Textarea | Optionnel (taches, instructions spéciales) |

### Actions
- **Valider** : crée la commande, génère un numéro (format : EP-YYYYMMDD-XXX), imprime un ticket/reçu
- **Annuler** : revient à la liste

### Résultat
- Commande créée avec statut `reçu`
- Ticket récapitulatif générable (impression)

---

## UC2 — Planification des Lots de Lavage

### Objectif
Organiser les vêtements à laver en lots par date et type.

### Acteur
Employé / Administrateur

### Écran : Planification des Lots

**Fonctionnement**
1. L'écran affiche les vêtements à planifier (statut = `reçu`, sans lot assigné)
2. Filtre par date de lavage prévue
3. Les vêtements sont regroupés par type
4. L'employé crée un lot et y assigne les vêtements

| Champ | Type | Règle |
|---|---|---|
| Date du lot | Date | Sélection obligatoire |
| Type(s) de vêtements | Multi-select | Optionnel (filtre) |
| Vêtements disponibles | Liste | Vêtements sans lot pour cette date |

### Actions
- **Créer lot** : génère un lot avec les vêtements sélectionnés
- **Assigner automatiquement** : crée les lots selon les règles de priorité

---

## UC3 — Traitement des Lots de Lavage

### Objectif
Valider le lavage d'un lot de vêtements.

### Acteur
Employé

### Écran : Traitement Lavage

1. Sélection du jour de traitement
2. Liste des lots planifiés pour ce jour (par type, par ordre de priorité)
3. Pour chaque lot :
   - Voir les vêtements inclus
   - Bouton **Démarrer** → statut lot = `en_cours`
   - Bouton **Valider** → statut lot = `terminé`, vêtements → `lavé`
   - Bouton **Reporter** → reporter au lendemain avec motif

| Champ/Action | Description |
|---|---|
| Sélecteur de date | Filtre les lots du jour |
| Liste des lots | Triée par priorité type |
| Vêtements dans le lot | Détail par commande / client |
| Reporter | Déplace le lot à J+1 avec saisie motif |

---

## UC4 — Traitement du Repassage

### Objectif
Valider le repassage des vêtements lavés.

### Acteur
Employé

### Écran : Traitement Repassage

Même logique qu'UC3 mais pour les vêtements au statut `lavé`.
1. Liste des vêtements lavés, triés par type
2. Création de lots de repassage
3. Validation → vêtements passent à `repassé`

---

## UC5 — Regroupement par Client

### Objectif
Reconstituer les vêtements repassés par commande et déclarer la commande prête.

### Acteur
Employé

### Écran : Regroupement Client

1. Liste des clients ayant des vêtements au statut `repassé`
2. Sélection d'un client
3. Affichage de tous ses vêtements repassés (par commande)
4. Vérification des quantités (cocher chaque article)
5. Validation → commande passe à `prêt`

| Champ | Description |
|---|---|
| Client | Sélection dans la liste |
| Commandes | Liste des commandes du client avec vêtements repassés |
| Checklist | Une ligne par article individuel, avec : badge code vêtement (ex: CHM-001), type, couleur, marque, note — une checkbox par article |
| Progression | Barre de progression et compteur (ex : 2 / 3 cochés) mis à jour en temps réel |
| Validation | Bouton "Marquer comme PRÊT" désactivé tant que toutes les cases ne sont pas cochées ; si tentative avec cases manquantes : alerte listant les codes non vérifiés |

---

## UC6 — Paiement

### Objectif
Enregistrer un versement pour une commande.

### Acteur
Employé

### Écran : Enregistrement Paiement

| Champ | Type | Règle |
|---|---|---|
| Commande | Référence | Sélection ou depuis la fiche commande |
| Montant total | Affichage | Calculé depuis les vêtements |
| Montant déjà versé | Affichage | Historique des paiements |
| Reste à payer | Calculé | Total - Versé |
| Montant versement | Nombre | ≤ Reste à payer |
| Mode de paiement | Select | Espèces / Mobile Money / Carte bancaire |
| Référence | Texte | Optionnel (n° transaction Mobile Money) |
| Date paiement | Date | Auto = aujourd'hui |

### Logique statut paiement
- Si versement = 0 → `non_payé`
- Si 0 < versement < total → `partiel`
- Si versement = total → `payé`

---

## UC7 — Remise des Vêtements

### Objectif
Remettre la commande au client et clore le cycle.

### Acteur
Employé

### Écran : Remise Commande

| Vérification | Règle |
|---|---|
| Statut commande | Doit être `prêt` — sinon bloqué avec message d'erreur |
| Statut paiement | Si `non_payé` ou `partiel` → avertissement (non bloquant avec confirmation) |

**Actions**
- **Confirmer la remise** → commande passe à `retiré`, date de retrait enregistrée
- **Enregistrer paiement** (raccourci) → redirige vers UC6 si paiement manquant

---

## Fonctionnalités Transversales

### Dashboard (Accueil)
Visible par Employé et Admin.

| Widget | Description |
|---|---|
| Commandes du jour | Nouvelles commandes enregistrées aujourd'hui |
| Lots en attente | Lots planifiés non encore traités |
| Commandes prêtes | Commandes au statut `prêt` à remettre |
| Alertes retards | Commandes dépassant leur date de sortie prévue |
| Chiffre du jour | Montant des paiements du jour |
| Graphique | Évolution hebdomadaire des commandes |

### Liste des Commandes
Filtres disponibles :
- Par statut
- Par date de dépôt
- Par client
- Par date de sortie prévue

Actions disponibles :
- Voir détail
- Enregistrer paiement
- Initier remise
- Imprimer ticket

### Administration (Admin uniquement)
- Gestion des types de vêtements (nom, prix, ordre de priorité)
- Gestion des utilisateurs (nom, email, rôle, mot de passe)
- Gestion des clients (liste, fiche, historique)
- Rapports (commandes par période, revenus, performance)
