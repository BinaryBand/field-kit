# Installation

There are several ways to install and use TW Components in your project. Choose the method that best fits your development workflow.

## Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (comes with Node.js)

You can verify your installations by running:

```bash
node --version
npm --version
```

If you need to install or update npm:

```bash
npm install npm@latest -g
```

## Method 1: Build from Source (Recommended)

This is the recommended approach as it gives you the most control and the latest features.

### Step 1: Clone the Repository

```bash
# Clone the project from GitHub
git clone https://github.com/BinaryBand/bulwark-client-app.git

# Navigate to the project directory
cd bulwark-client-app
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

### Step 3: Build the Library

```bash
# Build the components library
npm run build
```

This creates the compiled files in the `dist/` directory:

- `dist/tw-client.css` - Stylesheet for components
- `dist/main.umd.js` - JavaScript bundle

### Step 4: Include in Your Project

Copy the built files to your project and include them in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Project</title>
    <!-- Include TW Components CSS -->
    <link rel="stylesheet" href="/path/to/tw-client.css" type="text/css" />
  </head>
  <body>
    <!-- Your content here -->

    <!-- Include TW Components JavaScript -->
    <script src="/path/to/main.umd.js" type="text/javascript" defer></script>
  </body>
</html>
```

## Method 2: CDN (Coming Soon)

A CDN distribution will be available in future releases for easier integration:

```html
<!-- This will be available in a future release -->
<link rel="stylesheet" href="https://cdn.example.com/tw-components@latest/tw-client.css" />
<script src="https://cdn.example.com/tw-components@latest/main.umd.js" defer></script>
```

## Method 3: npm Package (Coming Soon)

An npm package distribution is planned for future releases:

```bash
# This will be available in a future release
npm install tw-components
```

## File Structure

After building from source, you'll have these key files:

```
dist/
├── tw-client.css      # Component styles
├── main.umd.js        # UMD JavaScript bundle
├── main.es.js         # ES6 module bundle
└── types/             # TypeScript type definitions
```

## Path Configuration

The paths in your HTML should point to where you've placed the built files:

- **Absolute paths**: `/dist/tw-client.css` (from web root)
- **Relative paths**: `./assets/tw-client.css` (relative to HTML file)
- **Custom paths**: `/static/components/tw-client.css` (your custom structure)

Make sure both the CSS and JavaScript files are accessible from your web server.

## Verification

To verify the installation worked correctly:

1. Include the files in an HTML page
2. Add a simple component like:
   ```html
   <input type="pin" data-size="4" />
   ```
3. Open the page in a browser
4. You should see a 4-digit PIN input component

## Troubleshooting

### Components Not Working

- **Check browser console** for JavaScript errors
- **Verify file paths** are correct and accessible
- **Ensure both CSS and JS** files are included
- **Check file permissions** if using a local server

### Styling Issues

- **Ensure CSS file** is loaded before the page renders
- **Check for CSS conflicts** with existing stylesheets
- **Verify media queries** if using responsive designs

### Build Errors

- **Check Node.js version** (requires 16+)
- **Clear npm cache**: `npm cache clean --force`
- **Delete node_modules**: `rm -rf node_modules && npm install`
- **Check for peer dependencies**: `npm ls`

## Next Steps

Once you have TW Components installed, continue with the [Quick Start Guide](/guide/quick-start) to begin using the components in your project.
