#!/usr/bin/env node
/**
 * Script to update guide.md with auto-generated component lists from components.json
 * CommonJS version for Node.js with "type": "module"
 */

const fs = require('fs');
const path = require('path');

const guidePath = path.join(__dirname, '../../guide.md');
const dataPath = path.join(__dirname, '../data/components.json');

function generateInputList(components) {
  return components
    .filter(c => c.category === 'inputs')
    .map(c => `- **${c.name}**: ${c.description}`)
    .join('\n');
}

function generateViewList(components) {
  return components
    .filter(c => c.category === 'views')
    .map(c => `- **${c.name}**: ${c.description}`)
    .join('\n');
}

function updateGuide() {
  const guideFile = fs.readFileSync(guidePath, 'utf8');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const inputList = generateInputList(data.components);
  const viewList = generateViewList(data.components);

  let updated = guideFile.replace(/%INPUT_COMPONENTS_LIST%/g, inputList || '_No input components found._');
  updated = updated.replace(/%VIEW_COMPONENTS_LIST%/g, viewList || '_No view components found._');

  fs.writeFileSync(guidePath, updated);
  console.log('guide/index.md updated with auto-generated component lists.');
}

updateGuide();
