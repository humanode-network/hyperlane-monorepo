# @humanode-hyperlane/http-registry-server

## 30.0.0

### Patch Changes

- Updated dependencies [e1ed158]
- Updated dependencies [d0dbf1a]
- Updated dependencies [95c2891]
- Updated dependencies [7646819]
  - @humanode-hyperlane/sdk@30.0.0
  - @humanode-hyperlane/utils@30.0.0

## 29.1.0

### Patch Changes

- Updated dependencies [a8192d7]
- Updated dependencies [a891402]
  - @humanode-hyperlane/sdk@29.1.0
  - @humanode-hyperlane/utils@29.1.0

## 29.0.1

### Patch Changes

- Updated dependencies [96508ed]
  - @humanode-hyperlane/sdk@29.0.1
  - @humanode-hyperlane/utils@29.0.1

## 29.0.0

### Patch Changes

- Updated dependencies [cc6d57b]
- Updated dependencies [3c6b1ad]
- Updated dependencies [084c6b6]
  - @humanode-hyperlane/sdk@29.0.0
  - @humanode-hyperlane/utils@29.0.0

## 28.1.0

### Patch Changes

- Updated dependencies [6c715a7]
- Updated dependencies [2e622e8]
- Updated dependencies [e93a4c8]
  - @humanode-hyperlane/sdk@28.1.0
  - @humanode-hyperlane/utils@28.1.0

## 28.0.0

### Patch Changes

- Updated dependencies [b9c6844]
- Updated dependencies [5a5d172]
- Updated dependencies [a4a74d8]
  - @humanode-hyperlane/sdk@28.0.0
  - @humanode-hyperlane/utils@28.0.0

## 27.1.0

### Patch Changes

- Updated dependencies [de5f6b5]
- Updated dependencies [a1f9e41]
- Updated dependencies [b892e61]
- Updated dependencies [7af7728]
  - @humanode-hyperlane/sdk@27.1.0
  - @humanode-hyperlane/utils@27.1.0

## 27.0.0

### Patch Changes

- Updated dependencies [f2620a1]
- Updated dependencies [f7ebf6c]
- Updated dependencies [8a6f742]
- Updated dependencies [b05e242]
- Updated dependencies [aee625c]
  - @humanode-hyperlane/sdk@27.0.0
  - @humanode-hyperlane/utils@27.0.0

## 26.0.0

### Patch Changes

- Updated dependencies [43255a9]
- Updated dependencies [06aacac]
- Updated dependencies [763a264]
- Updated dependencies [1d116d8]
  - @humanode-hyperlane/sdk@26.0.0
  - @humanode-hyperlane/utils@26.0.0

## 25.5.0

### Patch Changes

- Updated dependencies [c2304d3]
- Updated dependencies [cd1c28a]
- Updated dependencies [69b48fa]
- Updated dependencies [048df98]
- Updated dependencies [840fb33]
  - @humanode-hyperlane/sdk@25.5.0
  - @humanode-hyperlane/utils@25.5.0

## 25.4.1

### Patch Changes

- Updated dependencies [5a7efbb]
  - @humanode-hyperlane/sdk@25.4.1
  - @humanode-hyperlane/utils@25.4.1

## 25.4.0

### Patch Changes

- Updated dependencies [1f021bf]
- Updated dependencies [d4a5026]
- Updated dependencies [934d857]
- Updated dependencies [1f3a0e6]
- Updated dependencies [942bbfb]
- Updated dependencies [a3f7fd3]
- Updated dependencies [2a6bd61]
  - @humanode-hyperlane/utils@25.4.0
  - @humanode-hyperlane/sdk@25.4.0

## 25.3.2

### Patch Changes

- @humanode-hyperlane/sdk@25.3.2
- @humanode-hyperlane/utils@25.3.2

## 25.3.1

### Patch Changes

- @humanode-hyperlane/sdk@25.3.1
- @humanode-hyperlane/utils@25.3.1

## 25.3.0

### Patch Changes

- Updated dependencies [aea767c]
  - @humanode-hyperlane/sdk@25.3.0
  - @humanode-hyperlane/utils@25.3.0

## 25.2.0

### Patch Changes

- Updated dependencies [215dff0]
- Updated dependencies [d2f75a1]
- Updated dependencies [360db52]
- Updated dependencies [18ec479]
- Updated dependencies [795d93e]
- Updated dependencies [e143956]
- Updated dependencies [ccd638d]
- Updated dependencies [c61d612]
- Updated dependencies [c2affe2]
  - @humanode-hyperlane/sdk@25.2.0
  - @humanode-hyperlane/utils@25.2.0

