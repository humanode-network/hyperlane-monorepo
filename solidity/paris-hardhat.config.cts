import '@nomicfoundation/hardhat-foundry';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-ignore-warnings';
import { subtask } from 'hardhat/config';
import { TASK_COMPILE_SOLIDITY_READ_FILE } from 'hardhat/builtin-tasks/task-names';

import { parisOverrides, readParisSource } from './plugins/paris-source.cjs';
import { rootHardhatConfig } from './rootHardhatConfig.cjs';

// The Paris variant: upstream's contracts, with the overrides under
// `overrides/paris/contracts/` read in place of their upstream files, compiled
// for the `paris` EVM. Humanode's EVM has no Cancun opcodes, so this is the
// variant deployed there; other chains get the default (upstream) build. The
// override content is substituted before Hardhat hashes and parses sources, so
// changes to an override invalidate its incremental cache without touching the
// inputs shared with the default build. Same mechanism as tron-hardhat.config.cts.

let overrides: Map<string, string> | undefined;

subtask(
  TASK_COMPILE_SOLIDITY_READ_FILE,
  async ({ absolutePath }: { absolutePath: string }, { config }, runSuper) => {
    overrides ??= await parisOverrides(config.paths.root);
    return readParisSource(
      config.paths.root,
      absolutePath,
      () => runSuper(),
      overrides,
    );
  },
);

const parisSolidity = {
  ...rootHardhatConfig.solidity,
  settings: {
    ...rootHardhatConfig.solidity.settings,
    evmVersion: 'paris',
  },
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  ...rootHardhatConfig,
  solidity: {
    compilers: [parisSolidity],
    overrides: {
      // The same EIP-170 size pins as hardhat.config.cts; keep in sync.
      'contracts/token/CrossCollateralRouter.sol': {
        ...parisSolidity,
        settings: {
          ...parisSolidity.settings,
          optimizer: { ...parisSolidity.settings.optimizer, runs: 3_599 },
        },
      },
      'contracts/hooks/layerzero/LayerZeroV2HookIsm.sol': {
        ...parisSolidity,
        settings: {
          ...parisSolidity.settings,
          optimizer: { ...parisSolidity.settings.optimizer, runs: 5_199 },
        },
      },
    },
  },
  paths: {
    sources: './contracts',
    cache: './cache-paris',
    artifacts: './artifacts-paris',
  },
  typechain: {
    outDir: './artifacts-paris/typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: true,
    node16Modules: true,
  },
};
