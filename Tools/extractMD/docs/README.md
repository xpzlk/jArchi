# extractMD - Template Renderer pour ArchiMate

Moteur de rendu de templates Jinja-like pour générer de la documentation Markdown à partir de vues ArchiMate.

## Vue d'ensemble

Le script `extractMD.ajs` permet de générer automatiquement de la documentation Markdown en appliquant un template sur les données extraites d'une vue ArchiMate.

### Principe

```
Vue ArchiMate + Template Jinja → Fichier Markdown + Image PNG
```

## Installation

```javascript
load(__DIR__ + "Tools/extractMD/extractMD.ajs");
```

## Utilisation

### API Fonction

La fonction `extractViewToMarkdown()` prend 3 paramètres :

```javascript
var result = extractViewToMarkdown(view, outputDir, templatePath);
```

**Paramètres:**
- **`view`** *(object)* - Objet jArchi de la vue ArchiMate
- **`outputDir`** *(string)* - Répertoire de sortie (chemin absolu)
- **`templatePath`** *(string)* - Chemin du fichier template `.md` (absolu)

**Retour:**
```javascript
{
    success: true,
    markdownPath: "C:/path/to/output/nom_de_la_vue.md",
    imagePath: "C:/path/to/output/nom_de_la_vue.png",
    lineCount: 1234
}
```

### Génération automatique des noms

Le nom du fichier est automatiquement généré à partir du nom de la vue :

- Suppression des accents : `é` → `e`, `à` → `a`
- Remplacement des espaces par `_`
- Suppression des caractères spéciaux invalides
- Conservation de : `-`, `_`, `.`, `(`, `)`

**Exemples:**
- `"0. Capacités Transversales (détaillée)"` → `"0_Capacites_Transversales_detaillee.md"`
- `"Vue d'ensemble: Système"` → `"Vue_d_ensemble_Systeme.md"`

### Exemples

#### Exemple 1 - Vue unique

```javascript
load(__DIR__ + "Tools/extractMD/extractMD.ajs");

var view = $("view").filter(function(v) {
    return v.name === "0. Capacités Transversales Mutualisables (détaillée)";
}).first();

var result = extractViewToMarkdown(
    view,
    __DIR__ + "Tools/extractMD/output",
    __DIR__ + "Tools/extractMD/examples/simple_view.md"
);

if (result.success) {
    console.log("Generated: " + result.markdownPath);
}
```

#### Exemple 2 - Toutes les vues

```javascript
load(__DIR__ + "Tools/extractMD/extractMD.ajs");

var outputDir = __DIR__ + "Tools/extractMD/output";
var templatePath = __DIR__ + "Tools/extractMD/examples/simple_view.md";

$("view").each(function(view) {
    var result = extractViewToMarkdown(view, outputDir, templatePath);

    if (result.success) {
        console.log("✓ " + view.name);
    } else {
        console.log("✗ " + view.name + ": " + result.error);
    }
});
```

#### Exemple 3 - Templates conditionnels

```javascript
load(__DIR__ + "Tools/extractMD/extractMD.ajs");

var outputDir = __DIR__ + "Tools/extractMD/output";

$("view").each(function(view) {
    // Choisir template selon le contenu
    var hasCapabilities = $(view).find("element[type='business-capability']").size() > 0;

    var templatePath = hasCapabilities
        ? __DIR__ + "Tools/extractMD/examples/business_capabilities.md"
        : __DIR__ + "Tools/extractMD/examples/simple_view.md";

    extractViewToMarkdown(view, outputDir, templatePath);
});
```

Voir [example_usage.ajs](example_usage.ajs) pour plus d'exemples.

## Structure des données disponibles

Le template a accès à l'objet `viewData` fourni par `viewExtractor.ajs`:

```javascript
{
    view: {
        id, name, documentation, type, properties
    },
    elements: [
        {
            id, type, name, documentation,
            bounds, style, properties,
            isGroup, isNote, isElement,
            concept: { id, name, type, documentation, properties },
            visualParent, visualParentId,
            visualChildren, visualChildrenIds
        }
    ],
    relationships: [
        {
            id, type, name, documentation,
            source, target, sourceId, targetId,
            properties, concept
        }
    ],
    visualContainment: [
        {
            type, source, target,
            sourceElement, targetElement
        }
    ],
    viewImagePath: "nom_de_la_vue.png"  // Chemin relatif de l'image
}
```

## Syntaxe Jinja

### Variables

```jinja
{{ view.name }}
{{ element.type }}
{{ element.properties.Statut }}
```

### Boucles

