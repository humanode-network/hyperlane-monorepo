#!/bin/sh

# Cross-platform in-place sed
sedi() {
  if [ "$(uname)" = "Darwin" ]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# The contracts carry upstream's version: our releases add a `-humanode.<n>`
# suffix to the package version (scripts/humanode-version.sh), which would
# otherwise change the bytecode of every contract that inherits PackageVersioned.
version="${npm_package_version%%-humanode.*}"

# Update Solidity contract
sedi "s|string public constant PACKAGE_VERSION = \".*\";|string public constant PACKAGE_VERSION = \"$version\";|" contracts/PackageVersioned.sol

# Update TypeScript file
sedi "s|export const CONTRACTS_PACKAGE_VERSION = '.*';|export const CONTRACTS_PACKAGE_VERSION = '$version';|" core-utils/index.ts
