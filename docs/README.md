# jArchi Scripts Documentation

This directory contains comprehensive documentation for the jArchi scripts repository.

## Quick Start

- **New to jArchi?** Start with the [official jArchi documentation](https://github.com/archimatetool/archi-scripting-plugin/wiki)
- **Project overview**: See [CLAUDE.md](../CLAUDE.md) for repository structure and conventions
- **Creating documentation**: Use the [documentation template](templates/SCRIPT_DOC_TEMPLATE.md)

---

## Documentation Index

### Tools

General-purpose utilities usable across projects:

| Script | Category | Description |
|--------|----------|-------------|
| [assignProperty2Selection](scripts/tools/assignProperty2Selection.md) | Property Management | Assigns or updates properties on selected elements |

### Libraries

Reusable library functions:

| Library | Description | Status |
|---------|-------------|--------|
| coloring.ajs | Color and style formatting utilities | 📝 To document |
| qualityControl.ajs | Model validation functions | 📝 To document |
| templateEngine.ajs | Template processing engine | 📝 To document |
| imageLib.ajs | Image handling utilities | 📝 To document |

### Client-Specific Scripts

Custom implementations for specific clients:

| Client | Scripts | Status |
|--------|---------|--------|
| Ville de Lausanne | Heatmaps, Quality Control, Property assignments | 📝 To document |
| Ville d'Yverdon | ITIL Assessment Heatmap | 📝 To document |
| Squash Romandie | Heatmap customizations | 📝 To document |
| z_P10 | Project-specific scripts | 📝 To document |

---

## Documentation by Category

### Heatmap Visualization
Scripts that color-code views based on element properties:
- 📝 Color HeatMap (Tools) - *To document*
- 📝 Ville de Lausanne Heatmaps - *To document*
- 📝 Ville d'Yverdon ITIL Assessment - *To document*

### Quality Control
Validation scripts that check model compliance:
- 📝 qualityControl.ajs (Library) - *To document*
- 📝 Perform_QualityControl.ajs (VdL) - *To document*

### Property Management
Batch operations on element properties:
- ✅ [assignProperty2Selection.ajs](scripts/tools/assignProperty2Selection.md) - *Documented*
- 📝 Property - Assign default (VdL) - *To document*

### Documentation Generation
Automated report creation from models:
- 📝 archi2doc - *To document*

### Element Conversion
Convert elements between ArchiMate types:
- 📝 ConvertConcept.lib.js - *To document*

### Data Exchange
Import/export between Archi and external formats:
- 📝 Export.ajs (POC) - *To document*
- 📝 Import.ajs (POC) - *To document*

---

## Contributing Documentation

### Using the Template

1. Copy [templates/SCRIPT_DOC_TEMPLATE.md](templates/SCRIPT_DOC_TEMPLATE.md)
2. Save to appropriate location:
   - `docs/scripts/tools/` for general tools
   - `docs/scripts/libraries/` for libraries
   - `docs/scripts/clients/` for client-specific scripts
3. Fill in all sections
4. Use Mermaid diagrams for execution flows
5. Update this index

### Documentation Standards

- **Language**: English
- **Format**: Markdown with Mermaid diagrams
- **Style**: Concise and focused on practical usage
- **Code examples**: Include only relevant snippets
- **Completeness**: All template sections should be filled

---

## Repository Structure

```
docs/
├── README.md                    # This file - Documentation index
├── templates/
│   └── SCRIPT_DOC_TEMPLATE.md  # Standardized documentation template
├── scripts/
│   ├── tools/                   # Tool script documentation
│   ├── libraries/               # Library function documentation
│   └── clients/                 # Client-specific documentation
└── guides/                      # General guides (future)
```

---

## Legend

- ✅ Documented
- 📝 To document
- 🚧 Work in progress

---

*Last updated: 2025-11-01*
