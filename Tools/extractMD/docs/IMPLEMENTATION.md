# Implémentation du moteur de templates Jinja pour jArchi

## Vue d'ensemble

Cette implémentation fournit un moteur de templates complet inspiré de Jinja2 pour générer de la documentation Markdown à partir de vues ArchiMate dans Archi.

## Architecture

L'implémentation suit une architecture en couches classique pour un moteur de templates:

```
┌─────────────────────────────────────────┐
│         extractMD.ajs                   │  ← Script principal
│  (Interface utilisateur + orchestration)│
└────────────┬────────────────────────────┘
             │
             ├─► viewExtractor.ajs (bibliothèque externe)
             │   └─ Extraction des données de la vue
             │
             ├─► jinjaParser.ajs
             │   ├─ tokenize() → Tokens
             │   └─ parse() → AST
             │
             ├─► jinjaRenderer.ajs
             │   ├─ render() → String
             │   ├─ evaluateExpression()
             │   └─ renderNode()
             │
             ├─► jinjaFilters.ajs
             │   └─ applyFilter()
             │
             └─► jinjaTests.ajs
                 └─ applyTest()
```

## Modules implémentés

### 1. jinjaParser.ajs

**Responsabilité**: Analyse lexicale et syntaxique des templates

**Fonctions principales**:

- `tokenize(content)` - Découpe le template en tokens
  - Gère les délimiteurs: `{{ }}`, `{% %}`, `{# #}`
  - Détecte le contrôle des espaces (`{%-`, `-%}`)
  - Tokenise les expressions (variables, opérateurs, etc.)

- `tokenizeExpression(expr, line, col)` - Tokenise une expression
  - Chaînes de caractères (avec échappement)
  - Nombres
  - Identifiants et mots-clés
  - Opérateurs (`==`, `!=`, `and`, `or`, `in`, etc.)
  - Symboles (`.`, `|`, `,`, `(`, `)`)

- `parse(tokens)` - Construit l'AST à partir des tokens
  - Nœuds: ROOT, TEXT, VAR, FOR, IF, COMMENT
  - Validation de la syntaxe
  - Détection des erreurs (tags non fermés, etc.)

**Types de nœuds AST**:

```javascript
// Variable
{
    type: "VAR",
    expression: { ... },
    stripBefore: false,
    stripAfter: false
}

// Boucle for
{
    type: "FOR",
    loopVar: "item",
    iterable: { ... },
    body: [ ... ],
    stripBefore: false,
    stripAfter: false
}

// Conditionnel if
{
    type: "IF",
    branches: [
        { condition: { ... }, body: [ ... ] },  // if
        { condition: { ... }, body: [ ... ] },  // elif
        { condition: null, body: [ ... ] }       // else
    ],
    stripBefore: false,
    stripAfter: false
}

// Expression membre (ex: element.properties.Statut)
{
    type: "MEMBER",
    path: ["element", "properties", "Statut"]
}

// Filtre
{
    type: "FILTER",
    filterName: "upper",
    value: { ... },
    args: [ ... ]
}

// Test
{
    type: "TEST",
    testName: "defined",
    value: { ... },
    negate: false
}
```

### 2. jinjaFilters.ajs

**Responsabilité**: Implémentation des filtres Jinja

**Filtres implémentés**:

| Filtre | Description | Exemple |
|--------|-------------|---------|
| `upper` | Convertit en majuscules | `{{ name\|upper }}` |
| `lower` | Convertit en minuscules | `{{ name\|lower }}` |
| `capitalize` | Première lettre en majuscule | `{{ name\|capitalize }}` |
| `title` | Première lettre de chaque mot | `{{ name\|title }}` |
| `length` | Longueur d'un tableau/string | `{{ items\|length }}` |
| `first` | Premier élément | `{{ items\|first }}` |
| `last` | Dernier élément | `{{ items\|last }}` |
| `default(val)` | Valeur par défaut si vide | `{{ x\|default("N/A") }}` |
| `replace(old, new)` | Remplacement de texte | `{{ text\|replace(" ", "_") }}` |
| `trim` | Supprime espaces blancs | `{{ text\|trim }}` |
| `escape` | Échappe caractères MD | `{{ text\|escape }}` |
| `join(sep)` | Joint un tableau | `{{ items\|join(", ") }}` |

**Chaînage de filtres**:
```jinja
{{ element.name|lower|replace(" ", "-") }}
```

### 3. jinjaTests.ajs

**Responsabilité**: Implémentation des tests Jinja

**Tests implémentés**:

| Test | Description | Exemple |
|------|-------------|---------|
| `defined` | Variable existe | `{% if x is defined %}` |
| `empty` | Valeur vide | `{% if x is empty %}` |
| `even` | Nombre pair | `{% if loop.index is even %}` |
| `odd` | Nombre impair | `{% if loop.index is odd %}` |

**Négation**:
```jinja
{% if element.documentation is not empty %}
```

### 4. jinjaRenderer.ajs

**Responsabilité**: Rendu de l'AST avec les données

**Fonctions principales**:

- `render(ast, context)` - Point d'entrée principal
- `renderNode(node, context)` - Rendu d'un nœud
- `renderFor(node, context)` - Rendu d'une boucle
  - Support des tableaux
  - Support des objets (itération sur les clés)
  - Variables `loop.*` disponibles
- `renderIf(node, context)` - Rendu des conditionnels
- `evaluateExpression(expr, context)` - Évaluation d'expressions
- `resolveMember(path, context)` - Résolution de chemins (ex: `element.properties.Statut`)
- `evaluateIndex(expr, context)` - Accès par index (ex: `element.properties[key]`, `items[0]`)

