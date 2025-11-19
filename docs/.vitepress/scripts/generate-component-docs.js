#!/usr/bin/env node

/**
 * Generate component documentation from JSON data
 * Usage: node generate-component-docs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/components.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

/**
 * Generate markdown table from array of objects
 */
function generateTable(headers, rows) {
  if (!rows || rows.length === 0) return '';

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---------').join(' | ')} |`;
  const dataRows = rows
    .map(
      (row) =>
        `| ${headers
          .map((h) => {
            const key = h.toLowerCase().replace(/\s+/g, '');
            return row[key] || row[h.toLowerCase()] || '';
          })
          .join(' | ')} |`
    )
    .join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

/**
 * Generate attributes table
 */
function generateAttributesTable(attributes) {
  if (!attributes || attributes.length === 0) return '';

  const headers = ['Attribute', 'Type', 'Default', 'Description'];
  const rows = attributes.map((attr) => ({
    attribute: `\`${attr.name}\``,
    type: `\`${attr.type}\``,
    default: `\`${attr.default}\``,
    description: attr.description,
  }));

  return generateTable(headers, rows);
}

/**
 * Generate events table
 */
function generateEventsTable(events) {
  if (!events || events.length === 0) return '';

  const headers = ['Event', 'When Triggered', 'Event Data'];
  const rows = events.map((evt) => ({
    'event': `\`${evt.event}\``,
    'when triggered': evt.trigger,
    'event data': evt.data,
  }));

  return generateTable(headers, rows);
}

/**
 * Generate keyboard table
 */
function generateKeyboardTable(keyboard) {
  if (!keyboard || keyboard.length === 0) return '';

  const headers = ['Key', 'Action'];
  const rows = keyboard.map((kb) => ({
    key: `\`${kb.key}\``,
    action: kb.action,
  }));

  return generateTable(headers, rows);
}

/**
 * Generate CSS variables section
 */
function generateCSSVariables(cssVariables) {
  if (!cssVariables || Object.keys(cssVariables).length === 0) return '';

  const entries = Object.entries(cssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `\`\`\`css
:root {
${entries}
}
\`\`\``;
}

/**
 * Generate use cases list
 */
function generateUseCasesList(useCases) {
  if (!useCases || useCases.length === 0) return '';

  return useCases
    .map(
      (useCase) =>
        `- **${useCase.split(':')[0]}**${useCase.includes(':') ? ':' : ''} ${useCase.split(':').slice(1).join(':').trim()}`
    )
    .join('\n');
}

/**
 * Generate demo section based on component type
 */
function generateDemoSection(component) {
  const { demo } = component;

  if (!demo) return '';

  if (demo.component) {
    return `<FormDemo>
<${demo.component} />
</FormDemo>`;
  }

  if (demo.single || demo.multiple || demo.grouped) {
    // Multiple demos (for select)
    let output = '### Single Select\n\n';
    output += `<FormDemo>\n  ${demo.single}\n</FormDemo>\n\n`;
    output += '### Multiple Select\n\n';
    output += `<FormDemo>\n  ${demo.multiple}\n</FormDemo>\n\n`;
    output += '### Grouped Select\n\n';
    output += `<FormDemo>\n  ${demo.grouped}\n</FormDemo>`;
    return output;
  }

  if (demo.query) {
    return `<FormDemo query="${demo.query}">
${demo.html}
</FormDemo>`;
  }

  return `<FormDemo>
${demo.html}
</FormDemo>`;
}

/**
 * Generate complete component documentation
 */
function generateComponentDoc(component) {
  const parts = [];

  // Frontmatter
  parts.push(`---
title: ${component.name}
description: ${component.description}
---

# ${component.name}

${component.description}${component.id === 'passkey' ? '\n\n**Important**: The passkey value will NOT appear at `event.formData[name]` during a submit event. Instead, the public key will be broadcasted in `event.currentTarget.value` during `change` events.' : ''}

## Demo

${generateDemoSection(component)}

## Basic Usage

\`\`\`html
${component.basicUsage}
\`\`\`

## Properties`);

  // CSS Classes (if any)
  if (component.cssClasses && component.cssClasses.length > 0) {
    parts.push(
      `\n### CSS Classes\n\n${generateTable(
        ['Class', 'Description'],
        component.cssClasses.map((c) => ({ class: `\`${c.class}\``, description: c.description }))
      )}`
    );
  }

  // HTML Attributes
  parts.push(
    `\n### HTML Attributes${component.element === 'textarea' ? '\n\nAll standard `textarea` attributes are supported:' : ''}\n\n${generateAttributesTable(component.attributes)}`
  );

  // Option Attributes (for select)
  if (component.optionAttributes) {
    parts.push(`\n### Option Attributes\n\n${generateAttributesTable(component.optionAttributes)}`);
  }

  // Canvas Properties (for signature)
  if (component.canvasProperties) {
    const props = component.canvasProperties;
    parts.push(
      `\n### Canvas Properties\n\nDefault canvas dimensions (customizable via styling):\n- Width: ${props.width}\n- Height: ${props.height}\n- Line width: ${props.lineWidth}\n- Line color: ${props.lineColor}`
    );
  }

  // Examples section would go here (keeping original markdown for now)
  parts.push(`\n## Examples

(Examples section - see original documentation)`);

  // Behavior section (component-specific)
  if (component.id === 'list') {
    parts.push(`\n## Behavior

### Adding Items

- Type text and press \`Enter\` to add an item
- Items are displayed as removable tokens
- Duplicate items are allowed by default

### Removing Items

- Click the X button on any token to remove it
- Press \`Backspace\` on empty input to remove last item

### Value Format

The component stores values as a JSON array string:
\`\`\`javascript
// Stored value format
'["Item 1","Item 2","Item 3"]'

// Accessing in JavaScript
const listInput = document.querySelector('input[type="list"]');
const items = JSON.parse(listInput.value);
\`\`\``);
  } else if (component.id === 'pin') {
    parts.push(`\n## Behavior

### Input Handling

- Accepts only numeric digits (0-9)
- Auto-advances to next box after digit entry
- Auto-focuses previous box on backspace
- Paste support for full PIN codes
- Individual box selection with mouse click

### Keyboard Shortcuts

- Type digit: Fills current box and moves to next
- Backspace: Clears current box and moves to previous
- Arrow keys: Navigate between boxes
- Paste: Fills all boxes from clipboard
- Tab: Moves focus out of component

### Value Management

The component stores the complete PIN as a string:
\`\`\`javascript
// Accessing PIN value
const pinInput = document.querySelector('input[type="pin"]');
console.log(pinInput.value); // "123456"
\`\`\``);
  } else if (component.id === 'signature') {
    parts.push(`\n## Behavior

### Drawing

- **Mouse**: Click and drag to draw
- **Touch**: Touch and drag with finger or stylus
- **Smooth lines**: Automatic line smoothing for better appearance
- **Real-time preview**: See signature as you draw

### Value Storage

The component stores the signature as a base64-encoded PNG:

\`\`\`javascript
const signatureInput = document.querySelector('input[type="signature"]');

// After drawing
console.log(signatureInput.value);
// Output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

// To display the signature
const img = document.createElement('img');
img.src = signatureInput.value;
document.body.appendChild(img);
\`\`\`

### Clearing

To programmatically clear the signature:

\`\`\`javascript
const signatureInput = document.querySelector('input[type="signature"]');
signatureInput.value = '';
signatureInput.dispatchEvent(new Event('change'));
\`\`\``);
  } else if (component.id === 'passkey') {
    parts.push(`\n## Behavior

### Registration Flow

1. User clicks the passkey input button
2. Browser prompts for biometric/security key authentication
3. Passkey is created and stored securely by the browser
4. Public key is emitted via \`change\` event
5. Button text changes to indicate registered state

### Verification Flow

1. User clicks registered passkey button
2. Browser prompts for authentication
3. User verifies with biometric/security key
4. Passkey is validated against stored credential

### Removal Flow

1. Click registered passkey button
2. Verify with biometric/security key
3. Passkey is removed from storage
4. Empty \`change\` event is emitted`);
  } else if (component.id === 'select') {
    parts.push(`\n## Features

### Search Functionality

- Type to filter options in real-time
- Case-insensitive search
- Highlights matching text
- Works with grouped options

### Multi-Select

- Select multiple options
- Visual tags for selected items
- Remove individual selections
- Clear all button

### Option Grouping

- Organize options into logical groups
- Group headers in dropdown
- Improved navigation for large option sets

### Value Types

- String values (default)
- Numeric values with \`data-type="number"\`
- Boolean values with \`data-type="boolean"\``);
  }

  // Events
  parts.push(`\n## Events

### Standard HTML Events

${generateEventsTable(component.events)}

### Example Event Handling

(See original documentation for examples)`);

  // Accessibility
  parts.push(`\n## Accessibility

This component follows WAI-ARIA best practices:

- Supports standard \`aria-label\`, \`aria-describedby\`, and \`aria-required\` attributes
- Compatible with screen readers
- Full keyboard navigation support
- Proper focus management
- ${component.element === 'textarea' ? 'Inherits all standard textarea accessibility features' : component.element === 'select' ? 'Inherits all standard select accessibility features' : 'Behaves like a native HTML input element'}
`);

  // Security (for passkey and pin)
  if (component.id === 'passkey') {
    parts.push(`\n## Security Considerations

- **Private key never exposed**: Private keys remain in secure hardware
- **Phishing resistant**: Passkeys are bound to specific domains
- **Device-bound**: Credentials stored securely on user's device
- **Biometric optional**: Can use PIN or other authentication methods
- **No password transmission**: More secure than traditional passwords`);
  } else if (component.id === 'pin') {
    parts.push(`\n## Security Considerations

- **Input masking**: Consider using \`inputmode="numeric"\` for mobile keyboards
- **Auto-clear on error**: Clear PIN after failed attempts
- **Rate limiting**: Implement server-side rate limiting
- **Secure transmission**: Always use HTTPS
- **No client-side validation**: Verify PINs server-side only

\`\`\`html
<!-- With numeric keyboard on mobile -->
<input 
  type="pin" 
  name="pin" 
  data-size="6" 
  inputmode="numeric"
/>
\`\`\``);
  }

  // Server-side handling (for signature)
  if (component.id === 'signature') {
    parts.push(`\n## Server-Side Handling

### Saving Signatures

\`\`\`javascript
// Frontend
async function saveSignature(base64Image) {
  const response = await fetch('/api/signatures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signature: base64Image })
  });
  return response.json();
}

// Backend (Node.js example)
app.post('/api/signatures', (req, res) => {
  const { signature } = req.body;
  
  // Remove data:image/png;base64, prefix
  const base64Data = signature.replace(/^data:image\\/png;base64,/, '');
  
  // Convert to buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Save to file
  fs.writeFileSync('signature.png', buffer);
  
  res.json({ success: true });
});
\`\`\`

### Converting to Image

\`\`\`javascript
// Convert base64 to Blob
function base64ToBlob(base64, mimeType = 'image/png') {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: mimeType });
}

// Upload as file
const blob = base64ToBlob(signatureInput.value);
const formData = new FormData();
formData.append('signature', blob, 'signature.png');
\`\`\``);
  }

  // Vue script tag
  if (component.demo?.component === 'SignatureDemo') {
    parts.push(`\n<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
  import SignatureDemo from './../../vue/SignatureDemo.vue'
</script>`);
  } else {
    parts.push(`\n<script setup lang='ts'>
  import FormDemo from './../../vue/FormDemo.vue';
</script>`);
  }

  return parts.join('\n');
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating component documentation from JSON...\n');

  let generated = 0;
  let errors = 0;

  for (const component of data.components) {
    try {
      const markdown = generateComponentDoc(component);
      const outputPath = path.join(
        __dirname,
        `../../components/${component.category}/${component.id}.md`
      );

      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(outputPath, markdown);
      console.log(`✅ Generated: ${component.category}/${component.id}.md`);
      generated++;
    } catch (error) {
      console.error(`❌ Error generating ${component.id}:`, error.message);
      errors++;
    }
  }

  console.log(`\n🎉 Generated ${generated} documentation files`);
  if (errors > 0) {
    console.log(`⚠️  ${errors} errors occurred`);
  }
}

// Run the script
main();
