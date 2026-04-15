# Flux Métier & Statuts — Élégance Pressing
Version : 1.0 | Date : 2026-04-13

---

## 1. Statuts d'une Commande

| Statut | Déclencheur | Acteur |
|---|---|---|
| `reçu` | Création de la commande | Employé |
| `en_lavage` | Lot de lavage démarré | Employé |
| `lavé` | Lot de lavage validé | Employé |
| `en_repassage` | Lot repassage démarré | Employé |
| `repassé` | Lot repassage validé | Employé |
| `prêt` | Regroupement client validé | Employé |
| `retiré` | Remise validée | Employé |

> La commande avance automatiquement quand **tous** ses vêtements ont changé de statut.

## 2. Statuts d'un Paiement

| Statut | Condition |
|---|---|
| `non_payé` | Aucun versement enregistré |
| `partiel` | Versement partiel (montant < total) |
| `payé` | Montant versé = montant total |

## 3. Statuts d'un Lot

| Statut | Description |
|---|---|
| `planifié` | Lot créé, pas encore commencé |
| `en_cours` | Traitement en cours |
| `terminé` | Tous les vêtements traités |
| `reporté` | Reporté à une autre date |

## 4. Diagramme de Flux Détaillé

```
╔══════════════════════════════════════════════════════════╗
║                    FLUX COMMANDE                          ║
╚══════════════════════════════════════════════════════════╝

DÉPÔT CLIENT
    │
    ▼
┌─────────────────────────────────────┐
│  UC1 — Enregistrement Commande      │
│  · Saisie client (nom / tél)        │
│  · Ajout vêtements (type + qté)     │
│  · Date lavage = J+1 (auto)         │
│  · Date sortie = J+3 (auto)         │
│  · Génération n° commande           │
│  → Statut commande : REÇU           │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  UC2 — Planification Lot Lavage     │
│  · Regrouper vêtements par date     │
│  · Trier par type (priorités)       │
│  · Créer lot de lavage              │
│  → Lot statut : PLANIFIÉ            │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  UC3 — Traitement Lavage            │
│  · Sélection du jour                │
│  · Traitement lot par lot/type      │
│  · Validation lot                   │
│  · Report possible si nécessaire    │
│  → Statut vêtements : LAVÉ          │
│  → Statut commande : LAVÉ           │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  UC4 — Traitement Repassage         │
│  · Récupérer vêtements lavés        │
│  · Trier par type                   │
│  · Valider repassage par lot        │
│  → Statut vêtements : REPASSÉ       │
│  → Statut commande : REPASSÉ        │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  UC5 — Regroupement Client          │
│  · Sélection client                 │
│  · Récupérer tous ses vêtements     │
│    repassés                         │
│  · Vérification quantités           │
│  · Validation si complet            │
│  → Statut commande : PRÊT           │
└─────────────────────────────────────┘
    │
    ├──────────────────────────────────┐
    │                                  ▼
    │                    ┌─────────────────────────┐
    │                    │  UC6 — Paiement          │
    │                    │  (à tout moment)         │
    │                    │  · Saisie montant        │
    │                    │  · Mode de paiement      │
    │                    │  → Statut : Non payé     │
    │                    │            / Partiel     │
    │                    │            / Payé        │
    │                    └─────────────────────────┘
    ▼
┌─────────────────────────────────────┐
│  UC7 — Remise Vêtements             │
│  · Vérif statut = PRÊT ✓            │
│  · Vérif paiement (alerte si 0)     │
│  · Signature / Confirmation         │
│  → Statut commande : RETIRÉ         │
└─────────────────────────────────────┘
    │
    ▼
 FIN DU CYCLE
```

## 5. Règles de Transition de Statut

### Règle 1 — Avancement automatique de commande
> La commande passe au statut suivant quand **100%** de ses vêtements ont atteint ce statut.

### Règle 2 — Blocage de remise
> La remise (UC7) est **impossible** si la commande n'est pas au statut `prêt`.
> Un avertissement est affiché si le paiement est `non_payé` ou `partiel`, mais la remise reste possible (avec confirmation).

### Règle 3 — Report de lot
> Si un lot ne peut pas être traité le jour J, il peut être reporté à J+1 sans perdre les données.

### Règle 4 — Vêtements dans plusieurs lots
> Un vêtement appartient à **un seul lot de lavage** et **un seul lot de repassage**.

### Règle 5 — Priorité des types
> L'ordre de traitement des types de vêtements dans un lot est configurable par l'administrateur depuis le dashboard.
