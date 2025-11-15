---
title: "Generic Test Template"
---

# {{view.name}}

{{view.image.png}}

## Vue Documentation

{{view.documentation}}

---

## Groupes et leurs éléments

{{#each groups}}
### Groupe: {{group.name}}

{{group.documentation}}

{{#each group.children}}
#### [{{child.type}}] {{child.name}}

{{child.documentation}}

{{#if child.specialization exists}}
**Spécialisation:** {{child.specialization}}
{{/if}}

{{#if child.outgoingRelations.length > 0}}
**Relations sortantes:**
{{#each child.outgoingRelations}}
- [{{relation.type}}] → {{relation.target.name}}
{{/each child.outgoingRelations}}
{{/if}}

{{#if child.incomingRelations.length > 0}}
**Relations entrantes:**
{{#each child.incomingRelations}}
- [{{relation.type}}] ← {{relation.source.name}}
{{/each child.incomingRelations}}
{{/if}}

---

{{/each group.children}}

{{/each groups}}

---

## Toutes les relations

|Source|Type|Cible|
|-|-|-|
{{#each relationships}}
|{{relationship.source.name}}|{{relationship.type}}|{{relationship.target.name}}|
{{/each relationships}}
