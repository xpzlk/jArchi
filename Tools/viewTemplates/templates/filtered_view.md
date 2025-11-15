---
title: "Filtered View (demonstrates filters)"
---

# {{view.name}} - Filtered Report

## All Business Capabilities

{{#each elements | filter:type="business-capability" as element}}
### {{element.name}}

{{element.documentation}}

{{#if element.properties}}
**Propriétés:**
{{#each element.propertiesArray as property}}
- {{property.key}}: {{property.value}}
{{/each}}
{{/if}}

{{/each}}

## All Goals

{{#each elements | filter:type="goal" as element}}
- **{{element.name}}**: {{element.documentation | truncate:100}}
{{/each}}

## Elements sorted by name

{{#each elements | sort:by="name" as element}}
{{element.name}}
{{/each}}

## Groups only

{{#each elements | filter:isGroup="true" as element}}
### Group: {{element.name}}

Children count: {{element.visualChildren.length}}

{{/each}}
