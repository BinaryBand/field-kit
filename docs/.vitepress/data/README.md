# Component Documentation System

This directory contains the data-driven documentation system for TW Components.

## Overview

Component documentation is now generated from a centralized JSON data file, making it easier to maintain consistency across all component docs.

## Structure

```
.vitepress/
├── data/
│   └── components.json          # Central data source for all components
├── scripts/
│   ├── generate-component-docs.js   # Generator script
│   └── create-component-docs.js     # Interactive component creator
└── utils/
    └── components.ts             # TypeScript utilities for accessing data
```

## Usage

### Generate Documentation

To regenerate all component documentation from the JSON data:

```bash
npm run docs:generate
```

This reads `data/components.json` and generates markdown files in `docs/components/{category}/{id}.md`.

### Add a New Component

1. **Add to JSON data**:
   Edit `docs/.vitepress/data/components.json` and add a new component object with all required fields.

2. **Generate documentation**:

   ```bash
   npm run docs:generate
   ```

3. **Review and customize**:
   The generated markdown file will have the basic structure. You can then add custom examples and content to the "Examples" section and other placeholders.

### Update Existing Component

1. Edit the component data in `components.json`
2. Run `npm run docs:generate` to regenerate
3. Custom examples and content in the markdown files are preserved (marked by placeholders)

## Data Structure

### Component Object

```json
{
  "id": "component-id",
  "name": "Component Name",
  "category": "inputs",
  "description": "Brief description",
  "element": "input",
  "htmlType": "custom-type",
  "selector": "input[type='custom-type']",
  "demo": {
    "html": "<input type='custom-type' />"
  },
  "basicUsage": "<input type='custom-type' />",
  "attributes": [...],
  "events": [...],
  "cssVariables": {...},
  "keyboard": [...],
  "browserSupport": [...],
  "useCases": [...]
}
```

### Required Fields

- `id`: Unique identifier (kebab-case)
- `name`: Display name
- `category`: "inputs" or "views"
- `description`: Brief description
- `element`: HTML element type
- `selector`: CSS selector for the component
- `basicUsage`: Simple HTML example
- `attributes`: Array of attribute objects
- `events`: Array of event objects
- `keyboard`: Array of keyboard shortcut objects
- `browserSupport`: Array of browser versions
- `useCases`: Array of use case strings

### Optional Fields

- `htmlType`: For custom input types
- `cssClasses`: Array of CSS class objects
- `optionAttributes`: Additional attributes (for select, etc.)
- `canvasProperties`: Canvas-specific properties
- `cssVariables`: CSS custom properties object
- `demo`: Demo configuration object

## TypeScript Utilities

Import the utilities to access component data programmatically:

```typescript
import {
  getAllComponents,
  getComponentById,
  getInputComponents,
  getViewComponents,
  searchComponents,
} from './.vitepress/utils/components';

// Get all components
const components = getAllComponents();

// Get specific component
const pinInput = getComponentById('pin');

// Get by category
const inputComponents = getInputComponents();

// Search
const results = searchComponents('signature');
```

## Benefits

1. **Single Source of Truth**: All component data in one JSON file
2. **Consistency**: Ensures all components have the same structure
3. **Easy Updates**: Change data in one place, regenerate all docs
4. **Type Safety**: TypeScript interfaces for data validation
5. **Reusability**: Data can be used in other tools (API docs, tests, etc.)
6. **Version Control**: Easy to track changes to component APIs

## Maintenance

### Adding New Sections

To add a new section to all component docs:

1. Update the JSON schema to include the new field
2. Update `generate-component-docs.js` to generate markdown for the new section
3. Update `components.ts` TypeScript interfaces
4. Regenerate all docs

### Custom Content

The generator preserves certain sections marked as "(See original documentation)". These areas are meant for custom, hand-written content that can't be easily generated from data.

## Future Enhancements

- [ ] Validate JSON against schema
- [ ] Generate component index/catalog
- [ ] Export data for Storybook
- [ ] Auto-generate TypeScript types from component data
- [ ] Generate API reference docs
- [ ] Build interactive component explorer
