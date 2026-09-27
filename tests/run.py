#!/usr/bin/env python3
"""luce-canvas's gate: every module's tests, native and through the C backend.
GPU tests skip themselves where no device opens (CI runners)."""
import argparse, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODULES = ['half', 'wake', 'pool', 'tiles', 'keymap', 'cache', 'pyramid']


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', type=Path, default=Path(os.environ.get('LUCE_BASE_COMPILER', ROOT.parent / 'luce-base/build/luce-base')))
    args = parser.parse_args()
    (ROOT / 'build').mkdir(exist_ok=True)
    env = dict(os.environ, LUCE_STD=str(ROOT.parent / 'luce-base/src/std'), LUCE_CACHE=str(ROOT / 'build/cache'))
    for backend in ['--native', '--backend=c']:
        for module in MODULES:
            print(f'TEST {module} {backend}', flush=True)
            # A module is a file, or a directory of files listed in its ORDER.
            target = ROOT / f'src/luce_canvas/{module}'
            target = target if target.is_dir() else target.with_suffix('.lucb')
            subprocess.run([str(args.base.resolve()), 'test', str(target), backend], check=True, cwd=ROOT, env=env, timeout=600)
    print('PASS luce-canvas', flush=True)


if __name__ == '__main__':
    main()
