# Changelog - extractMD

## Version 1.2 - 2025-11-15

### Refactorisation en fonction réutilisable

**Changements majeurs:**
- ✅ Transformation du script en fonction `extractViewToMarkdown(view, outputDir, templatePath)`
- ✅ Suppression des dialogues interactifs
- ✅ Génération automatique des noms de fichiers basée sur le nom de la vue
- ✅ Normalisation des noms de fichiers (suppression accents, caractères spéciaux)
- ✅ Validation robuste des paramètres
- ✅ Création automatique du répertoire de sortie si nécessaire
- ✅ Valeur de retour avec chemins générés et statut

**Nouvelle API:**
```javascript
var result = extractViewToMarkdown(view, outputDir, templatePath);
// Retourne:
// {
//     success: true,
//     markdownPath: "...",
//     imagePath: "...",
//     lineCount: 1234
// }
```

**Fonction de normalisation:**
- `sanitizeFileName(name)` - Normalise les noms de fichiers
- Remplace accents : `é` → `e`, `à` → `a`
- Remplace espaces : ` ` → `_`
- Supprime caractères invalides

**Exemples d'utilisation:**
- Fichier `example_usage.ajs` avec 4 exemples complets
- Extraction d'une vue unique
- Extraction de toutes les vues
- Templates conditionnels
- Répertoires multiples

**Fichiers modifiés:**
- `extractMD.ajs` - Refactorisation complète
- `README.md` - Documentation API mise à jour
- `example_usage.ajs` - Nouveau fichier d'exemples
- `CHANGELOG.md` - Création de ce fichier

**Migration:**

Avant (version interactive - non disponible):
```javascript
// Script exécuté directement avec dialogues
```

Après (v1.2 - fonction):
```javascript
load(__DIR__ + "Tools/extractMD/extractMD.ajs");

var view = $("view").first();
var result = extractViewToMarkdown(
    view,
    __DIR__ + "output",
    __DIR__ + "examples/simple_view.md"
);
```

---

## Version 1.1 - 2025-11-15

### Ajout de l'accès par index

**Nouvelles fonctionnalités:**
- ✅ Support de l'accès par index avec crochets `[]`
- ✅ Accès dynamique aux propriétés d'objets : `element.properties[key]`
- ✅ Accès aux éléments de tableaux : `items[0]`, `items[loop.index0]`

**Syntaxe supportée:**
```jinja
{# Accès dynamique aux propriétés #}
{% for key in element.properties %}
  {{ element.properties[key] }}
{% endfor %}

{# Accès aux tableaux #}
{{ items[0] }}
{{ items[loop.index0] }}
```

**Modifications techniques:**
- Ajout des tokens `LBRACKET` et `RBRACKET` dans le lexer
- Nouveau type de nœud AST `INDEX` dans le parser
- Fonction `evaluateIndex()` dans le renderer
- Support des index numériques et des clés de chaînes

**Fichiers modifiés:**
- `lib/jinjaParser.ajs` : Ajout du support des crochets dans le tokenizer et le parser
- `lib/jinjaRenderer.ajs` : Ajout de `evaluateIndex()` pour l'évaluation des accès par index
- `IMPLEMENTATION.md` : Documentation mise à jour

---

## Version 1.0 - 2025-11-15

### Version initiale

**Implémentation complète du moteur de templates Jinja pour jArchi:**

**Modules créés:**
- `lib/jinjaParser.ajs` - Lexer et parser complet
- `lib/jinjaRenderer.ajs` - Moteur de rendu
- `lib/jinjaFilters.ajs` - 12 filtres implémentés
- `lib/jinjaTests.ajs` - 4 tests implémentés
- `extractMD.ajs` - Script principal avec interface utilisateur

**Fonctionnalités:**
- ✅ Variables : `{{ variable }}`
- ✅ Boucles : `{% for item in items %}...{% endfor %}`
- ✅ Conditionnels : `{% if %}...{% elif %}...{% else %}...{% endif %}`
- ✅ Filtres : `{{ value|filter }}` avec chaînage
- ✅ Tests : `{% if value is test %}`
- ✅ Commentaires : `{# comment #}`
- ✅ Contrôle des espaces : `{%-` et `-%}`
- ✅ Itération sur objets (clés) et tableaux
- ✅ Variables de boucle (loop.index, loop.first, etc.)
- ✅ Export automatique PNG (2x scale)
- ✅ Gestion d'erreurs robuste

**Filtres implémentés:**
- upper, lower, capitalize, title
- length, first, last
- default, replace, trim
- escape, join

**Tests implémentés:**
- defined, empty
- even, odd

**Documentation:**
- README.md - Guide principal
- SPECIFICATIONS.md - Spécifications complètes
- JINJA_REFERENCE.md - Référence syntaxe Jinja
- USAGE.md - Guide d'utilisation
- TABLEAUX_MARKDOWN.md - Guide tableaux Markdown
- IMPLEMENTATION.md - Documentation technique

**Exemples:**
- examples/simple_view.md - Template basique
- examples/business_capabilities.md - Template avec groupes
- examples/advanced_filtering.md - Template avec filtrage

**Compatibilité:**
- Nashorn JavaScript (Java 8)
- Pas de dépendances ES6
- jArchi plugin pour Archi
