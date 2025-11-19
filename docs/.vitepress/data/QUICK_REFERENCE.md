# Quick Reference Guide

## Common Operations

### Generate All Documentation

```bash
npm run docs:generate
```

### Add a New Component

1. **Edit** `docs/.vitepress/data/components.json`
2. **Add** a new component object:

```json
{
  "id": "new-component",
  "name": "New Component",
  "category": "inputs",
  "description": "Component description",
  "element": "input",
  "htmlType": "new-type",
  "selector": "input[type='new-type']",
  "demo": {
    "html": "<input type='new-type' />"
  },
  "basicUsage": "<input type='new-type' />",
  "attributes": [],
  "events": [],
  "cssVariables": {},
  "keyboard": [],
  "browserSupport": [],
  "useCases": []
}
```

3. **Run** `npm run docs:generate`
4. **Edit** `docs/components/inputs/new-component.md` to add examples

### Update Component Data

1. **Edit** the component in `components.json`
2. **Run** `npm run docs:generate`
3. Generated files will be updated

### Query Components Programmatically

```typescript
import {
  getAllComponents,
  getComponentById,
  getInputComponents,
  searchComponents,
} from './.vitepress/utils/components';

// Get all
const all = getAllComponents();

// Get by ID
const pin = getComponentById('pin');

// Get inputs only
const inputs = getInputComponents();

// Search
const results = searchComponents('secure');
```

## Data Structure Reference

### Minimal Component Object

```json
{
  "id": "component-id",
  "name": "Component Name",
  "category": "inputs|views",
  "description": "Brief description",
  "element": "input|select|textarea|div",
  "selector": "CSS selector",
  "basicUsage": "HTML string",
  "attributes": [],
  "events": [],
  "keyboard": [],
  "browserSupport": [],
  "useCases": []
}
```

### Attribute Object

```json
{
  "name": "attributeName",
  "type": "string|number|boolean",
  "default": "defaultValue",
  "description": "What it does"
}
```

### Event Object

```json
{
  "event": "eventName",
  "trigger": "When it fires",
  "data": "What data is available"
}
```

### Keyboard Shortcut Object

```json
{
  "key": "Key name",
  "action": "What it does"
}
```

## File Locations

```
docs/
├── .vitepress/
│   ├── data/
│   │   ├── components.json          ← Edit component data here
│   │   ├── README.md                ← Full documentation
│   │   └── SUMMARY.md               ← What we built
│   ├── scripts/
│   │   └── generate-component-docs.js  ← Generator
│   └── utils/
│       └── components.ts             ← TypeScript utilities
└── components/
    ├── inputs/                       ← Generated files
    │   ├── auto-resize.md
    │   ├── list.md
    │   ├── passkey.md
    │   ├── pin.md
    │   ├── select.md
    │   └── signature.md
    └── views/
        ├── calendar.md
        └── filter.md
```

## Tips

### Keep JSON Organized

- One component per object
- Maintain consistent ordering of fields
- Use meaningful descriptions
- Include all required fields

### Custom Content

- Generated docs have "(See original documentation)" placeholders
- Add your custom examples in these sections
- They won't be overwritten on regeneration

### TypeScript

- Interfaces in `components.ts` ensure type safety
- Use these when building features that consume component data
- Update interfaces when adding new JSON fields

### Version Control

- Commit both JSON and generated markdown
- JSON shows the structural changes
- Markdown shows the content changes

## Troubleshooting

### Generator Fails

```bash
# Check JSON syntax
node -c docs/.vitepress/data/components.json

# Check for missing required fields
npm run docs:generate
# Look for error messages
```

### TypeScript Errors

- Update interface in `components.ts`
- Make optional fields use `?:`
- Run TypeScript check: `npx tsc --noEmit`

### Missing Components

- Ensure component exists in JSON
- Check `category` field matches directory structure
- Verify `id` field is URL-friendly (kebab-case)

## Examples

### Simple Text Input

```json
{
  "id": "text-input",
  "name": "Text Input",
  "category": "inputs",
  "description": "Standard text input",
  "element": "input",
  "htmlType": "text",
  "selector": "input[type='text']",
  "basicUsage": "<input type='text' name='username' />",
  "attributes": [
    { "name": "type", "type": "string", "default": "\"text\"", "description": "Input type" },
    { "name": "name", "type": "string", "default": "undefined", "description": "Field name" }
  ],
  "events": [{ "event": "input", "trigger": "When value changes", "data": "e.target.value" }],
  "keyboard": [{ "key": "Enter", "action": "Submit form" }],
  "browserSupport": ["All modern browsers"],
  "useCases": ["Form fields", "Search boxes"]
}
```

## Need Help?

- Check `README.md` for full documentation
- Review `SUMMARY.md` for system overview
- Look at existing components in JSON for examples
- Examine generated markdown to see output structure
