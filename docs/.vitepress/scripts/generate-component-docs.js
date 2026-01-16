#!/usr/bin/env node

/**
 * Validate docs/.vitepress/data/components.json
 * Usage: node generate-component-docs.js
 */
import path from 'path';
import { fileURLToPath } from 'url';

import { safeReadJson } from './_shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/components.json');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * Main function
 */
function main() {
  console.log('ℹ️  Component docs are now rendered from JSON at /.');
  console.log('🔎 Validating components.json...');

  const data = safeReadJson(dataPath);
  const components = Array.isArray(data?.components) ? data.components : [];
  if (components.length === 0) {
    return fail('No components found in components.json');
  }

  const ids = new Set();
  const missing = [];
  const invalidCategory = [];
  const duplicateIds = [];

  for (const c of components) {
    const id = c?.id;
    const label = isNonEmptyString(id) ? id : '(unknown)';

    if (!isNonEmptyString(c?.id) || !isNonEmptyString(c?.name) || !isNonEmptyString(c?.category) || !isNonEmptyString(c?.description) || !isNonEmptyString(c?.selector) || !isNonEmptyString(c?.basicUsage)) {
      missing.push(label);
    }

    if (isNonEmptyString(c?.category) && c.category !== 'inputs' && c.category !== 'views') {
      invalidCategory.push(`${label} (${c.category})`);
    }

    if (isNonEmptyString(id)) {
      if (ids.has(id)) duplicateIds.push(id);
      ids.add(id);
    }
  }

  if (missing.length) {
    return fail(`${missing.length} components are missing required fields: ${missing.join(', ')}`);
  }

  if (invalidCategory.length) {
    return fail(`${invalidCategory.length} components have invalid category (expected inputs|views): ${invalidCategory.join(', ')}`);
  }

  if (duplicateIds.length) {
    return fail(`Duplicate component ids found: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  console.log(`✅ OK: ${components.length} components`);
}

// Run the script
main();
