import { AltVM } from '@humanode-hyperlane/provider-sdk';
import {
  type ArtifactReader,
  type ArtifactWriter,
} from '@humanode-hyperlane/provider-sdk/artifact';
import {
  type DeployedHookAddress,
  type RawHookArtifactConfigs,
  throwUnsupportedHookType,
} from '@humanode-hyperlane/provider-sdk/hook';

export function createStarknetInterchainGasPaymasterHookReader(): ArtifactReader<
  RawHookArtifactConfigs['interchainGasPaymaster'],
  DeployedHookAddress
> {
  return {
    read: async () => {
      return throwUnsupportedHookType(
        AltVM.HookType.INTERCHAIN_GAS_PAYMASTER,
        'Starknet',
      );
    },
  };
}

export function createStarknetInterchainGasPaymasterHookWriter(): ArtifactWriter<
  RawHookArtifactConfigs['interchainGasPaymaster'],
  DeployedHookAddress
> {
  return {
    read: async () => {
      return throwUnsupportedHookType(
        AltVM.HookType.INTERCHAIN_GAS_PAYMASTER,
        'Starknet',
      );
    },
    create: async () => {
      return throwUnsupportedHookType(
        AltVM.HookType.INTERCHAIN_GAS_PAYMASTER,
        'Starknet',
      );
    },
    update: async () => {
      return throwUnsupportedHookType(
        AltVM.HookType.INTERCHAIN_GAS_PAYMASTER,
        'Starknet',
      );
    },
  };
}