## 25.1.0

### Patch Changes

- Updated dependencies [b930534]
- Updated dependencies [a18d0e6]
  - @humanode-hyperlane/sdk@25.1.0
  - @humanode-hyperlane/utils@25.1.0

## 25.0.0

### Patch Changes

- 52ce778: A `LazyAsync` helper was added to `@humanode-hyperlane/utils` for safe, deduplicated async initialization. It replaces the scattered pattern of `if (!cached) { cached = await init(); } return cached` with an approach that deduplicates concurrent callers, clears state on errors to allow retries, and supports reset capability. Consumer packages were migrated to use this utility.
- Updated dependencies [52ce778]
- Updated dependencies [aaabbad]
  - @humanode-hyperlane/utils@25.0.0
  - @humanode-hyperlane/sdk@25.0.0

## 24.0.0

### Minor Changes

- 4e159b0: Added file watching for local filesystem registries. When the HTTP registry server is started with a local filesystem registry (or a MergedRegistry containing one), it now watches for changes to YAML/JSON files and automatically refreshes the registry cache when changes are detected.

### Patch Changes

- Updated dependencies [57461b2]
- Updated dependencies [d580bb6]
- Updated dependencies [50868ce]
- Updated dependencies [b05e9f8]
- Updated dependencies [f44c2b4]
- Updated dependencies [9dc71fe]
- Updated dependencies [bde05e9]
- Updated dependencies [d0b8c24]
- Updated dependencies [4de5071]
  - @humanode-hyperlane/utils@24.0.0
  - @humanode-hyperlane/sdk@24.0.0

## 23.0.0

### Patch Changes

- Updated dependencies [d1d90d2]
- Updated dependencies [52fd0f8]
- Updated dependencies [7c22cff]
- Updated dependencies [52fd0f8]
- Updated dependencies [52fd0f8]
- Updated dependencies [a10cfc8]
- Updated dependencies [6ddef74]
- Updated dependencies [80f3635]
- Updated dependencies [576cd95]
- Updated dependencies [9aa93f4]
- Updated dependencies [42b72c3]
- Updated dependencies [a5d6cae]
  - @humanode-hyperlane/sdk@23.0.0
  - @humanode-hyperlane/utils@23.0.0

## 22.0.0

### Patch Changes

- Updated dependencies [c6a6d5f]
- Updated dependencies [4c58992]
- Updated dependencies [99948bc]
- Updated dependencies [99948bc]
- Updated dependencies [b0e9d48]
- Updated dependencies [66ef635]
- Updated dependencies [7f31d77]
- Updated dependencies [7a0a9e4]
- Updated dependencies [3aec1c4]
- Updated dependencies [b892d63]
  - @humanode-hyperlane/sdk@22.0.0
  - @humanode-hyperlane/utils@22.0.0

## 21.1.0

### Patch Changes

- @humanode-hyperlane/sdk@21.1.0
- @humanode-hyperlane/utils@21.1.0

## 21.0.0

### Patch Changes

- Updated dependencies [c08fa32]
- Updated dependencies [68310db]
- Updated dependencies [b6b206d]
- Updated dependencies [bc8b22f]
- Updated dependencies [ed10fc1]
- Updated dependencies [0bce4e7]
  - @humanode-hyperlane/sdk@21.0.0
  - @humanode-hyperlane/utils@21.0.0

## 20.1.0

### Patch Changes

- Updated dependencies [11fa887]
  - @humanode-hyperlane/sdk@20.1.0
  - @humanode-hyperlane/utils@20.1.0

## 20.0.0

### Patch Changes

- Updated dependencies [b3ebc08]
- Updated dependencies [a7dc73d]
  - @humanode-hyperlane/utils@20.0.0
  - @humanode-hyperlane/sdk@20.0.0

## 19.13.0

### Patch Changes

- Updated dependencies [3592f258a]
  - @humanode-hyperlane/sdk@19.13.0
  - @humanode-hyperlane/utils@19.13.0

## 19.12.0

### Patch Changes

- Updated dependencies [38a1165c8]
- Updated dependencies [08cf7eca9]
- Updated dependencies [af2cd1729]
- Updated dependencies [618615dc4]
- Updated dependencies [e37100e2e]
- Updated dependencies [08cf7eca9]
  - @humanode-hyperlane/sdk@19.12.0
  - @humanode-hyperlane/utils@19.12.0

