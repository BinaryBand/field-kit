#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { markdownTable, renderTemplate, toCode } from './_shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'components.json');
const templatePath = path.join(root, 'templates', 'component-template.template.md');
const outPathDefault = path.join(root, 'templates', 'component-template.md');

function parseArgs(argv) {
  const out = { id: undefined, outPath: undefined };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--id' && argv[i + 1]) {
      out.id = argv[i + 1];
      i++;
      continue;
    }
    if (arg.startsWith('--id=')) {
      out.id = arg.slice('--id='.length);
      continue;
    }
    if (arg === '--out' && argv[i + 1]) {
      out.outPath = argv[i + 1];
      i++;
      continue;
    }
    if (arg.startsWith('--out=')) {
      out.outPath = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      out.help = true;
    }
  }

  return out;
}

// markdownTable/toCode/renderTemplate live in _shared.js

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: node docs/.vitepress/scripts/render-component-template.js [--id <componentId>] [--out <path>]

Renders docs/.vitepress/templates/component-template.template.md using docs/.vitepress/data/components.json.

Examples:
  node docs/.vitepress/scripts/render-component-template.js --id pin
  node docs/.vitepress/scripts/render-component-template.js --id select --out docs/.vitepress/templates/component-template.select.md
`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const template = fs.readFileSync(templatePath, 'utf8');

  const components = Array.isArray(data?.components) ? data.components : [];
  if (components.length === 0) {
    console.error('No components found in components.json');
    process.exitCode = 1;
    return;
  }

  const component = args.id
    ? components.find((c) => c.id === args.id)
    : components[0];

  if (!component) {
    console.error(`Component not found: ${args.id}`);
    console.error(`Available ids: ${components.map((c) => c.id).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const cssClassesTable = markdownTable(
    ['Class', 'Description'],
    (component.cssClasses || []).map((c) => ({
      Class: toCode(c.class),
      Description: c.description ?? '',
    }))
  );

  const attributesTable = markdownTable(
    ['Attribute', 'Type', 'Default', 'Description'],
    (component.attributes || []).map((a) => ({
      Attribute: toCode(a.name),
      Type: toCode(a.type),
      Default: toCode(a.default),
      Description: a.description ?? '',
    }))
  );

  const optionAttributesTable = markdownTable(
    ['Attribute', 'Type', 'Default', 'Description'],
    (component.optionAttributes || []).map((a) => ({
      Attribute: toCode(a.name),
      Type: toCode(a.type),
      Default: toCode(a.default ?? 'undefined'),
      Description: a.description ?? '',
    }))
  );

  const eventsTable = markdownTable(
    ['Event', 'When Triggered', 'Event Data'],
    (component.events || []).map((e) => ({
      Event: toCode(e.event),
      'When Triggered': e.trigger ?? '',
      'Event Data': e.data ?? '',
    }))
  );

  const demoHtml =
    component.demo?.html ||
    component.demo?.single ||
    component.demo?.multiple ||
    component.demo?.grouped ||
    component.basicUsage ||
    '';

  const notesBlock = component.notes ? `> **Note:** ${component.notes}\n` : '';

  const view = {
    name: component.name ?? component.id,
    description: component.description ?? '',
    basicUsage: component.basicUsage ?? '',
    demoHtml,
    cssClassesTable,
    attributesTable,
    optionAttributesTable,
    eventsTable,
    notesBlock,
  };

  const rendered = renderTemplate(template, view);

  const outPath = args.outPath
    ? path.resolve(process.cwd(), args.outPath)
    : outPathDefault;

  fs.writeFileSync(outPath, rendered, 'utf8');
  console.log(`Wrote: ${outPath}`);
}

main();
