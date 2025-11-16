# Guide d'utilisation - Template Renderer

## Installation

Aucune installation nécessaire. Les fichiers sont déjà dans le dépôt jArchi.

## Prérequis

- **jArchi plugin** installé dans Archi
- **viewExtractor.ajs** présent dans `library/`

## Utilisation de base

### 1. Depuis un autre script

```javascript
// Charger le renderer
load(__DIR__ + "Tools/extractMD/templateRenderer.ajs");

// Sélectionner une vue
var view = selection.filter("archimate-diagram-model").first();

// Définir les chemins
var templatePath = __DIR__ + "templates/mon_template.md";
var outputPath = __DIR__ + "output/documentation.md";

// Générer la documentation
renderTemplate(view, templatePath, outputPath);
```

### 2. Script de test rapide

Un script de test est fourni : `testRenderer.ajs`

**Utilisation** :
1. Ouvrir Archi
2. Sélectionner une vue dans le modèle
3. Menu → Scripts → `Tools/extractMD/testRenderer.ajs`
4. Le fichier MD est généré dans `Tools/extractMD/output/`

## Créer un template

### Template minimal

```jinja
# {{ view.name }}

{% if viewImagePath -%}
![Diagramme]({{ viewImagePath }})
{% endif -%}

{{ view.documentation }}

## Éléments

{% for element in elements -%}
- {{ element.name }}
{% endfor -%}
```

### Template avec propriétés personnalisées

```jinja
# {{ view.name }}

## Capacités

| Nom | Description | Statut | Priorité |
|-----|-------------|--------|----------|
{% for element in elements %}
{% if element.type == "business-capability" %}
| {{ element.name }} | {{ element.documentation|default("N/A") }} | {{ element.properties.Statut|default("Non défini") }} | {{ element.properties.Priorité|default("N/A") }} |
{% endif %}
{% endfor %}
```

### Template avec groupes hiérarchiques

```jinja
# {{ view.name }}

{% for element in elements %}
{% if element.isGroup %}
## {{ element.name }}

{{ element.documentation }}

### Contenu du groupe

{% for child in element.visualChildren %}
- **{{ child.name }}**: {{ child.documentation }}
{% endfor %}

---
{% endif %}
{% endfor %}
```

## Syntaxe disponible

Voir [JINJA_REFERENCE.md](JINJA_REFERENCE.md) pour la référence complète.

### Variables
- `{{ view.name }}` - Nom de la vue
- `{{ element.name }}` - Nom d'un élément
- `{{ element.properties.MaPropriété }}` - Propriété personnalisée
- `{{ viewImagePath }}` - Chemin vers l'image PNG de la vue (exportée automatiquement)

### Boucles
```jinja
{% for element in elements -%}
  {{ element.name }}
{% endfor -%}
```

**Note importante** : Utilisez `-%}` pour supprimer les retours à la ligne après les balises, particulièrement important pour les tableaux !

Variables de boucle disponibles :
- `{{ loop.index }}` - Index (commence à 1)
- `{{ loop.index0 }}` - Index (commence à 0)
- `{{ loop.first }}` - true si premier élément
- `{{ loop.last }}` - true si dernier élément
- `{{ loop.length }}` - Nombre total d'éléments

### Contrôle des espaces blancs

Utilisez `-` pour éviter les lignes vides :
- `{%-` supprime espaces **avant** la balise
- `-%}` supprime espaces **après** la balise

**Essentiel pour les tableaux** :
```jinja
| Nom | Type |
|-----|------|
{% for element in elements -%}
| {{ element.name }} | {{ element.type }} |
{% endfor -%}
```

### Conditionnelles
```jinja
{% if element.documentation %}
  {{ element.documentation }}
{% elif element.type == "business-capability" %}
  Capacité métier
{% else %}
  Autre type
{% endif %}
```

### Filtres
```jinja
{{ element.name|upper }}
{{ element.name|lower }}
{{ elements|length }}
{{ element.properties.Statut|default("Non défini") }}
{{ element.name|replace(" ", "_") }}
```

### Tests
```jinja
{% if element.properties.Statut is defined %}
  Statut : {{ element.properties.Statut }}
{% endif %}

{% if element.documentation is not empty %}
  {{ element.documentation }}
{% endif %}
```

### Commentaires
```jinja
{# Ceci est un commentaire et ne sera pas rendu #}
```

## Structure des données disponibles

Dans vos templates, vous avez accès à :

### `view` - Métadonnées de la vue
- `view.id` - ID de la vue
- `view.name` - Nom de la vue
- `view.documentation` - Documentation
- `view.type` - Type de vue
- `view.properties.XXX` - Propriété personnalisée

### `elements` - Tableau de tous les éléments
Chaque élément contient :
- `element.id` - ID unique
- `element.name` - Nom
- `element.type` - Type (ex: "business-capability")
- `element.documentation` - Documentation
- `element.isGroup` - true si groupe visuel
- `element.isNote` - true si note
- `element.isElement` - true si élément ArchiMate
- `element.properties.XXX` - Propriété personnalisée
- `element.visualChildren` - Tableau des enfants visuels
- `element.visualParentId` - ID du parent visuel
- `element.bounds.x`, `element.bounds.y` - Position
- `element.style.fillColor` - Couleur de fond

Si `element.isElement` est true :
- `element.concept.id` - ID du concept ArchiMate
- `element.concept.name` - Nom du concept
- `element.concept.type` - Type du concept
- `element.concept.properties.XXX` - Propriétés du concept

### `relationships` - Tableau des relations
Chaque relation contient :
- `relationship.id` - ID
- `relationship.name` - Nom
- `relationship.type` - Type (ex: "serving-relationship")
- `relationship.documentation` - Documentation
- `relationship.source` - Objet élément source
- `relationship.target` - Objet élément cible
- `relationship.source.name` - Nom de la source
- `relationship.target.name` - Nom de la cible
- `relationship.properties.XXX` - Propriété personnalisée

