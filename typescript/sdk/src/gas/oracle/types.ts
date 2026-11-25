import { ethers } from 'ethers';
import { z } from 'zod';

import { ProtocolType } from '@humanode-hyperlane/utils';

import { getProtocolExchangeRateDecimals } from '../../consts/igp.js';

export const StorageGasOracleConfigSchema = z.object({
  gasPrice: z.string(),
  tokenExchangeRate: z.string(),
});

// Gas data to configure on a single destination chain.
export type StorageGasOracleConfig = z.output<
  typeof StorageGasOracleConfigSchema
>;

export const ProtocolAgnositicGasOracleConfigSchema =
  StorageGasOracleConfigSchema.extend({
    // The number of decimals of the remote native token.
    // Optional because it's not required by all protocol types.
    tokenDecimals: z.number().optional(),
  });

// Gas data to configure on a single destination chain.
export type ProtocolAgnositicGasOracleConfig = z.output<
  typeof ProtocolAgnositicGasOracleConfigSchema
>;

export const IgpCostDataSchema = z.object({
  handleGasAmount: z.number(),
  totalGasAmount: z.number(),
  totalUsdCost: z.number(),
});

export type IgpCostData = z.output<typeof IgpCostDataSchema>;

export const ProtocolAgnositicGasOracleConfigWithTypicalCostSchema =
  ProtocolAgnositicGasOracleConfigSchema.extend({
    typicalCost: IgpCostDataSchema.optional(),
  });

export type ProtocolAgnositicGasOracleConfigWithTypicalCost = z.output<
  typeof ProtocolAgnositicGasOracleConfigWithTypicalCostSchema
>;

// An IGP's oracle entry for one remote takes one of two forms. Upstream's,
// `gasPrice` and `tokenExchangeRate`, is the config's to manage: deploy, check
// and apply hold the chain to it. The externally managed one,
// `initialGasPrice` and `initialTokenExchangeRate`, belongs to someone outside
// the config, such as a gas-oracle updater that keeps the entry priced: the
// config only seeds it, deploy and apply set it only while it holds nothing,
// and check compares its token decimals, never the values on the chain. An
// entry holds the fields of one form only: each form refuses the other's.

export const ConfigManagedGasOracleConfigSchema =
  ProtocolAgnositicGasOracleConfigWithTypicalCostSchema.extend({
    initialGasPrice: z.never().optional(),
    initialTokenExchangeRate: z.never().optional(),
  });

export type ConfigManagedGasOracleConfig = z.output<
  typeof ConfigManagedGasOracleConfigSchema
>;

export const ExternallyManagedGasOracleConfigSchema = z.object({
  // The values the entry is seeded with, in the units of `gasPrice` and
  // `tokenExchangeRate`.
  initialGasPrice: z.string(),
  initialTokenExchangeRate: z.string(),
  // The number of decimals of the remote native token.
  tokenDecimals: z.number().optional(),
  gasPrice: z.never().optional(),
  tokenExchangeRate: z.never().optional(),
  typicalCost: z.never().optional(),
});

export type ExternallyManagedGasOracleConfig = z.output<
  typeof ExternallyManagedGasOracleConfigSchema
>;

export const IgpOracleConfigEntrySchema = z.union([
  ConfigManagedGasOracleConfigSchema,
  ExternallyManagedGasOracleConfigSchema,
]);

export type IgpOracleConfigEntry = z.output<typeof IgpOracleConfigEntrySchema>;

export const isExternallyManagedGasOracleConfig = (
  entry: IgpOracleConfigEntry,
): entry is ExternallyManagedGasOracleConfig =>
  entry.initialGasPrice !== undefined;

// What an entry sets on an oracle: the config's values, or for an externally
// managed entry its initial ones.
export const gasOracleConfigValues = (
  entry: IgpOracleConfigEntry,
): ProtocolAgnositicGasOracleConfig =>
  isExternallyManagedGasOracleConfig(entry)
    ? {
        gasPrice: entry.initialGasPrice,
        tokenExchangeRate: entry.initialTokenExchangeRate,
        tokenDecimals: entry.tokenDecimals,
      }
    : {
        gasPrice: entry.gasPrice,
        tokenExchangeRate: entry.tokenExchangeRate,
        tokenDecimals: entry.tokenDecimals,
      };

export type OracleData = {
  tokenExchangeRate: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
};

export const formatGasOracleConfig = (
  localChainProtocol: ProtocolType,
  config: OracleData,
): {
  tokenExchangeRate: string;
  gasPrice: string;
} => ({
  tokenExchangeRate: ethers.utils.formatUnits(
    config.tokenExchangeRate,
    getProtocolExchangeRateDecimals(localChainProtocol),
  ),
  gasPrice: ethers.utils.formatUnits(config.gasPrice, 'gwei'),
});

const percentDifference = (
  actual: ethers.BigNumber,
  expected: ethers.BigNumber,
): ethers.BigNumber => expected.sub(actual).mul(100).div(actual);

const serializePercentDifference = (
  actual: ethers.BigNumber,
  expected: ethers.BigNumber,
): string => {
  if (actual.isZero()) {
    return 'new';
  }
  const diff = percentDifference(actual, expected);
  return diff.isNegative() ? `${diff.toString()}%` : `+${diff.toString()}%`;
};

// TODO: replace once #3771 is fixed
export const oracleConfigToOracleData = (
  config: StorageGasOracleConfig,
): OracleData => ({
  gasPrice: ethers.BigNumber.from(config.gasPrice),
  tokenExchangeRate: ethers.BigNumber.from(config.tokenExchangeRate),
});

export const serializeDifference = (
  localChainProtocol: ProtocolType,
  actual: OracleData,
  expected: OracleData,
): string => {
  const gasPriceDiff = serializePercentDifference(
    actual.gasPrice,
    expected.gasPrice,
  );
  const tokenExchangeRateDiff = serializePercentDifference(
    actual.tokenExchangeRate,
    expected.tokenExchangeRate,
  );

  const productDiff = serializePercentDifference(
    actual.tokenExchangeRate.mul(actual.gasPrice),
    expected.tokenExchangeRate.mul(expected.gasPrice),
  );

  const formatted = formatGasOracleConfig(localChainProtocol, expected);
  return `Exchange rate: ${formatted.tokenExchangeRate} (${tokenExchangeRateDiff}), Gas price: ${formatted.gasPrice} gwei (${gasPriceDiff}), Product diff: ${productDiff}`;
};
