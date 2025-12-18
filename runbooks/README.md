# Runbooks

Automation scripts for building and deploying the tw-components project.

## Setup

### 1. Configure Environment Variables

Copy the example environment file and configure your local paths:

```bash
# Copy the template
cp runbooks/.env.example runbooks/.env

# Edit runbooks/.env with your paths
# Example paths:
# CLIENT_PATH=C:/Users/YourName/source/repos/YourProject/wwwroot/lib/tw-client
# DOCS_PATH=C:/Users/YourName/source/repos/YourProject/wwwroot/docs
# REF_PATH=C:/Users/YourName/source/repos/YourProject/.tw-ref
```

**Important:** The `.env` file is gitignored and contains your device-specific paths. Never commit it to version control.

### 2. Requirements

These scripts use **pure Python** (no external dependencies required):
- Python 3.6+
- Standard library only (pathlib, subprocess, shutil, os)

## Scripts

### `build-external.py`

Builds and deploys the project to external locations.

**What it does:**
1. Builds the project (`npm run build`)
2. Builds the documentation (`npm run docs:build`)
3. Deploys compiled files to `CLIENT_PATH`
4. Deploys documentation to `DOCS_PATH`
5. Copies source files to `REF_PATH` (excluding gitignored files)

**Usage:**
```bash
python runbooks/build-external.py
```

**Requirements:**
- Configured `.env` file with valid paths
- npm dependencies installed (`npm install`)

### `clean.py`

Removes all files and directories matching `.gitignore` patterns.

**What it does:**
- Reads patterns from `.gitignore`
- Recursively removes matching files and directories
- Skips `.git` directory
- Reports all removed items

**Usage:**
```bash
python runbooks/clean.py
```

**Use cases:**
- Clean up after development
- Remove build artifacts
- Prepare for fresh build
- Clean before commit

## Configuration

### `.env` File Format

```bash
# Comments start with #
CLIENT_PATH=C:/absolute/path/to/deployment/location
DOCS_PATH=C:/absolute/path/to/docs/location
REF_PATH=C:/absolute/path/to/reference/location
```

**Variables:**
- `CLIENT_PATH` - Where to deploy compiled library files
- `DOCS_PATH` - Where to deploy built documentation
- `REF_PATH` - Where to copy source files for reference

### Path Requirements

- Use forward slashes (`/`) or escaped backslashes (`\\`)
- Use absolute paths (not relative)
- Ensure parent directories exist
- Scripts will create target directories if needed

## Troubleshooting

### "ERROR: No .env file found"

Solution: Copy `.env.example` to `.env` and configure your paths:
```bash
cp runbooks/.env.example runbooks/.env
# Edit runbooks/.env with your paths
```

### "ERROR: Missing required paths in .env file"

Solution: Ensure all three paths are configured in `.env`:
- CLIENT_PATH
- DOCS_PATH
- REF_PATH

### Build fails

- Verify npm dependencies are installed: `npm install`
- Check that Node.js is available: `node --version`
- Ensure you're in the project root directory

### Deployment fails

- Verify paths in `.env` are correct and accessible
- Ensure you have write permissions to target directories
- Check that parent directories exist

## Best Practices

1. **Never commit `.env`** - It contains device-specific paths
2. **Keep `.env.example` updated** - When adding new variables
3. **Use absolute paths** - Relative paths may cause issues
4. **Test before committing** - Run scripts to verify they work
5. **Document changes** - Update this README when modifying scripts

## Security

- `.env` is gitignored to prevent committing sensitive paths
- `.env.example` contains placeholder paths only
- No credentials or secrets should be in these scripts
- Scripts run with your user permissions

## Development

To modify these scripts:

1. Test locally with your `.env` configuration
2. Keep `.env.example` in sync with required variables
3. Update this README with changes
4. Use pure Python (no external dependencies)
5. Handle errors gracefully with clear messages

## Support

If you encounter issues:
1. Check this README for troubleshooting steps
2. Verify your `.env` configuration
3. Ensure Python 3.6+ is installed
4. Check file permissions for target directories
