import { TimelockController__factory } from '@humanode-hyperlane/core';

export const evmTimelockFactories = {
  TimelockController: new TimelockController__factory(),
} as const;

export type EvmTimelockFactories = typeof evmTimelockFactories;
