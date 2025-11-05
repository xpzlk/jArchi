---
title: "Cartographie"
---

# {{view.name}}

{{view.image.png}}

{{#each groups where name != "Légende"}}
## {{group.name}}

{{#each valueStreams}}
### {{valueStream.name}}

|Capacité|Intention|
|-|-|
{{#each capabilities}}
|{{capability.name}}|{{capability.documentation}}|
{{/each capabilities}}

{{/each valueStreams}}

{{#if orphanCapabilities.length > 0}}
|Capacité|Intention|
|-|-|
{{#each orphanCapabilities}}
|{{orphanCapability.name}}|{{orphanCapability.documentation}}|
{{/each orphanCapabilities}}
{{/if}}

{{/each groups}}

