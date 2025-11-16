# {{ view.name }}
![Diagramme - {{ view.name }}]({{ viewImagePath }})

---

{% for element in elements -%}
{% if element.isGroup and element.name != "Légende" and element.name != "" -%}
## {{ element.name }}

{% if element.documentation -%}
{{ element.documentation }}

{% endif -%}

---

{% if element.visualChildren|length > 0 -%}
{% for child in element.visualChildren -%}
### {{ child.name }}

{% if child.documentation -%}
{{ child.documentation }}

{% endif -%}
{% if child.visualChildren|length > 0 -%}
{% for nestedChild in child.visualChildren -%}
#### {{ nestedChild.name }}

{% if nestedChild.documentation -%}
{{ nestedChild.documentation }}

{% endif -%}
{% if nestedChild.properties -%}

| Propriété | Valeur |
|-----------|--------|
{%- if nestedChild.properties["ID"] is defined -%}
| ID | {{ nestedChild.properties["Type"]|escape }}-{{ nestedChild.properties["Couche"]|escape }}-{{ nestedChild.properties["Domaine"]|escape }}-{{ nestedChild.properties["ID"]|escape }} |
{% endif -%}
{%- if nestedChild.properties["Transversalité du besoin"] is defined -%}
| Transversabilité | {{ nestedChild.properties["Transversalité du besoin"]|escape }} |
{% endif -%}
{%- if nestedChild.properties["Complexité business logic"] is defined -%}
| Complexité métier | {{ nestedChild.properties["Complexité business logic"]|escape }} |
{% endif -%}
{%- if nestedChild.properties["Criticité business"] is defined -%}
| Criticité métier | {{ nestedChild.properties["Criticité business"]|escape }} |
{% endif -%}
{%- if nestedChild.properties["Niveau d'exigence de compliance"] is defined -%}
| Conformité | {{ nestedChild.properties["Niveau d'exigence de compliance"]|escape }} |
{% endif -%}

{% endif -%}
{% endfor -%}
{% endif -%}

{% endfor -%}
{% endif -%}

{% endif -%}
{% endfor -%}
