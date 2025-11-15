---
title: "Capacity Overview"
---

# {{view.name}}

{{view.image.png}}

{{#each groups where name != "Légende" AND name != ""}}
## {{group.name}}

|Capacité|Intention|
|-|-|
{{#each group.children}}
|{{child.name}}|{{child.documentation}}|
{{/each group.children}}

{{/each groups}}