## 19.11.0

### Patch Changes

- Updated dependencies [156a37d6e]
- Updated dependencies [4c29cd341]
  - @humanode-hyperlane/sdk@19.11.0
  - @humanode-hyperlane/utils@19.11.0

## 19.10.0

### Patch Changes

- Updated dependencies [aad2988c9]
- Updated dependencies [b2a693ac6]
- Updated dependencies [c2a64e8c5]
- Updated dependencies [c0583af62]
- Updated dependencies [9770b732c]
- Updated dependencies [a97a9939c]
- Updated dependencies [66bed7126]
- Updated dependencies [43ecd628c]
- Updated dependencies [f604423b9]
  - @humanode-hyperlane/utils@19.10.0
  - @humanode-hyperlane/sdk@19.10.0

## 19.9.0

### Patch Changes

- Updated dependencies [8c027d852]
- Updated dependencies [8c027d852]
  - @humanode-hyperlane/utils@19.9.0
  - @humanode-hyperlane/sdk@19.9.0

## 19.8.0

### Patch Changes

- Updated dependencies [500d81246]
- Updated dependencies [4614a503e]
- Updated dependencies [2ed21c97d]
- Updated dependencies [78ff6cd47]
- Updated dependencies [00b014a3e]
- Updated dependencies [3f75ad86d]
  - @humanode-hyperlane/sdk@19.8.0
  - @humanode-hyperlane/utils@19.8.0

## 19.7.0

### Patch Changes

- Updated dependencies [bdfa2047e]
- Updated dependencies [69ad3473e]
- Updated dependencies [211e245cb]
- Updated dependencies [343737271]
- Updated dependencies [c68722d93]
- Updated dependencies [5c4cef1d4]
  - @humanode-hyperlane/sdk@19.7.0
  - @humanode-hyperlane/utils@19.7.0

## 19.6.0

### Patch Changes

- Updated dependencies [e67aca4a1]
- Updated dependencies [419e16910]
- Updated dependencies [b259966fe]
- Updated dependencies [e0c69e255]
- Updated dependencies [ec406fcbe]
- Updated dependencies [18c32ed2b]
- Updated dependencies [b259966fe]
- Updated dependencies [419e16910]
- Updated dependencies [9185b9c5b]
  - @humanode-hyperlane/sdk@19.6.0
  - @humanode-hyperlane/utils@19.6.0

## 19.6.0-beta.0

### Patch Changes

- Updated dependencies [e67aca4a1]
- Updated dependencies [419e16910]
- Updated dependencies [b259966fe]
- Updated dependencies [e0c69e255]
- Updated dependencies [ec406fcbe]
- Updated dependencies [18c32ed2b]
- Updated dependencies [b259966fe]
- Updated dependencies [419e16910]
- Updated dependencies [9185b9c5b]
  - @humanode-hyperlane/sdk@19.6.0-beta.0
  - @humanode-hyperlane/utils@19.6.0-beta.0

## 19.5.0

### Patch Changes

- Updated dependencies [312826d10]
- Updated dependencies [bf2c2caa6]
- Updated dependencies [312826d10]
- Updated dependencies [79a51debe]
  - @humanode-hyperlane/sdk@19.5.0
  - @humanode-hyperlane/utils@19.5.0

## 19.4.0

### Patch Changes

- Updated dependencies [4011a4561]
- Updated dependencies [8fd3bf78c]
- Updated dependencies [5a4e22d34]
- Updated dependencies [79f55e09d]
- Updated dependencies [5a4e22d34]
- Updated dependencies [517bbaa42]
  - @humanode-hyperlane/sdk@19.4.0
  - @humanode-hyperlane/utils@19.4.0

## 19.3.0

### Patch Changes

- Updated dependencies [fcdda58a8]
  - @humanode-hyperlane/sdk@19.3.0
  - @humanode-hyperlane/utils@19.3.0

## 19.2.0

### Patch Changes

- Updated dependencies [f68419605]
  - @humanode-hyperlane/sdk@19.2.0
  - @humanode-hyperlane/utils@19.2.0

## 19.1.1

### Patch Changes

- @humanode-hyperlane/sdk@19.1.1
- @humanode-hyperlane/utils@19.1.1

## 19.1.0

