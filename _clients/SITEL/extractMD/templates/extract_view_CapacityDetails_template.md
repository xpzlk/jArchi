---
title: "Capacity Details"
---

{% for element in elements -%}
{% if element.type == "capability" -%}
# {{ element.name }}

**Intention**

{{ element.documentation }}

{% if viewImagePath -%}
![{{ view.name }}]({{ viewImagePath }})

{% endif %}

## Bénéfices attendus

{% for rel in relationships -%}
    {%- if (rel.concept and rel.concept.type == "realization-relationship" or rel.type == "realization-relationship") and (rel.source.concept and rel.source.concept.id == element.id or rel.source.id == element.id) -%}
        {%- for goal in elements -%}
            {%- if (goal.concept and goal.id == rel.target.id and goal.concept.type == "goal") or (goal.id == rel.target.id and goal.type == "goal") %}
- {{ goal.name }}
            {% endif %}
        {%- endfor %}
    {%- endif %}
{% endfor %}





## ABB Applicatifs

{% for rel in relationships -%}
    {%- if (rel.concept and rel.concept.type == "realization-relationship" or rel.type == "realization-relationship") and (rel.target.concept and rel.target.concept.id == element.id or rel.target.id == element.id) -%}
        {%- for appFunc in elements -%}
            {%- if (appFunc.concept and appFunc.id == rel.source.id and appFunc.concept.type == "application-function") or (appFunc.id == rel.source.id and appFunc.type == "application-function") %}

### {{ appFunc.name }}
{{ appFunc.documentation }}

|Propriété|Valeur|
|-|-|
|Transversalité du besoin|{{ appFunc.properties["Transversalité du besoin"]|default("N/A") }}|
|Complexité métier|{{ appFunc.properties["Complexité métier"]|default("N/A") }}|
|Business criticality|{{ appFunc.properties["Business criticality"]|default("N/A") }}|
|Compliance|{{ appFunc.properties["Compliance"]|default("N/A") }}|

**Services attendus**
                {%- for service in elements -%}
                    {%- if ((service.concept and service.concept.type == "application-service") or service.type == "application-service") and service.visualParentId == appFunc.id %}
- {{ service.name }}
                    {% endif %}
                {%- endfor %}
            {% endif %}
        {%- endfor %}
    {%- endif %}
{% endfor %}




## ABB Techniques

{% for rel in relationships -%}
    {%- if (rel.concept and rel.concept.type == "realization-relationship" or rel.type == "realization-relationship") and (rel.target.concept and rel.target.concept.id == element.id or rel.target.id == element.id) -%}
        {%- for techFunc in elements -%}
            {%- if (techFunc.concept and techFunc.id == rel.source.id and techFunc.concept.type == "technology-function") or (techFunc.id == rel.source.id and techFunc.type == "technology-function") %}

### {{ techFunc.name }}
{{ techFunc.documentation }}

|Propriété|Valeur|
|-|-|
|Transversalité du besoin|{{ techFunc.properties["Transversalité du besoin"]|default("N/A") }}|
|Complexité métier|{{ techFunc.properties["Complexité métier"]|default("N/A") }}|
|Business criticality|{{ techFunc.properties["Business criticality"]|default("N/A") }}|
|Compliance|{{ techFunc.properties["Compliance"]|default("N/A") }}|

**Services attendus**
                {%- for service in elements -%}
                    {%- if ((service.concept and service.concept.type == "technology-service") or service.type == "technology-service") and service.visualParentId == techFunc.id %}
- {{ service.name }}
                    {% endif %}
                {%- endfor %}
            {% endif %}
        {%- endfor %}
    {%- endif %}
{% endfor %}

{% endif -%}
{% endfor -%}
