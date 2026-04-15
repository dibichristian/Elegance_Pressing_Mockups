# Règles de Gestion — Élégance Pressing
Version : 1.0 | Date : 2026-04-13

---

## RG01 — Dates automatiques à la création de commande

**Règle :**
- Date de lavage = date de dépôt + 1 jour ouvré
- Date de sortie = date de dépôt + 3 jours ouvrés

**Conditions :**
- Les dates calculées excluent le dimanche (jour de fermeture)
- Le samedi compte comme jour ouvré
- Les dates sont modifiables manuellement par l'employé

---

## RG02 — Numéro de commande unique

**Format :** `EP-YYYYMMDD-XXX`
- Généré automatiquement à la validation (UC1)
- `XXX` repart à `001` chaque nouveau jour
- Non modifiable après création

---

## RG03 — Avancement automatique du statut commande

**Règle :**
La commande avance de statut uniquement quand **tous** ses vêtements ont atteint le statut suivant.

```
Exemple : commande avec 3 chemises et 2 pantalons
→ Si 3 chemises = lavé mais 2 pantalons = reçu
→ statut commande reste : en_lavage (pas encore lavé)
→ Quand 2 pantalons = lavé aussi → commande → lavé
```

---

## RG04 — Blocage de remise

**Conditions de blocage (hard) :**
- Statut commande ≠ `prêt` → remise impossible + message d'erreur

**Conditions d'avertissement (soft) :**
- Statut paiement = `non_payé` → message d'alerte + demande de confirmation
- Statut paiement = `partiel` → message d'avertissement + demande de confirmation

**Règle :** La remise avec paiement incomplet est autorisée après confirmation explicite de l'employé (traçabilité).

---

## RG05 — Unicité lot pour un vêtement

**Règle :**
- Un article (ligne commande_vetement) ne peut appartenir qu'à **un seul lot de lavage** actif
- Un article ne peut appartenir qu'à **un seul lot de repassage** actif
- Si un lot est `reporté`, ses vêtements peuvent être réassignés à un nouveau lot

---

## RG06 — Calcul du statut de paiement

**Règle automatique (calculée à chaque nouveau versement) :**
```
montant_verse = Σ paiements.montant pour cette commande
restant = commande.montant_total - montant_verse

Si montant_verse = 0       → statut_paiement = non_paye
Si 0 < restant < total     → statut_paiement = partiel
Si restant = 0 (ou négatif)→ statut_paiement = paye
```

**Note :** Le total versé ne peut pas dépasser le montant total (validation côté application).

---

## RG07 — Priorité de traitement des lots

**Règle :**
L'ordre de traitement des types de vêtements dans un lot est défini par la colonne `ordre_priorite` de la table `type_vetements` (configurable par l'Admin).

**Par défaut (suggestion) :**
1. Chemises (délicates, nécessitent plus de soin)
2. Pantalons
3. Robes / Jupes
4. Vestes / Costumes
5. Linge de maison (draps, nappes…)

---

## RG08 — Report de lot

**Règle :**
- Un lot peut être reporté si son statut est `planifie` ou `en_cours`
- Le report déplace la date_prevue à J+1
- Un motif de report est obligatoire
- Le report est tracé (historique)
- Les vêtements du lot reporté conservent leur association avec le lot

---

## RG09 — Modification d'une commande

**Règle :**
- Une commande peut être modifiée (ajout/retrait de vêtements) uniquement si son statut est `reçu`
- Dès que la commande est en traitement (`en_lavage` ou plus), les modifications sont bloquées
- L'Admin peut forcer une modification avec justification

---

## RG10 — Calcul du montant total

**Règle :**
Le montant total est recalculé à chaque modification de ligne vêtement.
```
montant_total = Σ (ligne.quantite × ligne.prix_unitaire)
```
Le prix unitaire est capturé **au moment de la commande** (snapshot) pour éviter que les changements de tarifs affectent les commandes passées.

---

## RG11 — Gestion des clients

**Règle :**
- Un client est identifié de manière unique par son **numéro de téléphone**
- Si un client existant est détecté (même téléphone), il est rattaché automatiquement à la commande
- La création d'un doublon (même téléphone) est bloquée avec message d'erreur

---

## RG12 — Traçabilité

**Règle :**
- Chaque changement de statut (commande ou lot) est tracé avec : date, heure, utilisateur
- Les paiements enregistrent toujours l'employé responsable
- Les reports de lots enregistrent le motif et l'utilisateur
