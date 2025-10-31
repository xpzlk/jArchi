---
title: "Capacity Details"
---

{{#each capabilities}}
# {{capability.name}}
**Intention**

{{capability.documentation}}
{{/each capabilities}}

{{view.image.png}}

## Bénéfices attendus
{{#each goals}}
- {{goal.name}}
{{/each goals}}

## ABB Techniques
{{#each technologyFunctions}}
### {{technologyFunction.name}}
{{technologyFunction.documentation}}

|Propriété|Valeur|
|-|-|
|Transversalité du besoin|{{technologyFunction.properties.Transversalibilité du besoin}}|
|Complexité métier|{{technologyFunction.properties.Complexité métier}}|
|Business criticality|{{technologyFunction.properties.Business criticality}}|
|Compliance|{{technologyFunction.properties.Compliance}}|

**Services attendus**
{{#each services}}
- {{service.name}}
{{/each services}}

{{/each technologyFunctions}}
