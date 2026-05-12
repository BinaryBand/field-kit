"""Runbook: build external artifacts.

This is a no-args runbook script. It always runs the same steps:
1) npm install
2) npm run build
3) Copy build output to LIBRARY_PATH environment variable.
"""

from __future__ import annotations


from dotenv import find_dotenv, load_dotenv
from pathlib import Path
import subprocess
import shutil
import os


def _repo_root() -> Path:
    root = Path(__file__).resolve().parent.parent
    assert (root / "package.json").exists(), f"Could not find package.json: {root}"
    return root


def _run(cmd: list[str], *, cwd: Path) -> None:
    try:
        subprocess.run(cmd, cwd=cwd, check=True)
    except FileNotFoundError as e:
        if cmd and cmd[0].lower() in {"npm", "npm.cmd"}:
            raise RuntimeError("npm was not found on PATH for this process. ") from e
        raise


def _get_npm_executable() -> str:
    """
    - Windows: resolves to npm.cmd
    - macOS/Linux: resolves to npm
    """
    for candidate in ("npm", "npm.cmd", "npm.exe"):
        resolved = shutil.which(candidate)
        if resolved:
            return resolved

    raise RuntimeError("Could not find npm on PATH for this Python process. ")


def main() -> int:
    root = _repo_root()
    npm = _get_npm_executable()

    _run([npm, "install"], cwd=root)
    _run([npm, "run", "build"], cwd=root)

    local_build = root / "dist"
    out_build = os.getenv("LIBRARY_PATH")
    assert local_build.exists(), f"Local build path does not exist: {local_build}"
    assert out_build is not None, "LIBRARY_PATH environment variable is not set."

    shutil.rmtree(out_build, ignore_errors=True)
    shutil.copytree(local_build, out_build, dirs_exist_ok=True)

    return 0


if __name__ == "__main__":
    env_path = find_dotenv()

    load_dotenv(env_path)
    raise SystemExit(main())
