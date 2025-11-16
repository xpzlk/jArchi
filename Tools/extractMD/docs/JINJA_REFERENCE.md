# Référence Jinja - Syntaxe pour Templates MD

Ce document décrit la syntaxe Jinja utilisée dans les templates Markdown pour le script de rendu.

> **Note**: Cette implémentation est inspirée de Jinja mais simplifiée pour l'environnement jArchi/Nashorn.

## Délimiteurs

- **Variables**: `{{ variable }}` - Insère la valeur d'une variable
- **Instructions**: `{% instruction %}` - Boucles, conditionnelles, etc.
- **Commentaires**: `{# commentaire #}` - Ignoré lors du rendu

## Contrôle des espaces blancs

Utilisez `-` pour supprimer les espaces et retours à la ligne autour des balises :

- `{%-` - Supprime les espaces **avant** la balise
- `-%}` - Supprime les espaces **après** la balise

**Exemples** :

```jinja
{# Sans contrôle des espaces - génère des lignes vides #}
{% for item in items %}
- {{ item.name }}
{% endfor %}

{# Avec contrôle des espaces - pas de lignes vides #}
{% for item in items -%}
- {{ item.name }}
{% endfor -%}
```

**Utilisation dans les tableaux** (important !) :

```jinja
| Colonne1 | Colonne2 |
|----------|----------|
{% for item in items -%}
| {{ item.name }} | {{ item.value }} |
{% endfor -%}
```

Sans le `-%}`, chaque ligne du tableau serait séparée par une ligne vide, cassant le tableau Markdown.

## 1. Variables

### Syntaxe de base

```jinja
{{ view.name }}
{{ element.type }}
{{ element.properties.Statut }}
```

### Accès aux propriétés

```jinja
{{ element.name }}                    # Propriété simple
{{ element.concept.type }}            # Propriété imbriquée
{{ element.properties.MaPropriété }}  # Propriété personnalisée ArchiMate
```

### Valeurs manquantes

Si une variable ou propriété n'existe pas :
- La valeur est remplacée par une chaîne vide `""`
- Un warning orange est affiché dans la console

## 2. Boucles (for)

### Syntaxe de base

```jinja
{% for element in elements %}
- {{ element.name }}
{% endfor %}
```

### Accès à l'index

```jinja
{% for element in elements %}
{{ loop.index }}. {{ element.name }}  {# Index commence à 1 #}
{% endfor %}
```

### Variables de boucle disponibles

- `loop.index` - Itération courante (commence à 1)
- `loop.index0` - Itération courante (commence à 0)
- `loop.first` - True si premier élément
- `loop.last` - True si dernier élément
- `loop.length` - Nombre total d'éléments

### Boucles imbriquées

```jinja
{% for element in elements %}
## {{ element.name }}

{% for child in element.visualChildren %}
  - {{ child.name }}
{% endfor %}
{% endfor %}
```

## 3. Conditionnelles (if)

### Syntaxe de base

```jinja
{% if element.documentation %}
**Documentation**: {{ element.documentation }}
{% endif %}
```

### If-else

```jinja
{% if element.isGroup %}
**Type**: Groupe
{% else %}
**Type**: Élément
{% endif %}
```

### If-elif-else

```jinja
{% if element.type == "business-capability" %}
Type: Capacité métier
{% elif element.type == "business-process" %}
Type: Processus métier
{% else %}
Type: Autre ({{ element.type }})
{% endif %}
```

### Opérateurs de comparaison

- `==` - Égal
- `!=` - Différent
- `<`, `>`, `<=`, `>=` - Comparaisons numériques
- `in` - Appartenance (ex: `"text" in element.name`)

### Opérateurs logiques

- `and` - ET logique
- `or` - OU logique
- `not` - NON logique

```jinja
{% if element.isElement and element.concept %}
Ceci est un élément ArchiMate
{% endif %}
```

## 4. Filtres

Les filtres transforment les valeurs. Syntaxe : `{{ variable|filtre }}`

### Filtres de base

```jinja
{{ element.name|upper }}           # MAJUSCULES
{{ element.name|lower }}           # minuscules
{{ element.name|capitalize }}      # Première lettre en majuscule
{{ element.name|title }}           # Chaque Mot En Majuscule
```

### Filtres pour listes

```jinja
{{ elements|length }}              # Nombre d'éléments
{{ elements|first }}               # Premier élément
{{ elements|last }}                # Dernier élément
```

### Filtres avec paramètres

```jinja
{{ element.documentation|default("Pas de documentation") }}
{{ element.name|replace("old", "new") }}
```

### Chaînage de filtres

```jinja
{{ element.name|lower|replace(" ", "_") }}
```

## 5. Tests

Les tests vérifient une condition. Syntaxe : `variable is test`

```jinja
{% if element.visualChildren is defined %}
Cet élément a des enfants
{% endif %}

{% if element.documentation is not empty %}
{{ element.documentation }}
{% endif %}
```

Tests disponibles :
- `defined` - Variable existe
- `empty` - Chaîne vide, liste vide, ou null
- `even` - Nombre pair
- `odd` - Nombre impair

## 6. Structure des données viewExtractor

### Objet racine : viewData

```javascript
{
  view: { ... },           // Métadonnées de la vue
  elements: [ ... ],       // Tous les éléments visuels
  relationships: [ ... ],  // Toutes les relations
  visualContainment: [ ... ]  // Relations de containment
}
```

