#!/usr/bin/env bash
# Versions our releases above upstream's. Every published workspace package, and
# the Rust agents workspace, carries upstream's version with 1000 added to its
# first non-zero component: `@humanode-hyperlane/sdk` 45.2.0 becomes 1045.2.0,
# the agents 3.0.0 become 1003.0.0, and a 0.3.2 would become 0.1003.2. So our
# versions sort above upstream's, never collide with them, carry no prerelease
# suffix, and still read as the upstream release they are built from. A version
# whose first non-zero component is already 1000 or more is left as it is, so
# the script can be rerun. A second release of ours on the same upstream version
# bumps the patch by hand (1045.2.1), skipping any patch upstream has shipped
# meanwhile.
#
# It then runs the packages' `version:update` tasks, as upstream's release
# preparation does, so the version files they generate are committed along with
# the new versions. `solidity/bytecodeversion.sh` subtracts the 1000 again, so
# the contracts keep upstream's version.
#
# Usage: scripts/humanode-version.sh
#
# A release is then tagged `npm-v<SDK version>`, for example `npm-v1045.2.0`,
# which publishes every package whose version is not yet on npm, and
# `agents-v<agents version>`, for example `agents-v1003.0.0`, which builds the
# agents image and binaries.

set -euo pipefail

# Prints the version with 1000 added to its first non-zero component, or the
# version as it is when that component is already 1000 or more. Anything after
# the three components is kept.
encode() {
  local version="$1" major minor patch rest
  if ! [[ "$version" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)(.*)$ ]]; then
    echo "unrecognized version: $version" >&2
    return 1
  fi
  major="${BASH_REMATCH[1]}"
  minor="${BASH_REMATCH[2]}"
  patch="${BASH_REMATCH[3]}"
  rest="${BASH_REMATCH[4]}"
  if ((major >= 1000)); then
    echo "$version"
  elif ((major > 0)); then
    echo "$((major + 1000)).$minor.$patch$rest"
  elif ((minor >= 1000)); then
    echo "$version"
  elif ((minor > 0)); then
    echo "0.$((minor + 1000)).$patch$rest"
  elif ((patch >= 1000)); then
    echo "$version"
  else
    echo "0.0.$((patch + 1000))$rest"
  fi
}

cd "$(git rev-parse --show-toplevel)"

pnpm ls -r --depth -1 --json |
  jq -r '.[] | select(.private != true and .name != null) | .path' |
  while read -r dir; do
    manifest="$dir/package.json"
    current=$(jq -r .version "$manifest")
    version=$(encode "$current")
    # Replaces only the first "version" field, which is the package's own, and
    # leaves the rest of the file as it is.
    VERSION="$version" perl -0pi -e 's/("version":\s*")[^"]*(")/$1$ENV{VERSION}$2/' "$manifest"
    echo "$(jq -r .name "$manifest"): $current -> $version"
  done

current=$(rust/scripts/ci/get-workspace-version.sh)
version=$(encode "$current")
rust/scripts/ci/update-workspace-version.sh "$version"
echo "agents: $current -> $version"
# Rewrites the workspace members' entries in Cargo.lock; nothing else changes.
(cd rust/main && cargo update --workspace)

pnpm turbo run version:update
