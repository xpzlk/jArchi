# WHERE Conditions - Guide d'utilisation

## Syntaxe de base

Les conditions WHERE permettent de filtrer les éléments dans les boucles `{{#each}}`.

```markdown
{{#each COLLECTION where CONDITION}}
  ... contenu ...
{{/each COLLECTION}}
```

## Opérateurs supportés

### 1. Égalité (`=`)

Teste si un champ est égal à une valeur.

```markdown
{{#each capabilities where type="capability"}}
- {{capability.name}}
{{/each capabilities}}
```

```markdown
{{#each technologyFunctions where properties.Owner="Jean Dupont"}}
- {{technologyFunction.name}}
{{/each technologyFunctions}}
```

### 2. Différent (`!=`)

Teste si un champ est différent d'une valeur.

```markdown
{{#each capabilities where properties.Status!="Deprecated"}}
- {{capability.name}}
{{/each capabilities}}
```

### 3. Contient (`contains`)

Teste si un champ contient une sous-chaîne.

```markdown
{{#each capabilities where name contains "Finance"}}
- {{capability.name}}
{{/each capabilities}}
```

```markdown
{{#each services where properties.Description contains "API"}}
- {{service.name}}
{{/each services}}
```

### 4. Existe (`exists`)

Teste si un champ existe et n'est pas vide.

```markdown
{{#each capabilities where properties.SLA exists}}
- {{capability.name}} (SLA: {{capability.properties.SLA}})
{{/each capabilities}}
```

### 5. N'existe pas (`not exists`)

Teste si un champ n'existe pas ou est vide.

```markdown
{{#each capabilities where properties.Replacement not exists}}
- {{capability.name}} (pas de remplacement prévu)
{{/each capabilities}}
```

## Prédicats logiques

### AND - Tous les critères doivent être vrais

```markdown
{{#each capabilities where type="capability" AND properties.Status="Active"}}
- {{capability.name}}
{{/each capabilities}}
```

```markdown
{{#each technologyFunctions where specialization="Application Function" AND properties.Owner exists AND name contains "Core"}}
### {{technologyFunction.name}}
Propriétaire: {{technologyFunction.properties.Owner}}
{{/each technologyFunctions}}
```

### OR - Au moins un critère doit être vrai

```markdown
{{#each capabilities where properties.Status="In Progress" OR properties.Status="Planned"}}
- {{capability.name}} ({{capability.properties.Status}})
{{/each capabilities}}
```

```markdown
{{#each services where properties.Criticality="High" OR properties.Criticality="Critical"}}
- {{service.name}} ⚠️
{{/each services}}
```

### Combinaison AND/OR

AND a la priorité sur OR. La condition `A AND B OR C` est évaluée comme `(A AND B) OR C`.

```markdown
{{#each capabilities where type="capability" AND properties.Status="Active" OR properties.Priority="High"}}
- {{capability.name}}
{{/each capabilities}}
```

Cette condition retourne :
- Les capabilities actives (`type="capability" AND Status="Active"`)
- OU les capabilities avec priorité haute (`Priority="High"`)

## Exemples complets

### Exemple 1 : Rapport des capacités en cours

```markdown
# Capacités en développement

{{#each capabilities where properties.Status="In Development"}}
## {{capability.name}}

**Description:** {{capability.documentation}}

**Propriétaire:** {{capability.properties.Owner}}

**Date de livraison prévue:** {{capability.properties.DeliveryDate}}

{{/each capabilities}}
```

### Exemple 2 : Services critiques avec SLA

```markdown
# Services critiques

{{#each services where properties.Criticality="High" AND properties.SLA exists}}
## {{service.name}}

- **Criticité:** {{service.properties.Criticality}}
- **SLA:** {{service.properties.SLA}}
- **Description:** {{service.documentation}}

{{/each services}}
```

### Exemple 3 : Fonctions applicatives par équipe

```markdown
# Fonctions applicatives - Équipe Finance

{{#each technologyFunctions where specialization="Application Function" AND properties.Team="Finance"}}
### {{technologyFunction.name}}

{{technologyFunction.documentation}}

**Services fournis:**
{{#each services}}
- {{service.name}}
{{/each services}}

{{/each technologyFunctions}}
```

### Exemple 4 : Éléments sans propriétaire

```markdown
# Éléments à assigner

## Capacités sans propriétaire
{{#each capabilities where properties.Owner not exists}}
- {{capability.name}}
{{/each capabilities}}

## Fonctions techniques sans propriétaire
{{#each technologyFunctions where properties.Owner not exists}}
- {{technologyFunction.name}}
{{/each technologyFunctions}}
```

### Exemple 5 : Filtrage par spécialisation

```markdown
# Architecture applicative

## Fonctions applicatives
{{#each technologyFunctions where specialization="Application Function"}}
### {{technologyFunction.name}}
{{technologyFunction.documentation}}
{{/each technologyFunctions}}

## Fonctions d'infrastructure
{{#each technologyFunctions where specialization="Infrastructure Function"}}
### {{technologyFunction.name}}
{{technologyFunction.documentation}}
{{/each technologyFunctions}}
```

### Exemple 6 : Conditions complexes

```markdown
# Éléments nécessitant attention

{{#each capabilities where properties.Status="At Risk" OR properties.Status="Blocked" AND properties.Priority="High"}}
## {{capability.name}} ⚠️

**Statut:** {{capability.properties.Status}}
**Priorité:** {{capability.properties.Priority}}
**Raison:** {{capability.properties.BlockageReason}}

{{/each capabilities}}
```

## Notes importantes

1. **Sensibilité à la casse:** Les noms de propriétés sont sensibles à la casse
2. **Guillemets obligatoires:** Les valeurs doivent être entre guillemets doubles `""`
3. **Espaces:** Les espaces autour des opérateurs sont optionnels mais recommandés pour la lisibilité
4. **Propriétés imbriquées:** Utilisez la notation à points pour accéder aux propriétés : `properties.NomPropriété`
5. **Priorité AND/OR:** AND a priorité sur OR (comme en SQL)

## Propriétés disponibles

Sur chaque élément, vous pouvez tester :

- `type` - Le type ArchiMate (ex: "capability", "goal", "technology-function")
- `specialization` - La spécialisation de l'élément (si définie)
- `name` - Le nom de l'élément
- `documentation` - La documentation de l'élément
- `properties.XXX` - N'importe quelle propriété personnalisée définie dans Archi