### Patch Changes

- Updated dependencies [554ff1a66]
  - @humanode-hyperlane/sdk@19.1.0
  - @humanode-hyperlane/utils@19.1.0

## 19.0.0

### Patch Changes

- Updated dependencies [8eab305bd]
- Updated dependencies [e42a0e8e1]
- Updated dependencies [70354d6d9]
- Updated dependencies [e42a0e8e1]
- Updated dependencies [dd4928b1c]
- Updated dependencies [32479e139]
- Updated dependencies [32479e139]
  - @humanode-hyperlane/utils@19.0.0
  - @humanode-hyperlane/sdk@19.0.0

## 18.3.0

### Patch Changes

- Updated dependencies [4974e66a0]
- Updated dependencies [30ec5ffbb]
- Updated dependencies [57cf9e953]
- Updated dependencies [c41bc3b93]
- Updated dependencies [2c47e1143]
- Updated dependencies [b66129ee2]
- Updated dependencies [2c47e1143]
- Updated dependencies [2b16904f8]
- Updated dependencies [096389aea]
- Updated dependencies [e4e6a75a8]
- Updated dependencies [ee7c7ade4]
- Updated dependencies [6b8419370]
- Updated dependencies [94e7116c2]
  - @humanode-hyperlane/sdk@18.3.0
  - @humanode-hyperlane/utils@18.3.0

## 18.2.0

### Patch Changes

- Updated dependencies [fed6906e4]
- Updated dependencies [ca64e73cd]
- Updated dependencies [dfa9d368c]
  - @humanode-hyperlane/sdk@18.2.0
  - @humanode-hyperlane/utils@18.2.0

## 18.1.0

### Patch Changes

- Updated dependencies [73be9b8d2]
  - @humanode-hyperlane/sdk@18.1.0
  - @humanode-hyperlane/utils@18.1.0

## 18.0.0

### Patch Changes

- Updated dependencies [552b253b9]
- Updated dependencies [ba832828f]
- Updated dependencies [cfc0eb2a7]
  - @humanode-hyperlane/sdk@18.0.0
  - @humanode-hyperlane/utils@18.0.0

## 17.0.0

### Patch Changes

- Updated dependencies [400c02460]
- Updated dependencies [8c15edc67]
- Updated dependencies [76a5db49a]
- Updated dependencies [6583df016]
- Updated dependencies [e0bda316a]
- Updated dependencies [7f542b288]
  - @humanode-hyperlane/sdk@17.0.0
  - @humanode-hyperlane/utils@17.0.0

## 16.2.0

### Patch Changes

- Updated dependencies [22ceaa109]
- Updated dependencies [ce4974214]
- Updated dependencies [a89018a3f]
  - @humanode-hyperlane/sdk@16.2.0
  - @humanode-hyperlane/utils@16.2.0

## 16.1.1

### Patch Changes

- Updated dependencies [ea77b6ae4]
  - @humanode-hyperlane/sdk@16.1.1
  - @humanode-hyperlane/utils@16.1.1

## 16.1.0

### Patch Changes

- Updated dependencies [2a2c29c39]
- Updated dependencies [e69ac9f62]
- Updated dependencies [d9b8a7551]
  - @humanode-hyperlane/sdk@16.1.0
  - @humanode-hyperlane/utils@16.1.0

## 16.0.0

### Minor Changes

- a2596f0d9: Add GET `warp-route/core` to HTTP Registry Server
- 69d591934: Add `warp-route/deploy/id` route to HttpRegistryServer

### Patch Changes

- Updated dependencies [9f3222962]
- Updated dependencies [d200acfa8]
- Updated dependencies [966ad8440]
- Updated dependencies [fabb4a5af]
- Updated dependencies [a71193486]
- Updated dependencies [1f4412909]
- Updated dependencies [af783be54]
  - @humanode-hyperlane/sdk@16.0.0
  - @humanode-hyperlane/utils@16.0.0

## 15.0.0

### Major Changes

- 451f3f6c3: Implement http-registry-server

### Patch Changes

- Updated dependencies [451f3f6c3]
- Updated dependencies [23861b70a]
- Updated dependencies [a33c8abd4]
- Updated dependencies [a33c8abd4]
- Updated dependencies [e0ea8910c]
- Updated dependencies [d16a853c0]
  - @humanode-hyperlane/utils@15.0.0
  - @humanode-hyperlane/sdk@15.0.0
