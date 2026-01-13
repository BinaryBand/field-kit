from pathlib import Path
import subprocess
import shutil
import re


def load_env_file(env_path):
    """Load environment variables from .env file (pure Python, no dependencies)."""
    assert env_path.exists(), f".env file not found at {env_path}"

    env_vars = {}
    pattern = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$")

    for line in env_path.read_text().splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue

        if match := pattern.match(line):
            key, value = match.groups()
            # Remove surrounding quotes if present
            value = re.sub(r'^["\']|["\']$', "", value.strip())
            env_vars[key] = value

    return env_vars


# Paths
ROOT = Path(__file__).parent.parent
DIST = ROOT / "dist"
SRC = ROOT / "src"
DOCS_DIST = ROOT / "docs" / ".vitepress" / "dist"

# Load configuration from .env file
env_path = Path(__file__).parent / ".env"
env_vars = load_env_file(env_path)

if env_vars:
    print(f"✓ Loaded configuration from {env_path}\n")
    CLIENT = Path(env_vars.get("CLIENT_PATH", ""))
    DOCS = Path(env_vars.get("DOCS_PATH", ""))
    REF = Path(env_vars.get("REF_PATH", ""))

    # Validate that paths are configured
    if not CLIENT or not DOCS or not REF:
        print("ERROR: Missing required paths in .env file")
        print("Please copy .env.example to .env and configure your paths")
        exit(1)
else:
    print("ERROR: No .env file found")
    print("Please copy runbooks/.env.example to runbooks/.env and configure your paths")
    exit(1)


def load_gitignore():
    """Load exclusion patterns from .gitignore."""
    patterns = {"__pycache__", "*.pyc", ".git"}
    gitignore = ROOT / ".gitignore"

    if gitignore.exists():
        for line in gitignore.read_text().splitlines():
            # Strip whitespace and leading slashes, skip empty lines and comments
            line = re.sub(r"^\s*/*\s*|\s*$", "", line)
            if line and not line.startswith(("#", "!")):
                patterns.add(line)

    return patterns


def main():
    print("Building and deploying tw-client...\n")

    # Build project
    if DIST.exists():
        shutil.rmtree(DIST)

    subprocess.run("npm run build", shell=True, check=True, cwd=ROOT)
    print("✓ Build complete\n")

    # Build docs (optional - continues on failure)
    try:
        if DOCS_DIST.exists():
            shutil.rmtree(DOCS_DIST)

        subprocess.run("npm run docs:build", shell=True, check=True, cwd=ROOT)
        print("✓ Docs build complete\n")
        docs_success = True
    except subprocess.CalledProcessError:
        print("⚠ Docs build failed (skipping docs deployment)\n")
        docs_success = False

    # Deploy compiled
    if CLIENT.exists():
        shutil.rmtree(CLIENT)
    shutil.copytree(DIST, CLIENT)
    print(f"✓ Deployed to {CLIENT}\n")

    # Deploy docs (only if build succeeded)
    if docs_success:
        if DOCS.exists():
            shutil.rmtree(DOCS)
        shutil.copytree(DOCS_DIST, DOCS)
        print(f"✓ Deployed docs to {DOCS}\n")

    # Deploy source
    if REF.exists():
        shutil.rmtree(REF)
    patterns = load_gitignore()
    shutil.copytree(SRC, REF, ignore=shutil.ignore_patterns(*patterns))
    print(f"✓ Deployed to {REF}\n")

    print("Done!")


if __name__ == "__main__":
    main()
