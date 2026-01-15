#!/usr/bin/env node

import fs from 'fs';

export function markdownTable(headers, rows, { empty = '_None_' } = {}) {
  if (!rows || rows.length === 0) return empty;

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows
    .map((row) => `| ${headers.map((h) => row[h] ?? '').join(' | ')} |`)
    .join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

export function toCode(value) {
  if (value === undefined || value === null) return '`undefined`';
  const s = String(value);
  return `\`${s.replace(/`/g, '\\`')}\``;
}

export function renderTemplate(template, view) {
  let out = template;

  out = out.replace(/\{\{\{\s*([a-zA-Z0-9_]+)\s*\}\}\}/g, (_, key) => {
    return view[key] ?? '';
  });

  out = out.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return view[key] ?? '';
  });

  return out;
}

export function safeReadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
