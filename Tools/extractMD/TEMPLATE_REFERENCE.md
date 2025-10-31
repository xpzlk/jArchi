# Template Reference Guide

Ce document décrit toutes les variables et syntaxes disponibles pour créer des templates Markdown.

## Syntaxe de base

### Variables simples

Utilisez `{{variable}}` pour insérer une valeur :

```markdown
# {{view.name}}
{{view.documentation}}
```

### Boucles

Utilisez `{{#each collection}}...{{/each collection}}` pour boucler sur une collection :

```markdown
{{#each groups}}
## {{group.name}}
{{/each groups}}
```

**Important**:
- Les balises de fermeture doivent être **nommées** : `{{/each groups}}` (pas juste `{{/each}}`)
- À l'intérieur d'une boucle, utilisez le nom au singulier pour accéder aux propriétés :
  - `{{#each groups}}` → utilisez `{{group.xxx}}`
  - `{{#each capabilities}}` → utilisez `{{capability.xxx}}`
  - `{{#each goals}}` → utilisez `{{goal.xxx}}`

### Boucles imbriquées

Vous pouvez imbriquer des boucles avec des balises nommées :

```markdown
{{#each groups}}
## {{group.name}}

{{#each capabilities}}
- {{capability.name}}: {{capability.documentation}}
{{/each capabilities}}

{{/each groups}}
```

## Variables disponibles

### Vue (view)

Informations sur la vue ArchiMate :

- `{{view.name}}` - Nom de la vue
- `{{view.documentation}}` - Documentation de la vue
- `{{view.type}}` - Type de la vue
- `{{view.image.png}}` - Insère l'image PNG de la vue (génère automatiquement `![nom](image.png)`)

### Groupes (groups)

Collection de tous les groupes de la vue avec leurs capacités :

```markdown
{{#each groups}}
- **{{group.name}}**: {{group.documentation}}
  - Nombre de capacités: {{group.capabilities.length}}
{{/each}}
```

**Propriétés d'un groupe:**
- `{{group.name}}` - Nom du groupe
- `{{group.documentation}}` - Documentation du groupe
- `{{group.capabilities}}` - Collection des capacités du groupe (utilisable avec `{{#each}}`)

**Exemple de tableau par groupe:**

```markdown
{{#each groups}}
## {{group.name}}

|Capacité|Intention|
|-|-|
{{#each capabilities}}
|{{capability.name}}|{{capability.documentation}}|
{{/each capabilities}}

{{/each groups}}
```

### Capacités (capabilities)

Collection de toutes les capacités de la vue (liste plate) :

```markdown
{{#each capabilities}}
- {{capability.name}} (groupe: {{capability.groupName}})
{{/each capabilities}}
```

**Propriétés d'une capacité:**
- `{{capability.name}}` - Nom de la capacité
- `{{capability.documentation}}` - Documentation de la capacité
- `{{capability.groupName}}` - Nom du groupe parent
- `{{capability.properties.XXX}}` - Propriété personnalisée (remplacer XXX par le nom de la propriété)

### Objectifs (goals)

Collection de tous les objectifs de la vue :

```markdown
{{#each goals}}
- {{goal.name}}: {{goal.documentation}}
{{/each goals}}
```

**Propriétés d'un objectif:**
- `{{goal.name}}` - Nom de l'objectif
- `{{goal.documentation}}` - Documentation de l'objectif
- `{{goal.properties.XXX}}` - Propriété personnalisée

### Fonctions techniques (technologyFunctions)

Collection de toutes les fonctions techniques avec leurs services :

```markdown
{{#each technologyFunctions}}
### {{technologyFunction.name}}

{{technologyFunction.documentation}}

**Services liés:**
{{#each services}}
- {{service.name}}
{{/each services}}

{{/each technologyFunctions}}
```

**Propriétés d'une fonction technique:**
- `{{technologyFunction.name}}` - Nom de la fonction
- `{{technologyFunction.documentation}}` - Documentation
- `{{technologyFunction.properties.XXX}}` - Propriété personnalisée
- `{{technologyFunction.services}}` - Collection des services liés

**Propriétés d'un service (dans la boucle services):**
- `{{service.name}}` - Nom du service
- `{{service.documentation}}` - Documentation du service
- `{{service.properties.XXX}}` - Propriété personnalisée

## Propriétés personnalisées

Toutes les propriétés ArchiMate personnalisées sont accessibles via `{{element.properties.NomPropriete}}` :

```markdown
{{#each capabilities}}
- {{capability.name}}
  - Statut: {{capability.properties.Statut}}
  - Priorité: {{capability.properties.Priorité}}
{{/each capabilities}}
```

## Formatage automatique

- Les caractères spéciaux Markdown (comme `|`) sont automatiquement échappés
- Dans les tableaux, les retours à la ligne sont convertis en `<br>` automatiquement
- Les valeurs vides sont remplacées par des chaînes vides

## Exemple de template complet

```markdown
# {{view.name}}

{{view.documentation}}

{{view.image.png}}

## Vue d'ensemble

{{#each groups}}
### {{group.name}}

{{group.documentation}}

|Capacité|Description|Statut|
|-|-|-|
{{#each capabilities}}
|{{capability.name}}|{{capability.documentation}}|{{capability.properties.Statut}}|
{{/each capabilities}}

{{/each groups}}

## Objectifs

{{#each goals}}
- **{{goal.name}}**: {{goal.documentation}}
{{/each goals}}
```

## Conseils

1. **Utilisez des noms explicites**: `{{group.name}}` est plus clair que `{{name}}`
2. **Testez progressivement**: Commencez simple et ajoutez des boucles au fur et à mesure
3. **Vérifiez les warnings**: Le moteur vous avertit des variables inconnues
4. **Propriétés personnalisées**: Vérifiez le nom exact de vos propriétés dans Archi avant de les utiliser