### view (métadonnées)

```jinja
{{ view.id }}              # ID de la vue
{{ view.name }}            # Nom de la vue
{{ view.documentation }}   # Documentation
{{ view.type }}            # Type de vue
{{ view.properties.XXX }}  # Propriété personnalisée
```

### viewImagePath (chemin image de la vue)

Le renderer exporte automatiquement une image PNG de la vue :

```jinja
{% if viewImagePath -%}
![Diagramme de la vue]({{ viewImagePath }})
{% endif -%}
```

**Caractéristiques** :
- Format : PNG
- Marge : 10 pixels
- Échelle : 100%
- Nom : Même nom que le fichier MD avec extension `.png`
- Emplacement : Même répertoire que le fichier MD

**Exemple** : Si le MD est `output/mon_rapport.md`, l'image sera `output/mon_rapport.png` et `viewImagePath` vaudra `"mon_rapport.png"`

### elements (tableau)

Chaque élément contient :

```jinja
{{ element.id }}                    # ID unique
{{ element.type }}                  # Type (ex: "business-capability")
{{ element.name }}                  # Nom affiché
{{ element.documentation }}         # Documentation

{{ element.isGroup }}               # true si groupe
{{ element.isNote }}                # true si note
{{ element.isElement }}             # true si élément ArchiMate

{{ element.bounds.x }}              # Position X
{{ element.bounds.y }}              # Position Y
{{ element.bounds.width }}          # Largeur
{{ element.bounds.height }}         # Hauteur

{{ element.style.fillColor }}       # Couleur de fond
{{ element.style.fontColor }}       # Couleur du texte

{{ element.properties.XXX }}        # Propriété personnalisée

{{ element.visualParentId }}        # ID du parent visuel
{{ element.visualChildren }}        # Tableau des enfants visuels

{{ element.concept.id }}            # ID du concept ArchiMate (si isElement)
{{ element.concept.type }}          # Type du concept
{{ element.concept.name }}          # Nom du concept
```

### relationships (tableau)

Chaque relation contient :

```jinja
{{ relationship.id }}
{{ relationship.type }}             # Type de relation
{{ relationship.name }}
{{ relationship.documentation }}

{{ relationship.sourceId }}         # ID de la source
{{ relationship.targetId }}         # ID de la cible
{{ relationship.source.name }}      # Nom de l'élément source
{{ relationship.target.name }}      # Nom de l'élément cible

{{ relationship.properties.XXX }}   # Propriété personnalisée
```

### visualContainment (tableau)

```jinja
{{ containment.type }}              # "visual-containment"
{{ containment.source }}            # ID du parent
{{ containment.target }}            # ID de l'enfant
{{ containment.sourceElement.name }}
{{ containment.targetElement.name }}
```

## 7. Exemples complets

### Liste simple

```jinja
# {{ view.name }}

{{ view.documentation }}

## Éléments ({{ elements|length }} total)

{% for element in elements %}
{{ loop.index }}. **{{ element.name }}** ({{ element.type }})
{% endfor %}
```

### Groupes et capacités

```jinja
# {{ view.name }}

{% for element in elements %}
{% if element.isGroup %}
## {{ element.name }}

{{ element.documentation }}

### Capacités du groupe

{% for child in element.visualChildren %}
{% if child.type == "business-capability" %}
- **{{ child.name }}**: {{ child.documentation }}
  - Statut: {{ child.properties.Statut|default("Non défini") }}
{% endif %}
{% endfor %}

{% endif %}
{% endfor %}
```

### Tableau avec relations

```jinja
# {{ view.name }}

## Relations

| Source | Type | Cible |
|--------|------|-------|
{% for rel in relationships %}
| {{ rel.source.name }} | {{ rel.type }} | {{ rel.target.name }} |
{% endfor %}
```

### Hiérarchie conditionnelle

```jinja
{% for element in elements %}
{% if not element.visualParentId %}
{# Élément racine #}
## {{ element.name }}

{% if element.visualChildren|length > 0 %}
**Contient {{ element.visualChildren|length }} éléments:**

{% for child in element.visualChildren %}
- {{ child.name }}
{% endfor %}
{% endif %}

{% endif %}
{% endfor %}
```

## 8. Bonnes pratiques

1. **Échappement Markdown**: Les caractères spéciaux (`|`, `*`, etc.) dans les valeurs seront automatiquement échappés dans les tableaux
2. **Retours à la ligne**: Dans les tableaux, les retours à la ligne seront convertis en `<br>`
3. **Indentation**: L'indentation dans le template est préservée (attention aux espaces)
4. **Performance**: Évitez les boucles trop profondes (max 3 niveaux recommandé)

## 9. Gestion des erreurs

### Warnings (console orange)

- Variable inexistante : `{{ element.proprieteInexistante }}`
- Propriété manquante : `{{ element.properties.ProprieteAbsente }}`
- Filtre avec mauvais type : `{{ "texte"|length }}` sur une chaîne

### Erreurs (arrêt du script)

- Template mal formé : balises non fermées `{% for ... }` sans `{% endfor %}`
- Syntaxe invalide : `{% if element.name = "test" %}` (utiliser `==`)
- Balises imbriquées incorrectement
