---
title: "Capacité de gestion de la formation"
---

# {{view.name}}

{{view.image.png}}

{{#each groups where name != "Légende"}}
## {{group.name}}

|Capacité|Intention|
|-|-|
{{#each capabilities}}
|{{capability.name}}|{{capability.documentation}}|
{{/each capabilities}}

{{/each groups}}

