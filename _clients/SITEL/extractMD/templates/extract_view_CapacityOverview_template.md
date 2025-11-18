---
title: "Capacity Overview"
---

# {{ view.name }}

{% if viewImagePath -%}
![Vue d'ensemble]({{ viewImagePath }})
{% endif -%}

{% for element in elements -%}
{% if element.isGroup and element.name != "Légende" and element.name != "" -%}
## {{ element.name }}

|Capacité|Intention|
|-|-|
{%- for child in element.visualChildren -%}
|{{ child.name }}|{{ child.documentation|escape }}|
{% endfor %}

{% endif -%}
{% endfor -%}

