# Migration Guide: Multi-VM Package Restructure (v19.9.0+)

This guide covers changes introduced in PR #7385 which restructures AltVM (Alternative Virtual Machine) functionality into dedicated packages.

## Overview

The Hyperlane SDK has been reorganized to better separate EVM and multi-VM concerns:

- **New Package**: `@humanode-hyperlane/provider-sdk` - Protocol-agnostic provider abstractions and interfaces
- **New Package**: `@humanode-hyperlane/deploy-sdk` - Deployment modules for all VM types (EVM + AltVM)
- **Updated**: `@humanode-hyperlane/sdk` - Core SDK with EVM-specific implementations
- **Updated**: `@humanode-hyperlane/utils` - Shared utilities (no breaking changes)

## Who is Affected?

### ✅ NOT Affected (No Changes Required)

If the client application:

- Only uses EVM chains (Ethereum, Polygon, Arbitrum, etc.)
- Imports from `@humanode-hyperlane/registry`
- Imports from `@humanode-hyperlane/widgets`
- Uses `ProtocolType`, `ChainMetadata`, `MultiProvider` from SDK/utils
- Uses the Warp UI template or Explorer without modifications

**Action**: Upgrade to SDK v19.9.0+ without code changes.

### ⚠️ Affected (Migration Required)

If the client application:

- Deploys or manages Alt-VM chains (Cosmos, Sealevel/Solana, Starknet, Radix)
- Imports `AltVM*` classes directly
- Uses `MinimumRequiredGasByAction` or `GasAction` from utils
- Implements custom AltVM deployment logic

**Action**: Follow migration steps below.

## Breaking Changes

### None for External Consumers

This is a **non-breaking refactor** for external repositories. All commonly-used exports remain in their original locations:

- ✅ `ProtocolType` - Still in `@humanode-hyperlane/utils`
- ✅ `MultiProvider` - Still in `@humanode-hyperlane/sdk`
- ✅ `ChainMetadata` - Still in `@humanode-hyperlane/sdk`
- ✅ All EVM modules - Still in `@humanode-hyperlane/sdk`

### Internal Reorganization

The following exports have been **moved** to new packages:

#### Moved to `@humanode-hyperlane/provider-sdk`

```typescript
// Protocol types and enums
- ProtocolType (also still available in utils)
- AltVM namespace (interfaces and types)
- MinimumRequiredGasByAction
- GasAction

// Core abstractions
- AnnotatedTx
- TxReceipt
- Transaction types
```

#### Moved to `@humanode-hyperlane/deploy-sdk`

```typescript
// Core deployment
import {
  AltVMCoreModule,
  AltVMCoreReader,
} from '@humanode-hyperlane/deploy-sdk';
// Hook deployment
import {
  AltVMHookModule,
  AltVMHookReader,
} from '@humanode-hyperlane/deploy-sdk';
// ISM deployment
import { AltVMIsmModule, AltVMIsmReader } from '@humanode-hyperlane/deploy-sdk';
// Warp deployment
import {
  AltVMDeployer,
  AltVMWarpModule,
  AltVMWarpRouteReader,
} from '@humanode-hyperlane/deploy-sdk';
```

## Migration Steps

### Step 1: Install New Packages if needed

For monorepo internal packages, dependencies are already in place. For external consumers using AltVM features:

```bash
yarn add @humanode-hyperlane/provider-sdk@^0.3.0
yarn add @humanode-hyperlane/deploy-sdk@^0.3.0
```

### Step 2: Update Import Statements

#### AltVM Deployment

Update AltVM modules as indicated above.

```typescript
// Before
import { AltVM } from '@humanode-hyperlane/utils';

// After
import { AltVM } from '@humanode-hyperlane/provider-sdk';
```

#### Gas Action Imports

```typescript
// Before
import {
  GasAction,
  MinimumRequiredGasByAction,
} from '@humanode-hyperlane/utils';

// After
import {
  GasAction,
  MinimumRequiredGasByAction,
} from '@humanode-hyperlane/provider-sdk';
```

#### Protocol Type Imports (No Change Needed)

```typescript
// Before (still works)
import { ProtocolType } from '@humanode-hyperlane/utils';

// After (also works, preferred for new consumers)
import { ProtocolType } from '@humanode-hyperlane/provider-sdk';
```

### Step 3: Update Module Instantiation

AltVM modules have updated constructor signatures. The main change is replacing a `multiProvider` with the introduction of `chainLookup` helpers.

## New Features

### Chain Lookup Helper

A new adapter function decouples chain metadata lookup between the SDK and AltVM modules:

```typescript
import { altVmChainLookup } from '@humanode-hyperlane/sdk';

const chainLookup = altVmChainLookup(multiProvider);

// Use with AltVM modules
const coreModule = new AltVMCoreModule(chainLookup, signer, { ... });
```

### Config Utilities

Some utilities for config normalization moved to `@humanode-hyperlane/utils` but are not yet completely removed from the SDK:

```typescript
import { normalizeConfig, sortArraysInConfig } from '@humanode-hyperlane/utils';

const normalized = normalizeConfig(config);
const sorted = sortArraysInConfig(config);
```
