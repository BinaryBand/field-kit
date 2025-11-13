#!/usr/bin/env node

/**
 * Script to create new component documentation from template
 * Usage: node create-component-docs.js <component-name> <category>
 * Example: node create-component-docs.js range-input inputs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toCamelCase(str) {
  return str
    .split(/[-_\s]/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

async function createComponentDocs() {
  console.log('🚀 TW Components Documentation Generator\n');

  try {
    // Get component information
    const componentName = await question('Component name (e.g., "range-input", "color-picker"): ');
    if (!componentName.trim()) {
      console.error('❌ Component name is required');
      process.exit(1);
    }

    const category = (await question('Category (inputs/views) [inputs]: ')) || 'inputs';
    if (!['inputs', 'views'].includes(category)) {
      console.error('❌ Category must be "inputs" or "views"');
      process.exit(1);
    }

    const description = (await question('Brief description: ')) || `A ${componentName} component`;
    const htmlType =
      (await question('HTML type/selector (e.g., "range", "color") [auto]: ')) ||
      toKebabCase(componentName).replace('-input', '').replace('-component', '');

    console.log('\n📝 Creating component documentation...\n');

    // Prepare template variables
    const kebabName = toKebabCase(componentName);
    const pascalName = toPascalCase(componentName);
    const camelName = toCamelCase(componentName);

    // Read template
    const templatePath = path.join(__dirname, '../templates/component-template.md');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    const content = template
      .replace(/Component Name/g, pascalName)
      .replace(/Brief description of what this component does/g, description)
      .replace(
        /selector-for-component/g,
        category === 'inputs' ? `input[type="${htmlType}"]` : `.tw-${kebabName}`
      )
      .replace(/type="example"/g, `type="${htmlType}"`)
      .replace(/input\[type="example"\]/g, `input[type="${htmlType}"]`)
      .replace(/input\[type='example'\]/g, `input[type='${htmlType}']`)
      .replace(/componentName/g, camelName)
      .replace(/data-example/g, `data-${kebabName}`)
      .replace(/tw-example/g, `tw-${kebabName}`)
      .replace(/--tw-example/g, `--tw-${kebabName}`);

    // Create directory if it doesn't exist
    const docsDir = path.join(__dirname, `../../components/${category}`);
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Write component documentation
    const filePath = path.join(docsDir, `${kebabName}.md`);
    fs.writeFileSync(filePath, content);

    console.log(
      `✅ Created component documentation at: docs/components/${category}/${kebabName}.md`
    );

    // Update sidebar configuration
    const sidebarPath = path.join(__dirname, '../utils/sidebar.ts');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

    const categoryText = category === 'inputs' ? 'Input Components' : 'View Components';
    const linkPath = `/components/${category}/${kebabName}`;
    const newItem = `          { text: '${pascalName}', link: '${linkPath}' },`;

    // Find the right section and add the new component
    const sectionRegex = new RegExp(
      `(text: '${categoryText}',[\\s\\S]*?items: \\[[\\s\\S]*?)(\\s*\\])`
    );
    const updatedSidebarContent = sidebarContent.replace(sectionRegex, `$1${newItem}\n$2`);

    fs.writeFileSync(sidebarPath, updatedSidebarContent);
    console.log(`✅ Updated sidebar configuration`);

    console.log('\n🎉 Component documentation created successfully!');
    console.log('\nNext steps:');
    console.log(`1. Edit docs/components/${category}/${kebabName}.md to customize the content`);
    console.log('2. Add your component demo to the FormDemo.vue component');
    console.log('3. Update the component properties and examples');
    console.log('4. Test the documentation with: npm run docs:dev');
  } catch (error) {
    console.error('❌ Error creating component documentation:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createComponentDocs();
