# extractMD - Générateur de documentation Markdown générique

Système générique d'extraction de documentation à partir de vues ArchiMate en utilisant des templates Markdown.

## Structure du projet

```
extractMD/
├── extractMD.ajs                          # Script principal à exécuter
├── lib/
│   ├── dataExtractor.ajs                  # Extraction des données de la vue
│   └── templateEngine.ajs                 # Moteur de traitement des templates
├── templates/
│   ├── extract_view_CapacityOverview_template.md  # Template exemple
│   └── ... (vos templates)
├── TEMPLATE_REFERENCE.md                  # Documentation des variables disponibles
└── README.md                              # Ce fichier
```

## Utilisation

### 1. Exécuter le script

1. Dans Archi, sélectionnez une vue ArchiMate
2. Exécutez le script `extractMD.ajs` depuis le menu Scripts
3. Sélectionnez le template à utiliser dans la liste
4. Le script génère :
   - Un fichier Markdown nommé d'après la vue
   - Une image PNG de la vue

### 2. Créer un nouveau template

1. Créez un fichier `.md` dans le dossier `templates/`
2. Utilisez les variables documentées dans [TEMPLATE_REFERENCE.md](TEMPLATE_REFERENCE.md)
3. Sauvegardez le fichier
4. Le template apparaîtra automatiquement dans la liste lors de la prochaine exécution

**Exemple simple:**

```markdown
# {{view.name}}

{{view.image.png}}

## Capacités

{{#each capabilities}}
- **{{capability.name}}**: {{capability.documentation}}
{{/each}}
```

## Architecture

### extractMD.ajs (Script principal)

Responsabilités :
- Interface utilisateur (sélection de template)
- Découverte automatique des templates
- Export de l'image PNG
- Orchestration générale

### lib/dataExtractor.ajs (Extracteur de données)

Responsabilités :
- Extraction de toutes les données de la vue
- Organisation des données en structure utilisable
- Extraction des propriétés personnalisées

**Données extraites:**
- Informations de la vue
- Groupes avec leurs capacités
- Capacités (liste plate)
- Objectifs
- Fonctions techniques avec leurs services

### lib/templateEngine.ajs (Moteur de template)

Responsabilités :
- Lecture des fichiers template
- Traitement des boucles `{{#each}}`
- Remplacement des variables simples `{{variable}}`
- Échappement Markdown automatique
- Warnings pour variables inconnues

## Syntaxe des templates

### Variables simples

```markdown
{{view.name}}
{{view.documentation}}
{{view.image.png}}
```

### Boucles

```markdown
{{#each groups}}
## {{group.name}}

{{#each capabilities}}
- {{capability.name}}
{{/each}}

{{/each}}
```

**Règle importante:** Dans une boucle `{{#each items}}`, utilisez le singulier pour les propriétés: `{{item.xxx}}`

Voir [TEMPLATE_REFERENCE.md](TEMPLATE_REFERENCE.md) pour la liste complète des variables.

## Extensibilité

### Ajouter un nouveau type d'élément

Pour ajouter l'extraction d'un nouveau type d'élément ArchiMate :

1. Éditez [lib/dataExtractor.ajs](lib/dataExtractor.ajs)
2. Créez une nouvelle fonction d'extraction (ex: `extractApplications()`)
3. Ajoutez l'appel dans `extractViewData()`
4. Les données seront automatiquement disponibles dans les templates

**Exemple:**

```javascript
function extractApplications(view) {
    var applications = [];
    $(view).find().each(function(e) {
        if (e.type === "application-component") {
            applications.push({
                name: e.name || "",
                documentation: e.documentation || "",
                properties: extractProperties(e)
            });
        }
    });
    return applications;
}
```

Ensuite dans `extractViewData()`:

```javascript
var data = {
    view: extractViewInfo(view),
    groups: extractGroups(view),
    capabilities: extractCapabilities(view),
    applications: extractApplications(view),  // Nouveau
    // ...
};
```

### Ajouter des fonctions spéciales au moteur

Éditez [lib/templateEngine.ajs](lib/templateEngine.ajs) pour ajouter de nouvelles fonctionnalités :
- Nouveaux types de boucles
- Filtres (ex: trier, filtrer)
- Fonctions de formatage

## Avantages de cette architecture

1. **Séparation des responsabilités**: Chaque fichier a un rôle clair
2. **Extensibilité**: Facile d'ajouter de nouveaux types d'éléments
3. **Pas de code dans les templates**: Les templates sont purement déclaratifs
4. **Réutilisabilité**: Les bibliothèques peuvent être utilisées par d'autres scripts
5. **Maintenabilité**: Code modulaire et bien organisé

## Comparaison avec l'ancien système

**Ancien système (`extract_view_documentation.ajs`):**
- Code d'extraction mélangé avec la logique du script
- Difficile d'ajouter de nouveaux templates
- Syntaxe de template implicite et peu claire

**Nouveau système (`extractMD`):**
- Architecture modulaire et claire
- Templates avec syntaxe explicite (boucles `{{#each}}`)
- Facile d'ajouter de nouveaux templates (juste créer un `.md`)
- Documentation complète des variables disponibles
