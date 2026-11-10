#!/usr/bin/env bash
# Runs the Foundry build and tests for the Paris variant of the contracts.
#
# The Paris variant is upstream's source with the files under
# `overrides/paris/contracts/` laid over it, compiled for the `paris` EVM. Forge
# has no hook for substituting sources at read time (Hardhat has one, used by
# `paris-hardhat.config.cts`), and remappings do not apply to relative imports,
# so this script stages a copy of the tree with the overrides applied and runs
# forge there. Nothing under `contracts/` is touched; the default `forge test`
# keeps building upstream's variant.
#
# Usage: ./test-paris.sh [forge test arguments]
#        FORGE_COMMAND=build ./test-paris.sh [forge build arguments]
set -euo pipefail
cd "$(dirname "$0")"

stage=".paris"
root="$stage/solidity"
rm -rf "$stage"
mkdir -p "$root"

# Sources, tests and config; dependencies and vectors are shared by reference.
cp -a contracts test script foundry.toml remappings.txt "$root/"
ln -s ../../dependencies "$root/dependencies"
[ -d lib ] && ln -s ../../lib "$root/lib"
ln -s ../../vectors "$stage/vectors"

# The overrides replace their upstream counterparts; the Paris tests are added.
cp -a overrides/paris/contracts/. "$root/contracts/"
mkdir -p "$root/test/paris"
cp -a overrides/paris/test/. "$root/test/paris/"

# Directories some tests write fixtures into.
grep -rhoE 'fixtures/[a-z-]+' test | sort -u | while read -r dir; do
  mkdir -p "$root/$dir"
done

cd "$root"
exec forge "${FORGE_COMMAND:-test}" --evm-version paris "$@"
