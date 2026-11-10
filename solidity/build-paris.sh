#!/usr/bin/env bash
# Builds the Paris variant of the contracts: Hardhat artifacts, typechain and the
# build artifact for contract verification, all under paths of their own
# (`artifacts-paris/`, `dist/paris/`), next to the default build's output.
# See paris-hardhat.config.cts for what the variant is.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d dependencies/@openzeppelin-contracts-4.9.3 ]; then
  forge soldeer install --quiet
fi

python3 test/paris/check-overrides.py .

pnpm version:update
pnpm hardhat-paris compile --no-typechain
rm -rf ./artifacts-paris/typechain ./dist/paris/typechain
pnpm hardhat-paris typechain
pnpm exec tsc --project tsconfig.paris-typechain.json
node fix-typechain-ethers.mjs ./dist/paris/typechain/factories
PARIS=true ./exportBuildArtifact.sh
