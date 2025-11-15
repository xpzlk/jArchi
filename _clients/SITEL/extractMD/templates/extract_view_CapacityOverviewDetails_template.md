---
title: "Capacity Overview Details"
---

# {{view.name}}

{{view.image.png}}

{{#each groups where name != "Légende" AND name != ""}}
## {{group.name}}

{{#each group.children}}
### {{child.name}}

{{child.documentation}}

{{#each child.children}}

#### {{nestedChild.name}}

{{nestedChild.documentation}}

**Propriétés :**

| Propriété | Valeur |
|-|-|
{{#each nestedChild.propertiesArray}}
| {{property.key}} | {{property.value}} |
{{/each nestedChild.propertiesArray}}

{{/each child.children}}

{{/each group.children}}
{{/each groups}}

