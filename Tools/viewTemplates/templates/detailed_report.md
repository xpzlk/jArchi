---
title: "Detailed Element Report"
---

# {{view.name}}

## Vue d'ensemble

{{#if view.documentation}}
**Documentation:** {{view.documentation}}
{{/if}}

**Type de vue:** {{view.type}}

![Vue]({{view.imagePath}})

## Statistiques

- **Total éléments:** {{elements.length}}
- **Total relations:** {{relationships.length}}
- **Total containments visuels:** {{visualContainment.length}}

## Éléments par type

{{#each elementsByType as typeGroup}}
### {{typeGroup.type}} ({{typeGroup.elements.length}} éléments)

| Nom | Documentation | Position | Propriétés |
|-----|---------------|----------|------------|
{{#each typeGroup.elements as element}}| {{element.name}} | {{element.documentation | truncate:50}} | {{#if element.bounds}}({{element.bounds.x}}, {{element.bounds.y}}){{/if}} | {{#if element.properties}}{{element.properties | escape}}{{/if}} |
{{/each}}
{{/each}}

## Relations

| Type | Source | Cible | Documentation |
|------|--------|-------|---------------|
{{#each relationships as relationship}}| {{relationship.type}} | {{relationship.source.name}} | {{relationship.target.name}} | {{relationship.documentation | truncate:50}} |
{{/each}}

{{#if visualContainment.length}}
## Hiérarchie visuelle

{{#each visualContainment as containment}}
- {{containment.sourceElement.name}} contient {{containment.targetElement.name}}
{{/each}}
{{/if}}
