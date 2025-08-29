import '../src/index.js';

// Configure Prism plugins before initialization
if (window.Prism) {
  // Configure Normalize Whitespace plugin with minimal processing
  window.Prism.plugins.NormalizeWhitespace.setDefaults({
    'remove-trailing': true,
    'remove-indent': false,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 120,
    'indent': 0,
    'remove-initial-line-feed': true,
    'tabs-to-spaces': 0,
    'normalize': false,
  });
}

class SimpleCodeManager {
  constructor() {
    this.init();
  }

  init() {
    // Initialize select options and signature controls
    this.initializeSelectOptions();
    this.initializeSignatureControls();

    // Create code demos for existing elements
    this.createCodeDemos();
  }

  createCodeDemos() {
    const codeDemos = document.querySelectorAll('.code-demo');

    codeDemos.forEach((demo) => {
      const targetQuery = demo.getAttribute('data-target');
      const target = document.querySelector(targetQuery);

      if (target) {
        const cleanedCode = this.getCleanedCode(target);
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        // Let Prism plugins handle styling and copy functionality
        pre.className = 'mt-3 line-numbers';
        code.className = 'language-html';
        code.textContent = cleanedCode;

        pre.appendChild(code);
        demo.appendChild(pre);
      }
    });

    // Let Prism handle all processing
    setTimeout(() => {
      if (window.Prism) {
        window.Prism.highlightAll();
      }
    }, 100);
  }

  getCleanedCode(element) {
    // Build clean HTML from element structure instead of using problematic outerHTML
    return this.elementToCleanHTML(element, 0);
  }

  elementToCleanHTML(element, indentLevel = 0) {
    const tab = '  ';
    const indent = tab.repeat(indentLevel);
    let html = '';

    // Build opening tag
    let openTag = `<${element.tagName.toLowerCase()}`;

    // Add attributes
    for (const attr of element.attributes) {
      if (attr.name === 'class') {
        // Filter classes to only TW-related ones
        const cleanClasses = attr.value
          .split(/\s+/)
          .filter(
            (cls) =>
              cls.startsWith('tw-') ||
              cls.startsWith('data-tw-') ||
              cls.startsWith('calendar-') ||
              cls === 'small' ||
              cls === 'text-secondary'
          )
          .join(' ')
          .trim();

        if (cleanClasses) {
          openTag += ` class="${cleanClasses}"`;
        }
      } else if (!attr.name.startsWith('data-') || attr.name.startsWith('data-tw-')) {
        // Include non-data attributes and TW data attributes
        const value = attr.value;
        if (attr.name === 'selected' || attr.name === 'disabled' || attr.name === 'multiple') {
          // Boolean attributes
          if (value !== null && value !== 'false') {
            openTag += ` ${attr.name}`;
          }
        } else {
          openTag += ` ${attr.name}="${value}"`;
        }
      }
    }

    // Check if it's a void/self-closing element
    const voidElements = [
      'input',
      'br',
      'hr',
      'img',
      'meta',
      'link',
      'area',
      'base',
      'col',
      'embed',
      'param',
      'source',
      'track',
      'wbr',
    ];
    const isVoidElement = voidElements.includes(element.tagName.toLowerCase());

    if (isVoidElement) {
      html += indent + openTag + '>';
    } else {
      html += indent + openTag + '>\n';

      // Add children
      for (const child of element.children) {
        html += this.elementToCleanHTML(child, indentLevel + 1);
      }

      // Add text content if any (and no children)
      if (element.children.length === 0 && element.textContent.trim()) {
        const textLines = element.textContent.trim().split('\n');
        for (const line of textLines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            html += tab.repeat(indentLevel + 1) + trimmedLine + '\n';
          }
        }
      }

      // Closing tag
      html += indent + `</${element.tagName.toLowerCase()}>`;
    }

    // Add newline unless this is the root element
    if (indentLevel > 0) {
      html += '\n';
    }

    return html;
  }

  formatHTML(html) {
    // Decode HTML entities first
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    html = textarea.value;

    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // More careful HTML parsing - preserve complete tags on single lines
    const lines = html
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + line + '\n';
      } else if (line.startsWith('<')) {
        // Opening tag or self-closing tag
        formatted += tab.repeat(indent) + line + '\n';

        // Check if it's a self-closing tag or void element
        const isVoidElement =
          /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[^>]*>/i.test(
            line
          );
        const isSelfClosing = line.endsWith('/>');
        const hasClosingTag = line.includes('</');

        if (!isVoidElement && !isSelfClosing && !hasClosingTag) {
          indent++;
        }
      } else if (line.trim()) {
        // Text content
        formatted += tab.repeat(indent) + line + '\n';
      }
    }

    return formatted.trim();
  }

  initializeSelectOptions() {
    const template = document.getElementById('select-option-template');
    if (!(template instanceof HTMLTemplateElement)) return;

    document.querySelectorAll('.tw-select-group').forEach((select) => {
      const clone = template.content.cloneNode(true);
      select.appendChild(clone);
    });
  }

  initializeSignatureControls() {
    const signatureInput = document.querySelector("input[type='signature']");
    const clearButton = document.querySelector('#clear-signature-button');

    if (clearButton && signatureInput) {
      clearButton.addEventListener('click', () => {
        signatureInput.value = '';
        signatureInput.dispatchEvent(new Event('change'));
      });
    }
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SimpleCodeManager();
  });
} else {
  new SimpleCodeManager();
}

export { SimpleCodeManager };
