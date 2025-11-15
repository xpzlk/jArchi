# View Templates - Modern Template System

Un système de templates moderne pour générer de la documentation à partir de vues ArchiMate.

## 🚀 Utilisation

1. **Sélectionner une vue** dans Archi
2. **Exécuter** `viewTemplates.ajs`
3. **Choisir** un template parmi ceux disponibles
4. **Configurer** les options :
   - Déduplication des éléments (oui/non)
   - Tri par position (aucun, y-puis-x, x-puis-y)
5. **Sauvegarder** le fichier Markdown

**Sortie** : Fichier Markdown + Image PNG de la vue

## 📁 Structure

```
viewTemplates/
├── viewTemplates.ajs           # Script principal
├── lib/
│   ├── templateProcessor.ajs   # Moteur de templates
│   └── templateHelpers.ajs     # Fonctions utilitaires
├── templates/
│   ├── simple_list.md          # Liste simple
│   ├── detailed_report.md      # Rapport détaillé
│   └── filtered_view.md        # Vue filtrée (démo)
└── output/                     # Dossier de sortie (auto-créé)
```

## 📝 Syntaxe des templates (v2.0)

⚠️ **Version 2.0** - Breaking changes:
- Syntaxe `as variable` désormais **OBLIGATOIRE** pour les boucles
- Suppression de l'auto-singularisation
- Ajout des variables `loop.*` dans les boucles
- Support de `{{else}}` dans les conditions et boucles vides

### Variables simples
```markdown
{{view.name}}
{{element.documentation}}
```

### Boucles (syntaxe `as` obligatoire)
```markdown
{{#each elements as element}}
- {{element.name}}
{{/each}}
```

### Boucles imbriquées
```markdown
{{#each elements as element}}
### {{element.name}}
  {{#each element.visualChildren as child}}
  - {{child.name}}
  {{/each}}
{{/each}}
```

### Variables de boucle automatiques
```markdown
{{#each items as item}}
  Ligne {{loop.index}} sur {{loop.length}}
  {{#if loop.first}}**Premier élément**{{/if}}
  {{#if loop.last}}**Dernier élément**{{/if}}
{{/each}}
```

Variables disponibles dans une boucle:
- `loop.index` : Index 1-based (1, 2, 3...)
- `loop.index0` : Index 0-based (0, 1, 2...)
- `loop.first` : `true` si premier élément
- `loop.last` : `true` si dernier élément
- `loop.length` : Nombre total d'éléments

### Conditions avec else
```markdown
{{#if view.documentation}}
**Documentation:** {{view.documentation}}
{{else}}
Aucune documentation
{{/if}}

{{#if elements.length > 0}}
Total: {{elements.length}} éléments
{{/if}}
```

### Boucles avec else (collections vides)
```markdown
{{#each items as item}}
- {{item.name}}
{{else}}
Aucun élément trouvé
{{/each}}
```

### Filtres sur collections
```markdown
{{#each elements | filter:type="business-capability" as element}}
- {{element.name}}
{{/each}}

{{#each elements | sort:by="name" as element}}
- {{element.name}}
{{/each}}

{{#each elements | filter:isGroup="true" as element}}
- Group: {{element.name}}
{{/each}}
```

### Helpers sur variables
```markdown
{{element.name | uppercase}}
{{element.documentation | truncate:50}}
{{element.name | escape}}
{{element.name | default:"Sans nom"}}
```

## 📊 Structure des données disponibles

### Vue
```javascript
view: {
  id: "...",
  name: "...",
  documentation: "...",
  type: "archimate-diagram-model",
  imagePath: "view.png",
  properties: {...}
}
```

### Éléments
```javascript
elements: [
  {
    id: "...",
    type: "business-capability",
    name: "...",
    documentation: "...",

    // Classification
    isGroup: false,
    isNote: false,
    isElement: true,

    // Concept ArchiMate sous-jacent
    concept: {
      id: "...",
      type: "...",
      specialization: "..."
    },

    // Position et style
    bounds: { x: 100, y: 200, width: 120, height: 55 },
    style: {
      fillColor: "#b5ffff",
      fontColor: "#000000",
      lineColor: "#000000"
    },

    // Propriétés personnalisées
    properties: {
      "Status": "Active",
      "Complexité": "High"
    },

    // Hiérarchie visuelle
    visualParent: {...},
    visualParentId: "...",
    visualChildren: [...],
    visualChildrenIds: [...]
  }
]
```

### Relations
```javascript
relationships: [
  {
    id: "...",
    type: "composition-relationship",
    name: "...",
    documentation: "...",

    sourceId: "...",
    targetId: "...",
    source: {...},  // Référence à l'élément source
    target: {...},  // Référence à l'élément cible

    style: {...},
    properties: {...}
  }
]
```

### Containment visuel
```javascript
visualContainment: [
  {
    type: "visual-containment",
    source: "parent-id",
    target: "child-id",
    sourceElement: {...},
    targetElement: {...}
  }
]
```

### Collections par type
```javascript
elementsByType: {
  "business-capability": [...],
  "goal": [...],
  "diagram-model-group": [...]
}
```

## 🎨 Helpers disponibles

### Helpers de texte
- `uppercase` : Convertir en majuscules
- `lowercase` : Convertir en minuscules
- `escape` : Échapper les caractères Markdown
- `truncate:N` : Tronquer à N caractères
- `newlines` : Convertir `\n` en `<br>`

### Helpers de formatage
- `number` : Formater un nombre

## 🔧 Filtres de collection

### filter
Filtrer par propriété :
```markdown
{{#each elements | filter:type="business-capability"}}
{{#each elements | filter:isGroup="true"}}
```

### sort
Trier par propriété :
```markdown
{{#each elements | sort:by="name"}}
```

### deduplicate
Supprimer les doublons :
```markdown
{{#each elements | deduplicate}}
```

### Combiner plusieurs filtres
```markdown
{{#each elements | filter:type="business-capability" | sort:by="name"}}
```

## 📚 Créer vos propres templates

1. Créer un fichier `.md` dans `templates/`
2. (Optionnel) Ajouter un front matter YAML avec le titre :
```yaml
---
title: "Mon Template"
---
```
3. Utiliser la syntaxe de template
4. Le template apparaîtra automatiquement dans la liste

## 🆚 Différences avec l'ancien système (extractMD)

| Fonctionnalité | Ancien (extractMD) | Nouveau (viewTemplates) |
|----------------|-------------------|------------------------|
| **Données** | Structure spécifique | Structure `viewExtractor` |
| **Syntaxe** | `{{#each collection}}...{{/each collection}}` | `{{#each collection}}...{{/each}}` |
| **Filtres** | WHERE dans la syntaxe de boucle | Pipe `|` sur les collections |
| **Validation** | Avertissements runtime | Validation avant traitement |
| **Messages d'erreur** | Warnings génériques | Numéros de ligne précis |
| **Propriétés visuelles** | Limité | Complet (bounds, styles) |
| **Déduplication** | Manuel | Option intégrée |
| **Tri** | Manuel | Option intégrée |

## 🔮 Évolutions futures

- [ ] Support de templates imbriqués (includes)
- [ ] Helpers personnalisés configurables
- [ ] Export vers d'autres formats (HTML, PDF)
- [ ] Mode batch (traiter plusieurs vues)
- [ ] Preview en temps réel

## 📖 Exemples

Voir les templates inclus dans `templates/` :
- `simple_list.md` : Liste simple d'éléments
- `detailed_report.md` : Rapport détaillé avec statistiques
- `filtered_view.md` : Démonstration des filtres
