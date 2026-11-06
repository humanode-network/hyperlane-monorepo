#!/bin/sh

# Cross-platform in-place sed
sedi() {
  # Turbo prepares the version before parallel builds. Standalone builds also
  # call this script; leave shared inputs untouched when already up to date.
  if [ "$(sed "$1" "$2")" = "$(cat "$2")" ]; then
    return
  fi
  if [ "$(uname)" = "Darwin" ]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# The contracts carry upstream's version. Our package versions add 1000 to the
# first non-zero component of upstream's (scripts/humanode-version.sh), which
# taken as is would change the bytecode of every contract that inherits
# PackageVersioned; the 1000 is subtracted again here.
version=$(echo "$npm_package_version" | awk -F. -v OFS=. '{
  for (i = 1; i <= 3; i++) {
    if ($i > 0) {
      if ($i >= 1000) $i -= 1000
      break
    }
  }
  print
}')

# Update Solidity contract
sedi "s|string public constant PACKAGE_VERSION = \".*\";|string public constant PACKAGE_VERSION = \"$version\";|" contracts/PackageVersioned.sol

# Update TypeScript file
sedi "s|export const CONTRACTS_PACKAGE_VERSION = '.*';|export const CONTRACTS_PACKAGE_VERSION = '$version';|" core-utils/index.ts