```jinja
{% for element in elements %}
- {{ element.name }}
{% endfor %}

{# Variables de boucle #}
{{ loop.index }}    {# Index (1-based) #}
{{ loop.index0 }}   {# Index (0-based) #}
{{ loop.first }}    {# true si premier #}
{{ loop.last }}     {# true si dernier #}
{{ loop.length }}   {# Nombre total #}
```

### Conditionnels

```jinja
{% if element.documentation %}
  {{ element.documentation }}
{% elif element.type == "business-capability" %}
  Type: Capability
{% else %}
  No information
{% endif %}
```

### Filtres

```jinja
{{ element.name|upper }}
{{ element.name|lower }}
{{ elements|length }}
{{ element.properties.Statut|default("Non défini") }}
{{ text|escape }}
{{ items|join(", ") }}
```

**Filtres disponibles:**
- `upper`, `lower`, `capitalize`, `title`
- `length`, `first`, `last`
- `default(value)`, `replace(old, new)`, `trim`
- `escape`, `join(separator)`

### Tests

```jinja
{% if element.documentation is defined %}
{% if element.documentation is not empty %}
{% if loop.index is even %}
{% if loop.index is odd %}
```

### Accès par index

```jinja
{# Accès dynamique aux propriétés #}
{% for key in element.properties %}
- **{{ key }}**: {{ element.properties[key] }}
{% endfor %}

{# Accès aux tableaux #}
{{ items[0] }}
{{ items[loop.index0] }}
```

### Contrôle des espaces

**Important pour les tableaux Markdown !**

```jinja
{# ✅ Correct - pas de lignes vides #}
{% for item in items -%}
| {{ item.name }} | {{ item.value }} |
{% endfor -%}

{# ❌ Incorrect - lignes vides cassent le tableau #}
{% for item in items %}
| {{ item.name }} | {{ item.value }} |
{% endfor %}
```

## Templates d'exemple

### [simple_view.md](../examples/simple_view.md)
Template basique qui liste tous les éléments et relations d'une vue.

### [business_capabilities.md](../examples/business_capabilities.md)
Template pour documenter les capacités métier groupées avec leurs propriétés.

### [advanced_filtering.md](../examples/advanced_filtering.md)
Template avec filtrage par type et statistiques.

## Fichiers générés

Pour une vue nommée `"0. Capacités Transversales (détaillée)"`, le script génère :

```
output/
├── 0_Capacites_Transversales_detaillee.md
└── 0_Capacites_Transversales_detaillee.png
```

- **Fichier MD** : Documentation Markdown avec le contenu rendu
- **Fichier PNG** : Image de la vue (scale 2x, margin 10px)

## Validation

La fonction valide automatiquement :

- ✅ Vue fournie et avec un nom
- ✅ Répertoire de sortie existe (créé si nécessaire)
- ✅ Fichier template existe
- ✅ Template syntaxiquement correct

En cas d'erreur, retourne un objet avec `success: false` et `error: "message"`.

## Documentation complète

- **[SPECIFICATIONS.md](SPECIFICATIONS.md)** - Spécifications complètes
- **[JINJA_REFERENCE.md](JINJA_REFERENCE.md)** - Guide de référence Jinja
- **[USAGE.md](USAGE.md)** - Guide d'utilisation
- **[TABLEAUX_MARKDOWN.md](TABLEAUX_MARKDOWN.md)** - Guide tableaux Markdown
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Documentation technique
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions

## Architecture

```
extractMD/
├── extractMD.ajs              # Script principal (fonction exportable)
├── example_usage.ajs          # Exemples d'utilisation
├── lib/
│   ├── jinjaParser.ajs        # Lexer et parser
│   ├── jinjaRenderer.ajs      # Moteur de rendu
│   ├── jinjaFilters.ajs       # Filtres
│   └── jinjaTests.ajs         # Tests
├── examples/
│   ├── simple_view.md         # Template simple
│   ├── business_capabilities.md
│   └── advanced_filtering.md
├── docs/                      # Documentation
│   ├── README.md              # Ce fichier
│   ├── CHANGELOG.md
│   ├── SPECIFICATIONS.md
│   ├── JINJA_REFERENCE.md
│   ├── USAGE.md
│   ├── TABLEAUX_MARKDOWN.md
│   └── IMPLEMENTATION.md
└── output/                    # Fichiers générés
```

## Références

- **jArchi API**: https://github.com/archimatetool/archi-scripting-plugin/wiki
- **Jinja Documentation**: https://jinja.palletsprojects.com/
- **viewExtractor**: [../../library/viewExtractor.ajs](../../library/viewExtractor.ajs)
