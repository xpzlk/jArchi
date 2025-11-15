---
title: "Simple Element List"
---

# {{view.name}}

{{#if view.documentation}}
{{view.documentation}}
{{/if}}

![View Diagram]({{view.imagePath}})

## Elements ({{elements.length}} total)

{{#each elements as element}}
- **{{element.name}}** ({{element.type}})
{{/each}}

## Relationships ({{relationships.length}} total)

{{#each relationships as relationship}}
- {{relationship.name}}: {{relationship.source.name}} → {{relationship.target.name}}
{{/each}}
