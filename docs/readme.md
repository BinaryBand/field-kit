# TW Components Documentation

This directory contains the VitePress documentation for TW Components. The documentation has been reorganized following best practices and includes automated tooling for adding new component documentation.

## Documentation Structure

```
docs/
├── .vitepress/
│   ├── config.ts              # Main VitePress configuration
│   ├── utils/
│   │   └── sidebar.ts         # Automated sidebar generation
│   ├── templates/
│   │   └── component-template.template.md  # Markdown template used by the page generator
│   └── scripts/
│       ├── generate-component-docs.js   # Validates components.json
│       └── generate-component-pages.js  # Generates docs/components/* pages
├── guide/                     # Getting started guides
│   ├── getting-started.md
│   ├── installation.md
│   └── quick-start.md
├── components/                # Component documentation
│   ├── index.md              # Components overview
│   ├── inputs/               # Input components
│   └── views/                # View components
├── examples/                  # Usage examples (planned)
└── vue/                      # Vue demo components
```

## Development

### Running the Documentation

```bash
# Start the development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

### Adding / Updating Component Documentation

Component docs are generated from JSON.

1. Edit `docs/.vitepress/data/components.json`
2. Regenerate pages:

```bash
npm run docs:pages
```

To validate the JSON shape before generating pages:

```bash
npm run docs:validate
```

### Documentation Template

The component page template includes:

- **Frontmatter**: Title and description for SEO
- **Demo Section**: Live interactive examples
- **Basic Usage**: Quick start code
- **Properties**: HTML attributes, data attributes, CSS classes
- **Examples**: Various usage scenarios
- **Styling**: CSS custom properties and styling guide
- **Events**: Event handling documentation
- **Accessibility**: ARIA and keyboard support
- **Browser Support**: Compatibility information
- **Use Cases**: When to use this component
- **Related Components**: Cross-references

## Configuration Features

### Enhanced VitePress Configuration

The documentation includes several VitePress best practices:

- **SEO Optimization**: Meta tags, sitemap generation
- **Search**: Local search with custom labels
- **Clean URLs**: Better URL structure
- **Last Updated**: Automatic timestamp tracking
- **Social Links**: GitHub integration
- **Edit Links**: Direct editing on GitHub
- **Footer**: Consistent branding

### Automated Sidebar

The sidebar is automatically generated from `sidebar.ts`, making it easy to:

- Add new components without manual configuration
- Maintain consistent navigation structure
- Group components by category
- Provide clear hierarchical organization

> Note: Component docs are generated from JSON; no interactive generator script is used by `docs:build`.

### Responsive Design

The documentation is fully responsive and includes:

- Mobile-friendly navigation
- Collapsible sidebar sections
- Optimized reading experience across devices
- Touch-friendly interactive elements

## Content Guidelines

### Writing Style

- Use clear, concise language
- Include practical examples
- Provide both basic and advanced usage scenarios
- Explain "why" not just "how"
- Include accessibility considerations

### Code Examples

- Always include working HTML examples
- Show form integration patterns
- Provide JavaScript event handling examples
- Include CSS customization examples
- Test all examples before documenting

### Component Documentation

Each component page should include:

1. **Clear Description**: What the component does and why use it
2. **Live Demo**: Interactive example users can test
3. **Basic Usage**: Minimal working example
4. **Full API Reference**: All properties and options
5. **Real-world Examples**: Common integration patterns
6. **Styling Guide**: How to customize appearance
7. **Accessibility Info**: ARIA support and keyboard interaction
8. **Browser Support**: Compatibility matrix

## Deployment

The documentation is deployed to GitHub Pages automatically when changes are pushed to the main branch. The build process:

1. Runs `npm run docs:build`
2. Generates static files in `.vitepress/dist`
3. Deploys to GitHub Pages
4. Updates at the configured base URL

## Best Practices

### Adding New Components

When you create a new component in your project:

1. **Use the automation script** to create documentation
2. **Add a demo** to the FormDemo.vue component
3. **Update properties and examples** with accurate information
4. **Test all code examples** to ensure they work
5. **Include accessibility information**
6. **Add related component links**

### Maintaining Documentation

- Keep examples up to date with component changes
- Update browser support information regularly
- Review and improve content based on user feedback
- Ensure all links work and point to correct locations
- Test documentation builds before deploying

### Performance

- Optimize images and media files
- Use VitePress features for better performance
- Minimize external dependencies
- Test loading times on various devices
- Monitor bundle size impact

## Migration Notes

This reorganized documentation structure provides:

- **Better Navigation**: Logical grouping of content
- **Easier Maintenance**: Automated tooling for new components
- **Better SEO**: Improved meta tags and structure
- **Enhanced UX**: Better mobile experience and search
- **Scalability**: Easy to add new sections and components

The old structure is preserved in git history, and existing links will be redirected appropriately.
