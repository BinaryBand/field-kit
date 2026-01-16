#!/usr/bin/env node

/**
 * Generate component documentation pages from JSON data.
 *
 * Default behavior:
 * - Generates pages for INPUT components only
 * - Writes to: docs/inputs/<id>.md
 * - Overwrites previously-generated files
 *
 * Usage:
 *   node docs/.vitepress/scripts/generate-component-pages.js
 *   node docs/.vitepress/scripts/generate-component-pages.js --category views
 *   node docs/.vitepress/scripts/generate-component-pages.js --category inputs --clean
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { markdownTable, renderTemplate, safeReadJson, toCode } from './_shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VITEPRESS_ROOT = path.resolve(__dirname, '..');
const REPO_DOCS_ROOT = path.resolve(VITEPRESS_ROOT, '..');

const dataPath = path.join(VITEPRESS_ROOT, 'data', 'components.json');
const templatePath = path.join(VITEPRESS_ROOT, 'templates', 'component-template.template.md');

const GENERATED_MARKER = '<!-- AUTO-GENERATED: docs/.vitepress/data/components.json -->';

function parseArgs(argv) {
  const out = {
    category: 'inputs',
    clean: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') out.help = true;

    if (arg === '--clean') out.clean = true;

    if (arg === '--category' && argv[i + 1]) {
      out.category = argv[i + 1];
      i++;
      continue;
    }
    if (arg.startsWith('--category=')) {
      out.category = arg.slice('--category='.length);
      continue;
    }
  }

  return out;
}

// markdownTable/toCode/renderTemplate/safeReadJson live in _shared.js

function writeFileEnsuringDir(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function isGeneratedFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(GENERATED_MARKER);
  } catch {
    return false;
  }
}

function cleanStaleGeneratedFiles(outputDir, keepBasenames) {
  if (!fs.existsSync(outputDir)) return;

  const entries = fs.readdirSync(outputDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.md')) continue;

    const fullPath = path.join(outputDir, entry.name);
    if (!isGeneratedFile(fullPath)) continue;

    const basename = entry.name.slice(0, -'.md'.length);
    if (keepBasenames.has(basename)) continue;

    fs.unlinkSync(fullPath);
  }
}

function componentToView(component) {
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

  return {
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
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: node docs/.vitepress/scripts/generate-component-pages.js [--category inputs|views] [--clean]

Generates markdown pages under docs/<category>/<id>.md from docs/.vitepress/data/components.json.

Examples:
  node docs/.vitepress/scripts/generate-component-pages.js
  node docs/.vitepress/scripts/generate-component-pages.js --category=inputs --clean
`);
    return;
  }

  if (args.category !== 'inputs' && args.category !== 'views') {
    console.error(`Invalid --category: ${args.category} (expected inputs|views)`);
    process.exitCode = 1;
    return;
  }

  const data = safeReadJson(dataPath);
  const template = fs.readFileSync(templatePath, 'utf8');

  const components = Array.isArray(data?.components) ? data.components : [];
  const selected = components.filter((c) => c.category === args.category);

  if (selected.length === 0) {
    console.error(`No components found for category: ${args.category}`);
    process.exitCode = 1;
    return;
  }

  const outputDir = path.join(REPO_DOCS_ROOT, args.category);

  const ids = new Set(selected.map((c) => c.id));
  if (args.clean) {
    cleanStaleGeneratedFiles(outputDir, ids);
  }

  for (const component of selected) {
    const view = componentToView(component);
    const rendered = renderTemplate(template, view);

    const outPath = path.join(outputDir, `${component.id}.md`);

    // Place marker after the frontmatter to keep YAML valid.
    const content = rendered.replace(/^(---[\s\S]*?---\s*)/m, `$1\n${GENERATED_MARKER}\n\n`);

    writeFileEnsuringDir(outPath, content);
  }

  console.log(`✅ Generated ${selected.length} ${args.category} pages in: ${path.relative(process.cwd(), outputDir)}`);
}

main();
