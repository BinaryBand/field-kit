from pathlib import Path
import shutil
import re


ROOT = Path(__file__).parent.parent


def get_patterns():
    """Load patterns from .gitignore."""
    gitignore = ROOT / ".gitignore"
    if not gitignore.exists():
        return set()

    patterns = set()
    for line in gitignore.read_text().splitlines():
        line = re.sub(r"^\s*/*\s*|\s*$", "", line)
        if line and not line.startswith(("#", "!")):
            patterns.add(line)
    return patterns


def matches(path, patterns):
    """Check if path matches any pattern."""
    # Protect .env files
    if path.name == ".env":
        return False

    rel_path = str(path.relative_to(ROOT)).replace("\\", "/")

    for pattern in patterns:
        # Direct name or path match
        if pattern in (path.name, rel_path):
            return True

        # Directory in path
        if pattern in rel_path.split("/"):
            return True

        # Wildcard match
        if "*" in pattern:
            regex = f"^{re.escape(pattern).replace(r'\*', '.*')}$"
            if re.match(regex, path.name) or re.match(regex, rel_path):
                return True

    return False


def clean():
    """Remove gitignored files."""
    patterns = get_patterns()
    count = 0

    print(f"Cleaning {ROOT}\n")

    for item in ROOT.rglob("*"):
        if not item.exists() or ".git" in item.parts:
            continue

        if matches(item, patterns):
            try:
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()
                print(f"✓ {item.relative_to(ROOT)}")
                count += 1
            except Exception as e:
                print(f"✗ {item.relative_to(ROOT)}: {e}")

    print(f"\n✓ Removed {count} items")


if __name__ == "__main__":
    clean()
