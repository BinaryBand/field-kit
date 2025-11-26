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
  // Live demo with real-time value display
  const inputHtml = component.demo?.html || component.basicUsage || '';
  return `<FormDemo>
  ${inputHtml}
  <template #value="{ value }">
    <div style='margin-top:1em;'><strong>Current Value:</strong> <code>{{ value }}</code></div>
  </template>
</FormDemo>`;
}

/**
 * Generate complete component documentation
 */
function generateComponentDoc(component) {
  // Uniform template: all sections always present
  const parts = [];
  parts.push(`---\ntitle: ${component.name}\ndescription: ${component.description}\n---\n\n# ${component.name}\n\n${component.description}${component.notes ? `\n\n**Note:** ${component.notes}` : ''}\n`);

  parts.push(`## Demo\n\n${generateDemoSection(component) || '_No demo available._'}\n`);

  parts.push(`## Basic Usage\n\n\`\`\`html\n${component.basicUsage || '_No usage example available._'}\n\`\`\`\n`);

  parts.push(`## Properties\n`);

  parts.push(`### CSS Classes\n\n${component.cssClasses && component.cssClasses.length > 0 ? generateTable(['Class', 'Description'], component.cssClasses.map((c) => ({ class: `\`${c.class}\``, description: c.description }))) : '_None_'}\n`);

  parts.push(`### HTML Attributes${component.element === 'textarea' ? '\n\nAll standard `textarea` attributes are supported:' : ''}\n\n${generateAttributesTable(component.attributes) || '_None_'}\n`);

  parts.push(`### Option Attributes\n\n${component.optionAttributes ? generateAttributesTable(component.optionAttributes) : '_None_'}\n`);

  parts.push(`### Canvas Properties\n\n${component.canvasProperties ? `Default canvas dimensions (customizable via styling):\n- Width: ${component.canvasProperties.width}\n- Height: ${component.canvasProperties.height}\n- Line width: ${component.canvasProperties.lineWidth}\n- Line color: ${component.canvasProperties.lineColor}` : '_None_'}\n`);

  parts.push(`## Examples\n\n(Examples section - see original documentation)\n`);

  parts.push(`## Behavior\n\n${component.id === 'list' ? `### Adding Items\n\n- Type text and press \`Enter\` to add an item\n- Items are displayed as removable tokens\n- Duplicate items are allowed by default\n\n### Removing Items\n\n- Click the X button on any token to remove it\n- Press \`Backspace\` on empty input to remove last item\n\n### Value Format\n\nThe component stores values as a JSON array string:\n\`\`\`javascript\n// Stored value format\n'["Item 1","Item 2","Item 3"]'\n\n// Accessing in JavaScript\nconst listInput = document.querySelector('input[type="list"]');\nconst items = JSON.parse(listInput.value);\n\`\`\`` : component.id === 'pin' ? `### Input Handling\n\n- Accepts only numeric digits (0-9)\n- Auto-advances to next box after digit entry\n- Auto-focuses previous box on backspace\n- Paste support for full PIN codes\n- Individual box selection with mouse click\n\n### Keyboard Shortcuts\n\n- Type digit: Fills current box and moves to next\n- Backspace: Clears current box and moves to previous\n- Arrow keys: Navigate between boxes\n- Paste: Fills all boxes from clipboard\n- Tab: Moves focus out of component\n\n### Value Management\n\nThe component stores the complete PIN as a string:\n\`\`\`javascript\n// Accessing PIN value\nconst pinInput = document.querySelector('input[type="pin"]');\nconsole.log(pinInput.value); // "123456"\n\`\`\`` : component.id === 'signature' ? `### Drawing\n\n- **Mouse**: Click and drag to draw\n- **Touch**: Touch and drag with finger or stylus\n- **Smooth lines**: Automatic line smoothing for better appearance\n- **Real-time preview**: See signature as you draw\n\n### Value Storage\n\nThe component stores the signature as a base64-encoded PNG:\n\n\`\`\`javascript\nconst signatureInput = document.querySelector('input[type="signature"]');\n\n// After drawing\nconsole.log(signatureInput.value);\n// Output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."\n\n// To display the signature\nconst img = document.createElement('img');\nimg.src = signatureInput.value;\ndocument.body.appendChild(img);\n\`\`\`\n\n### Clearing\n\nTo programmatically clear the signature:\n\n\`\`\`javascript\nconst signatureInput = document.querySelector('input[type="signature"]');\nsignatureInput.value = '';\nsignatureInput.dispatchEvent(new Event('change'));\n\`\`\`` : component.id === 'passkey' ? `### Registration Flow\n\n1. User clicks the passkey input button\n2. Browser prompts for biometric/security key authentication\n3. Passkey is created and stored securely by the browser\n4. Public key is emitted via \`change\` event\n5. Button text changes to indicate registered state\n\n### Verification Flow\n\n1. User clicks registered passkey button\n2. Browser prompts for authentication\n3. User verifies with biometric/security key\n4. Passkey is validated against stored credential\n\n### Removal Flow\n\n1. Click registered passkey button\n2. Verify with biometric/security key\n3. Passkey is removed from storage\n4. Empty \`change\` event is emitted` : component.id === 'select' ? `### Search Functionality\n\n- Type to filter options in real-time\n- Case-insensitive search\n- Highlights matching text\n- Works with grouped options\n\n### Multi-Select\n\n- Select multiple options\n- Visual tags for selected items\n- Remove individual selections\n- Clear all button\n\n### Option Grouping\n\n- Organize options into logical groups\n- Group headers in dropdown\n- Improved navigation for large option sets\n\n### Value Types\n\n- String values (default)\n- Numeric values with \`data-type="number"\`\n- Boolean values with \`data-type="boolean"\`` : '_No specific behavior documented._'}\n`);

  parts.push(`## Events\n\n### Standard HTML Events\n\n${generateEventsTable(component.events) || '_None_'}\n\n### Example Event Handling\n\n(See original documentation for examples)\n`);

  parts.push(`## Accessibility\n\nThis component follows WAI-ARIA best practices:\n\n- Supports standard \`aria-label\`, \`aria-describedby\`, and \`aria-required\` attributes\n- Compatible with screen readers\n- Full keyboard navigation support\n- Proper focus management\n- ${component.element === 'textarea' ? 'Inherits all standard textarea accessibility features' : component.element === 'select' ? 'Inherits all standard select accessibility features' : 'Behaves like a native HTML input element'}\n`);

  parts.push(`## Security Considerations\n\n${component.id === 'passkey' ? `- **Private key never exposed**: Private keys remain in secure hardware\n- **Phishing resistant**: Passkeys are bound to specific domains\n- **Device-bound**: Credentials stored securely on user's device\n- **Biometric optional**: Can use PIN or other authentication methods\n- **No password transmission**: More secure than traditional passwords` : component.id === 'pin' ? `- **Input masking**: Consider using \`inputmode="numeric"\` for mobile keyboards\n- **Auto-clear on error**: Clear PIN after failed attempts\n- **Rate limiting**: Implement server-side rate limiting\n- **Secure transmission**: Always use HTTPS\n- **No client-side validation**: Verify PINs server-side only\n\n\`\`\`html\n<!-- With numeric keyboard on mobile -->\n<input \n  type="pin" \n  name="pin" \n  data-size="6" \n  inputmode="numeric"\n/>\n\`\`\`` : '_No special security considerations for this component._'}\n`);

  parts.push(`## Server-Side Handling\n\n${component.id === 'signature' ? `### Saving Signatures\n\n\`\`\`javascript\n// Frontend\nasync function saveSignature(base64Image) {\n  const response = await fetch('/api/signatures', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ signature: base64Image })\n  });\n  return response.json();\n}\n\n// Backend (Node.js example)\napp.post('/api/signatures', (req, res) => {\n  const { signature } = req.body;\n  \n  // Remove data:image/png;base64, prefix\n  const base64Data = signature.replace(/^data:image\/png;base64,/, '');\n  \n  // Convert to buffer\n  const buffer = Buffer.from(base64Data, 'base64');\n  \n  // Save to file\n  fs.writeFileSync('signature.png', buffer);\n  \n  res.json({ success: true });\n});\n\`\`\`\n\n### Converting to Image\n\n\`\`\`javascript\n// Convert base64 to Blob\nfunction base64ToBlob(base64, mimeType = 'image/png') {\n  const byteString = atob(base64.split(',')[1]);\n  const arrayBuffer = new ArrayBuffer(byteString.length);\n  const uint8Array = new Uint8Array(arrayBuffer);\n  \n  for (let i = 0; i < byteString.length; i++) {\n    uint8Array[i] = byteString.charCodeAt(i);\n  }\n  \n  return new Blob([arrayBuffer], { type: mimeType });\n}\n\n// Upload as file\nconst blob = base64ToBlob(signatureInput.value);\nconst formData = new FormData();\nformData.append('signature', blob, 'signature.png');\n\`\`\`` : '_No server-side handling required for this component._'}\n`);

  // Only import FormDemo for all pages
  parts.push(`## Vue Integration\n\n<script setup lang='ts'>\n  import FormDemo from './../../vue/FormDemo.vue';\n</script>\n`);

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