**Variables de boucle**:

```javascript
loop.index    // Index (1-based)
loop.index0   // Index (0-based)
loop.first    // true si première itération
loop.last     // true si dernière itération
loop.length   // Nombre total d'éléments
```

**Opérateurs supportés**:

- Comparaison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logique: `and`, `or`, `not`
- Appartenance: `in`

### 5. extractMD.ajs

**Responsabilité**: Script principal avec interface utilisateur

**Workflow**:

1. Vérification de la sélection (vue ArchiMate)
2. Sélection du fichier template (dialog)
3. Sélection du fichier de sortie (dialog)
4. Extraction des données via `extractCompleteViewStructure(view)`
5. Ajout de `viewImagePath` au contexte
6. Lecture du template
7. Tokenisation et parsing
8. Rendu du template
9. Export de l'image PNG (scale 2x, margin 10px)
10. Écriture du fichier Markdown
11. Affichage du résumé

**Gestion d'erreurs**:

- Erreurs fatales → Exception avec stack trace
- Warnings → Console orange (variables manquantes)
- Messages formatés avec séparateurs visuels

## Fonctionnalités clés

### Contrôle des espaces blancs

Le contrôle des espaces est essentiel pour les tableaux Markdown.

**Syntaxe**:
- `{%-` - Supprime les espaces AVANT le tag
- `-%}` - Supprime les espaces APRÈS le tag

**Exemple**:
```jinja
{% for item in items -%}
| {{ item.name }} | {{ item.value }} |
{% endfor -%}
```

Sans `-%}`, des lignes vides apparaîtraient entre chaque ligne du tableau, cassant le rendu Markdown.

### Itération sur objets

Le moteur supporte l'itération sur les clés d'objets:

```jinja
{% for key in element.properties %}
- **{{ key }}**: {{ element.properties[key] }}
{% endfor %}
```

### Échappement Markdown

Le filtre `escape` protège les tableaux:
- Remplace `|` par `\|`
- Remplace `\n` par `<br>`

```jinja
| {{ element.name|escape }} | {{ element.documentation|escape }} |
```

### Accès par index

Support complet de l'accès par index avec crochets `[]`:

**Accès dynamique aux propriétés**:
```jinja
{% for key in element.properties %}
- **{{ key }}**: {{ element.properties[key] }}
{% endfor %}
```

**Accès aux tableaux**:
```jinja
{{ items[0] }}          {# Premier élément #}
{{ items[loop.index0] }} {# Élément courant dans une boucle #}
```

### Gestion des valeurs nulles

- Variables non trouvées → `""` + warning
- Tests `is defined` et `is empty` pour vérifier
- Filtre `default()` pour valeurs par défaut

## Compatibilité Nashorn

L'implémentation respecte les contraintes de Nashorn (Java 8):

✅ **Utilisé**:
- `var` (pas de `let`/`const`)
- Concaténation de chaînes (pas de template literals)
- Boucles `for` classiques (pas de `for...of`)
- `Array.isArray()`, `typeof`, `hasOwnProperty()`

❌ **Évité**:
- ES6+ features
- Arrow functions
- Template literals
- Destructuring
- `Array.find()`, `Array.includes()`

## Tests

Des exemples de templates sont fournis:

1. **[simple_view.md](examples/simple_view.md)** - Template basique
2. **[business_capabilities.md](examples/business_capabilities.md)** - Template avec groupes
3. **[advanced_filtering.md](examples/advanced_filtering.md)** - Filtrage par type

Un template de test minimal est également disponible: [test_template.md](test_template.md)

## Utilisation

```bash
1. Ouvrir Archi
2. Sélectionner une vue
3. Scripts → extractMD.ajs
4. Sélectionner un template
5. Choisir l'emplacement de sortie
6. Fichiers générés:
   - output.md (Markdown)
   - output.png (Image 2x)
```

## Limitations connues

1. **Pas de macros** - Les macros Jinja ne sont pas supportées
2. **Pas de include** - Pas d'inclusion de templates
3. **Pas de set** - Pas de création de variables dans le template
4. **Filtres limités** - Seulement les 12 filtres spécifiés

## Performance

- Optimisé pour vues avec jusqu'à 500 éléments
- Parsing en une seule passe
- Pas de cache de templates (chaque rendu parse le template)

## Maintenance future

### Améliorations possibles

1. **Cache de templates** - Parser une seule fois, réutiliser l'AST
2. **Plus de filtres** - `sort`, `reverse`, `unique`, etc.
3. **Macros** - Définir des blocs réutilisables
4. **Include** - Inclure d'autres templates
5. **Set** - Créer des variables dans le template
6. **Filtres personnalisés** - API pour enregistrer des filtres

### Bugs potentiels à surveiller

1. **Échappement de chaînes** - Vérifier tous les cas d'échappement
2. **Contextes imbriqués** - Boucles dans boucles dans conditionnels
3. **Whitespace control** - Edge cases avec texte vide
4. **Opérateur `in`** - Tester avec objets complexes
5. **Filtres chaînés** - Ordre d'exécution correct

## Références

- **Spécifications**: [SPECIFICATIONS.md](SPECIFICATIONS.md)
- **Référence Jinja**: [JINJA_REFERENCE.md](JINJA_REFERENCE.md)
- **Guide d'utilisation**: [USAGE.md](USAGE.md)
- **Tableaux Markdown**: [TABLEAUX_MARKDOWN.md](TABLEAUX_MARKDOWN.md)
- **viewExtractor**: [../../library/viewExtractor.ajs](../../library/viewExtractor.ajs)

## Auteur

Implémenté selon les spécifications fournies pour jArchi.

Date: 2025-11-15
