# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **jArchi Scripts Repository** for automating Archi/ArchiMate enterprise architecture modeling tasks. Scripts are written in JavaScript with the `.ajs` extension (ArchiMate JavaScript) and executed within Archi using the jArchi plugin.

Repository: https://github.com/xpzlk/jArchi

**Official jArchi Documentation**: https://github.com/archimatetool/archi-scripting-plugin/wiki

## Development Workflow

Scripts are executed directly from within Archi via the jArchi plugin menu. There is no build, compile, or test infrastructure:

- **Execution**: Run scripts from Archi's Script menu or context menus
- **Testing**: Manual execution within Archi with test models
- **Runtime**: Nashorn JavaScript engine (Java's JS runtime)
- **IDE Support**: [jsconfig.json](jsconfig.json) and [typings/jarchi.d.ts](typings/jarchi.d.ts) provide IntelliSense for jArchi API
- **Git Commits**: Commit messages must not exceed 256 characters

## Architecture & Code Organization

### Library Pattern

Reusable functionality is abstracted into the [library/](library/) directory:
- [coloring.ajs](library/coloring.ajs) - Color and style formatting utilities
- [qualityControl.ajs](library/qualityControl.ajs) - Model validation functions
- [imageLib.ajs](library/imageLib.ajs) - Image handling utilities
- [showdown/](library/showdown/) - Markdown conversion library

Scripts load libraries using: `load(__DIR__ + "library/filename.ajs")`

### Client-Specific Structure

Each client has a dedicated directory with customized implementations:
- [Ville de Lausanne/](Ville de Lausanne/) - City of Lausanne customizations
- [Ville d'Yverdon/](Ville d'Yverdon/) - City of Yverdon customizations
- [Squash Romandie/](Squash Romandie/) - Squash Romandie customizations
- [z_P10/](z_P10/) - P10 project customizations

Client folders typically contain:
- Custom heatmap implementations
- Client-specific configurations in `config/` subdirectories
- Quality control scripts with client-specific rules
- Numbering/naming convention scripts

### Configuration-Driven Design

Many scripts are parameterized through external JSON configuration files rather than hardcoded values. For example:
- Heatmap configurations in `config/` folders define property mappings and color schemes
- [archi2doc/tableFormatDef.json](Tools/archi2doc/tableFormatDef.json) defines table formatting for documentation generation

When modifying these scripts, check for associated configuration files.

### Third-Party Integration

External JavaScript libraries are loaded using the `load()` function:
- [PapaParse](POC/lib/papaparse.min.js) for CSV parsing
- [Showdown](library/showdown/) for Markdown conversion
- [Marked](single-page-html-export/libs/marked.js) for HTML generation
- [Underscore.js](single-page-html-export/libs/underscore-min.js) for utilities

## Key Directories

### [Tools/](Tools/)
General-purpose utilities usable across projects:
- [archi2doc/](Tools/archi2doc/) - Documentation generator (Markdown, HTML, OpenXML)
- Color HeatMap scripts - Property-based visualization tools
- Export utilities (PDF, PNG, SVG)
- Property assignment tools

### [POC/](POC/)
Proof-of-concept and experimental scripts:
- [Export.ajs](POC/Export.ajs) / [Import.ajs](POC/Import.ajs) - CSV import/export experiments
- [ExtractSVG/](POC/ExtractSVG/) - SVG/PNG extraction tools

### [Convert to/](Convert to/)
Element type conversion utilities organized by ArchiMate layer:
- [ConvertConcept.lib.js](Convert to/ConvertConcept.lib.js) - Core conversion logic
- Subdirectories for Business, Motivation, and other layers

### [single-page-html-export/](single-page-html-export/)
Third-party contribution for generating standalone HTML reports. See its [README.md](single-page-html-export/README.md) for details.

## Core Functionality Areas

### Heatmap Visualization
Scripts that color-code views based on element properties:
- Property value mapping to colors
- Legend generation
- Configuration-driven color schemes
- Examples: [Tools/Color HeatMap.ajs](Tools/Color HeatMap.ajs), client-specific heatmaps

### Quality Control
Validation scripts that check model compliance:
- [library/qualityControl.ajs](library/qualityControl.ajs) - Reusable validation functions
- Client-specific rules (e.g., [Ville de Lausanne/Perform_QualityControl.ajs](Ville de Lausanne/Perform_QualityControl.ajs))
- Reporting of violations

### Documentation Generation
Automated report creation from models:
- [archi2doc](Tools/archi2doc/) - Main documentation generator
- Supports Markdown, HTML, and OpenXML formats
- Template-based with customizable formatting

### Data Exchange
Import/export between Archi and external formats:
- CSV import/export for elements and relationships
- SVG/PNG/PDF export of views
- Uses PapaParse for CSV handling

### Property Management
Batch operations on element properties:
- [assignProperty2Selection.ajs](Tools/assignProperty2Selection.ajs) - Assign properties to selected elements
- Property-based filtering and updates

## Technical Details

### JavaScript Environment
- **Engine**: Nashorn (Java 8's JavaScript engine)
- **Java Integration**: Direct access to Java classes for file I/O and advanced operations
- **Example**: `var filer = Java.type("java.io.File");`

### jArchi API
The jArchi plugin provides JavaScript objects for manipulating Archi models:
- `model` - Current model
- `selection` - Currently selected elements
- `$()` - jQuery-like selector for elements
- Type definitions available in [typings/jarchi.d.ts](typings/jarchi.d.ts)

### File Organization Conventions
- Place client-specific scripts in dedicated client folders
- Extract reusable logic to [library/](library/)
- Use [POC/](POC/) for experimental work
- Store configurations in `config/` subdirectories
