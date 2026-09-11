---
name: workspace
description: "Native workspace operations: PDF export, tab/pane management, file paths"
source: workspace
---

# Workspace

## Plugin metadata

- **id:** `workspace`
- **source:** core
- **plugin-type:** core
- **status:** enabled
- **class:** FULL
- **has-settings:** true

### Commands

- `workspace:export-pdf` -- Export current note to PDF
- `workspace:close` -- Close current tab
- `workspace:split-horizontal` -- Split horizontally
- `workspace:split-vertical` -- Split vertically
- `workspace:new-tab` -- New tab
- `workspace:copy-path` -- Copy file path
- `workspace:copy-url` -- Copy Obsidian URL
- `workspace:edit-file-title` -- Rename file
- `workspace:toggle-pin` -- Toggle pin

Plugin "Workspace" provides core Obsidian workspace operations.

Available commands:
- workspace:export-pdf -- Export the currently open note to PDF using Obsidian's built-in renderer
- workspace:close -- Close the currently active tab
- workspace:split-horizontal -- Split the current pane horizontally
- workspace:split-vertical -- Split the current pane vertically
- workspace:new-tab -- Open a new empty tab
- workspace:copy-path -- Copy the active file's vault-relative path to clipboard
- workspace:copy-url -- Copy an obsidian:// URL for the active file
- workspace:edit-file-title -- Rename the active file inline
- workspace:toggle-pin -- Pin or unpin the active tab (pinned tabs stay open)

workspace:export-pdf is a native Obsidian command -- zero external dependencies, always available.
It renders the note exactly as Obsidian displays it (theme, CSS, plugins applied).
Note: Opens an export dialog. The user must confirm settings and save location.

Use workspace:export-pdf for quick PDF exports. For advanced conversion (custom LaTeX templates, bibliography, DOCX): use execute_recipe with Pandoc instead.

## Configuration File

Settings path: `.obsidian/workspace.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/workspace.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/workspace.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Current Configuration

```
main:
  id: f783e15da4398026
  type: split
  children: [1 items]
  direction: vertical
left:
  id: cfb3a2f04b751cbc
  type: split
  children: [1 items: {...}...]
  direction: horizontal
  width: 300
right:
  id: 22ba94471d9706b9
  type: split
  children: [1 items: {...}...]
  direction: horizontal
  width: 300
left-ribbon:
  hiddenItems:
    switcher:Open quick switcher: false
    graph:Open graph view: false
    canvas:Create new canvas: false
    daily-notes:Open today's daily note: false
    templates:Insert template: false
    command-palette:Open command palette: false
    bases:Create new base: false
    obsidian-git:Open Git source control: false
active: 7715d51df7f57d7e
lastOpenFiles: [42 items: LV System/LV System.md, index.md, LV System/Electric Generator/Generator Synchronization.md...]
```

For full settings, read: `.obsidian/workspace.json`

## Documentation

For detailed documentation:
read_file(".vault-operator/data/skills/workspace.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
