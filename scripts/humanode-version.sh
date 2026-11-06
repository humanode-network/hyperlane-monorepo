#!/usr/bin/env bash
# Sets the version of every published workspace package to its upstream base
# version with our suffix, `<base>-humanode.<n>`: `@humanode-hyperlane/sdk`
# 30.0.0 becomes 30.0.0-humanode.1 for `n` = 1. The base is the version without
# any earlier `-humanode.<n>` suffix, so the base stays upstream's version.
#
# It then runs the packages' `version:update` tasks, as upstream's release
# preparation does, so the version files they generate are committed along with
# the new versions. `solidity/bytecodeversion.sh` strips the suffix, so the
# contracts keep upstream's version.
#
# Usage: scripts/humanode-version.sh <n>
#
# A release is then tagged `npm-v<SDK version>`, for example
# `npm-v30.0.0-humanode.1`, which publishes every package whose version is not
# yet on npm.

set -euo pipefail

n="${1:-}"
if ! [[ "$n" =~ ^[1-9][0-9]*$ ]]; then
  echo "usage: $0 <n>, where n is a positive integer" >&2
  exit 2
fi

cd "$(git rev-parse --show-toplevel)"

pnpm ls -r --depth -1 --json |
  jq -r '.[] | select(.private != true and .name != null) | .path' |
  while read -r dir; do
    manifest="$dir/package.json"
    current=$(jq -r .version "$manifest")
    version="${current%%-humanode.*}-humanode.$n"
    # Replaces only the first "version" field, which is the package's own, and
    # leaves the rest of the file as it is.
    VERSION="$version" perl -0pi -e 's/("version":\s*")[^"]*(")/$1$ENV{VERSION}$2/' "$manifest"
    echo "$(jq -r .name "$manifest"): $current -> $version"
  done

pnpm turbo run version:update
