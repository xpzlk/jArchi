# Guide des Tableaux Markdown

## ⚠️ Important

Les tableaux Markdown sont **très sensibles au formatage**. Une erreur courante peut casser complètement le rendu du tableau.

## ✅ Format correct

Un tableau Markdown valide :

```markdown
| Colonne1 | Colonne2 | Colonne3 |
|----------|----------|----------|
| Valeur1  | Valeur2  | Valeur3  |
| Valeur4  | Valeur5  | Valeur6  |
```

**Caractéristiques** :
- ✅ Pas de ligne vide entre les lignes
- ✅ Chaque ligne sur une seule ligne
- ✅ Caractère `|` échappé dans les valeurs

## ❌ Erreurs courantes

### 1. Lignes vides entre les lignes du tableau

**❌ Incorrect** (casse le tableau) :
```markdown
| Colonne1 | Colonne2 |
|----------|----------|

| Valeur1  | Valeur2  |

| Valeur3  | Valeur4  |
```

**Cause dans le template** :
```jinja
{% for item in items %}
| {{ item.col1 }} | {{ item.col2 }} |
{% endfor %}
```

**✅ Solution** : Utiliser `-%}` pour supprimer les retours à la ligne :
```jinja
{% for item in items -%}
| {{ item.col1 }} | {{ item.col2 }} |
{% endfor -%}
```

### 2. Retours à la ligne dans les cellules

**❌ Incorrect** (casse le tableau) :
```markdown
| Colonne1 | Colonne2 |
|----------|----------|
| Valeur avec
retour à la ligne | Valeur2 |
```

**Cause** : Les valeurs contiennent des `\n`

**✅ Solution** : Remplacer `\n` par `<br>` :
```jinja
{% for item in items -%}
| {{ item.col1|replace("\n", "<br>") }} | {{ item.col2 }} |
{% endfor -%}
```

### 3. Caractère pipe `|` non échappé

**❌ Incorrect** (casse la structure) :
```markdown
| Nom | Description |
|-----|-------------|
| Item | Valeur A | Valeur B |
```

**Cause** : La description contient un `|` non échappé

**✅ Solution** : Utiliser le filtre `escape` :
```jinja
{% for item in items -%}
| {{ item.name|escape }} | {{ item.description|escape }} |
{% endfor -%}
```

Le filtre `escape` transforme `|` en `\|`.

## 📝 Template type pour tableaux

Voici un template complet et correct pour générer des tableaux :

```jinja
## Titre du tableau

| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
{% for element in elements -%}
{% if element.type == "business-capability" -%}
| {{ element.name|escape }} | {{ element.documentation|default("N/A")|replace("\n", "<br>")|escape }} | {{ element.properties.Statut|default("Non défini") }} |
{% endif -%}
{% endfor -%}
```

**Points clés** :
1. `-%}` après **chaque** balise `{% for %}` et `{% endfor %}`
2. `-%}` après **chaque** balise `{% if %}` et `{% endif %}` dans la boucle
3. `|escape` sur les colonnes qui peuvent contenir `|`
4. `|replace("\n", "<br>")` sur les colonnes multilignes
5. `|default("...")` pour les valeurs optionnelles

## 🔍 Vérification rapide

Pour vérifier si votre tableau est bien formé :

1. **Pas de ligne vide** entre l'en-tête et les données
2. **Pas de ligne vide** entre les lignes de données
3. **Une seule ligne** par ligne de données (pas de retour à la ligne)
4. **Nombre égal** de `|` sur chaque ligne

## 🛠️ Debugging

Si votre tableau ne s'affiche pas correctement :

1. **Ouvrez le fichier MD généré** dans un éditeur de texte
2. **Cherchez les lignes vides** dans le tableau
3. **Cherchez les retours à la ligne** dans les cellules
4. **Vérifiez les `-%}`** dans votre template

## Exemples complets

### Exemple 1 : Tableau simple

**Template** :
```jinja
| Nom | Type |
|-----|------|
{% for element in elements -%}
| {{ element.name }} | {{ element.type }} |
{% endfor -%}
```

**Résultat** :
```markdown
| Nom | Type |
|-----|------|
| Element 1 | business-capability |
| Element 2 | business-process |
```

### Exemple 2 : Tableau avec filtrage

**Template** :
```jinja
| # | Capacité | Statut |
|---|----------|--------|
{% for element in elements -%}
{% if element.type == "business-capability" -%}
| {{ loop.index }} | {{ element.name }} | {{ element.properties.Statut|default("Non défini") }} |
{% endif -%}
{% endfor -%}
```

### Exemple 3 : Tableau avec documentation multiligne

**Template** :
```jinja
| Nom | Description |
|-----|-------------|
{% for element in elements -%}
| {{ element.name|escape }} | {{ element.documentation|replace("\n", "<br>")|escape }} |
{% endfor -%}
```

### Exemple 4 : Tableau groupé par catégorie

**Template** :
```jinja
{% for group in elements -%}
{% if group.isGroup -%}

## {{ group.name }}

| Capacité | Description | Priorité |
|----------|-------------|----------|
{% for child in group.visualChildren -%}
| {{ child.name }} | {{ child.documentation|default("N/A")|replace("\n", "<br>") }} | {{ child.properties.Priorité|default("N/A") }} |
{% endfor -%}

{% endif -%}
{% endfor -%}
```

## Checklist avant validation

- [ ] Toutes les boucles utilisent `-%}` après `{% for ... %}`
- [ ] Toutes les boucles utilisent `-%}` après `{% endfor %}`
- [ ] Les conditionnelles dans les boucles utilisent `-%}` après `{% if ... %}`
- [ ] Les conditionnelles dans les boucles utilisent `-%}` après `{% endif %}`
- [ ] Les colonnes avec documentation utilisent `|replace("\n", "<br>")`
- [ ] Les colonnes avec valeurs potentiellement `|` utilisent `|escape`
- [ ] Les propriétés optionnelles utilisent `|default("...")`

## Ressources

- [JINJA_REFERENCE.md](JINJA_REFERENCE.md) - Référence complète de la syntaxe
- [USAGE.md](USAGE.md) - Guide d'utilisation général
- [SPECIFICATIONS.md](SPECIFICATIONS.md) - Spécifications techniques
- [examples/](examples/) - Exemples de templates fonctionnels
