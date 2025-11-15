---
title: "Capacity Hierarchy"
---

# {{view.name}}

{{view.image.png}}

{{#each groups where name != "Légende"}}
## {{group.name}}

{{#each capabilities}}
### {{capability.name}}
{{#if capability.documentation}}
*{{capability.documentation}}*
{{/if}}

{{#each children where type = "capability"}}
#### {{child.name}}

{{#if child.documentation}} : {{child.documentation}}{{/if}}
{{/each children}}

{{/each capabilities}}

{{/each groups}}
