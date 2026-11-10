import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

// The Paris variant of the contracts: upstream's sources with the files under
// `overrides/paris/contracts/` laid over them, compiled for the `paris` EVM.
// Hardhat reads the override in place of the upstream file, keyed by the
// upstream path, so source names, which are embedded in the Solidity
// metadata, stay the same. Nothing under `contracts/` is modified; the default
// build keeps compiling upstream's variant. See test-paris.sh for Foundry.

const OVERRIDES_DIR = 'overrides/paris/contracts';

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? listFiles(join(dir, entry.name))
        : [join(dir, entry.name)],
    ),
  );
  return files.flat();
}

/** Maps each overridden upstream path to its override, both relative to root. */
export async function parisOverrides(
  root: string,
): Promise<Map<string, string>> {
  const dir = resolve(root, OVERRIDES_DIR);
  const overrides = new Map<string, string>();
  for (const file of await listFiles(dir)) {
    const upstream = join('contracts', relative(dir, file));
    overrides.set(upstream, relative(root, file));
  }
  return overrides;
}

/** Returns the override's content for an overridden source, else the original. */
export async function readParisSource(
  root: string,
  absolutePath: string,
  readOriginal: () => Promise<string>,
  overrides: Map<string, string>,
): Promise<string> {
  for (const [source, replacement] of overrides) {
    if (absolutePath === resolve(root, source)) {
      return readFile(resolve(root, replacement), 'utf8');
    }
  }
  return readOriginal();
}