### `visualContainment` - Relations de containment
- `containment.source` - ID du parent
- `containment.target` - ID de l'enfant
- `containment.sourceElement` - Objet parent
- `containment.targetElement` - Objet enfant

## Exemples fournis

Trois exemples de templates sont disponibles dans `examples/` :

1. **[simple_view.md](examples/simple_view.md)** - Template basique
   - Liste tous les éléments
   - Affiche les relations
   - Montre la hiérarchie visuelle

2. **[business_capabilities.md](examples/business_capabilities.md)** - Capacités métier
   - Groupes avec leurs capacités
   - Propriétés personnalisées (Statut, Priorité)
   - Tableaux formatés

3. **[advanced_filtering.md](examples/advanced_filtering.md)** - Filtrage avancé
   - Filtrage par type d'élément
   - Relations groupées par type
   - Statistiques

## Gestion des erreurs

### Warnings (non bloquants)
Affichés en **orange** dans la console :
- Variable inexistante → remplacée par chaîne vide
- Propriété manquante → remplacée par chaîne vide

```
[WARNING] Property not found: element.properties.ProprieteInexistante (line 15)
```

### Erreurs (bloquantes)
Affichées en **rouge** et arrêtent le script :
- Template mal formé
- Fichier template introuvable
- Erreur d'écriture

```
[ERROR] Template syntax error at line 42: Missing {% endfor %} for {% for %}
```

## Cas d'usage courants

### 1. Documentation de capacités métier

```javascript
load(__DIR__ + "Tools/extractMD/templateRenderer.ajs");

var capacityView = $("view").filter(function(v) {
    return v.name.indexOf("Capacités") !== -1;
}).first();

renderTemplate(
    capacityView,
    __DIR__ + "templates/business_capabilities.md",
    __DIR__ + "docs/capacites_metier.md"
);
```

### 2. Génération de documentation pour toutes les vues

```javascript
load(__DIR__ + "Tools/extractMD/templateRenderer.ajs");

var views = $("view");
var templatePath = __DIR__ + "templates/standard.md";

views.each(function(view) {
    var safeName = view.name.replace(/[^a-zA-Z0-9]/g, "_");
    var outputPath = __DIR__ + "docs/views/" + safeName + ".md";

    try {
        renderTemplate(view, templatePath, outputPath);
        console.log("✓ " + view.name);
    } catch (e) {
        console.log("✗ " + view.name + ": " + e.message);
    }
});
```

### 3. Rapport de processus métier

```javascript
load(__DIR__ + "Tools/extractMD/templateRenderer.ajs");

var processView = selection.filter("archimate-diagram-model").first();

var template = __DIR__ + "templates/process_report.md";
var output = __DIR__ + "reports/process_" + new Date().getTime() + ".md";

renderTemplate(processView, template, output);
```

## Conseils et bonnes pratiques

### 1. Tester progressivement
Commencez avec un template simple et ajoutez des fonctionnalités progressivement :
1. Variables simples
2. Boucles simples
3. Conditionnelles
4. Filtres

### 2. Vérifier les propriétés
Utilisez le filtre `default` pour les propriétés optionnelles :
```jinja
{{ element.properties.Statut|default("Non défini") }}
```

### 3. Utiliser les tests
Vérifiez l'existence avant d'accéder :
```jinja
{% if element.properties.Statut is defined %}
  Statut : {{ element.properties.Statut }}
{% endif %}
```

### 4. ⚠️ Tableaux Markdown - Règles essentielles

**Les tableaux sont sensibles au formatage !** Suivez ces règles :

#### ✅ TOUJOURS utiliser `-%}` dans les boucles
```jinja
| Colonne1 | Colonne2 |
|----------|----------|
{% for item in items -%}
| {{ item.name }} | {{ item.value }} |
{% endfor -%}
```

#### ✅ Remplacer les retours à la ligne par `<br>`
```jinja
{% for item in items -%}
| {{ item.name }} | {{ item.documentation|replace("\n", "<br>") }} |
{% endfor -%}
```

#### ✅ Échapper le caractère pipe `|`
```jinja
{% for item in items -%}
| {{ item.name|escape }} | {{ item.value|escape }} |
{% endfor -%}
```

#### ❌ Ne PAS faire
```jinja
{# ❌ Sans -%} : génère des lignes vides #}
{% for item in items %}
| {{ item.name }} | {{ item.value }} |
{% endfor %}

{# ❌ Retours à la ligne dans les cellules #}
| {{ item.multilineText }} |

{# ❌ Pipe non échappé #}
| {{ item.nameWithPipe }} |
```

### 5. Debugging
Activez la console jArchi pour voir les warnings :
- Menu → Window → Show Console

## Limites connues

1. **Boucles imbriquées** : Limitez à 3 niveaux maximum pour la lisibilité
2. **Performances** : Optimisé pour vues jusqu'à 500 éléments
3. **Filtres** : Sous-ensemble de Jinja (pas tous les filtres Jinja)
4. **Syntaxe** : Pas de macros, includes, ou set (futures extensions possibles)

## Support

Pour des questions ou problèmes :
1. Consultez [JINJA_REFERENCE.md](JINJA_REFERENCE.md)
2. Consultez [SPECIFICATIONS.md](SPECIFICATIONS.md)
3. Examinez les exemples dans `examples/`
4. Vérifiez les messages dans la console jArchi

## Extensions futures possibles

- Macros réutilisables
- Include de templates
- Définition de variables avec `{% set %}`
- Filtres personnalisés
- Export vers d'autres formats (HTML, Word)
