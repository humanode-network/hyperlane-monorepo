import {
  ProtocolType,
  hasProtocol,
  registerProtocol,
} from '@humanode-hyperlane/provider-sdk';
import { rootLogger } from '@humanode-hyperlane/utils';

export async function loadProtocolProviders(
  neededProtocols: Set<ProtocolType>,
) {
  for (const protocol of neededProtocols) {
    if (hasProtocol(protocol)) {
      rootLogger.debug(`${protocol} already loaded`);
      continue;
    }
    switch (protocol) {
      case ProtocolType.CosmosNative: {
        const { CosmosNativeProtocolProvider } =
          await import('@humanode-hyperlane/cosmos-sdk');
        registerProtocol(protocol, () => new CosmosNativeProtocolProvider());
        break;
      }
      case ProtocolType.Radix: {
        const { RadixProtocolProvider } =
          await import('@humanode-hyperlane/radix-sdk');
        registerProtocol(protocol, () => new RadixProtocolProvider());
        break;
      }
      case ProtocolType.Aleo: {
        const { AleoProtocolProvider } =
          await import('@humanode-hyperlane/aleo-sdk');
        registerProtocol(protocol, () => new AleoProtocolProvider());
        break;
      }
      case ProtocolType.Sealevel: {
        const { SealevelProtocolProvider } =
          await import('@humanode-hyperlane/sealevel-sdk');
        registerProtocol(protocol, () => new SealevelProtocolProvider());
        break;
      }
      case ProtocolType.Starknet: {
        const { StarknetProtocolProvider } =
          await import('@humanode-hyperlane/starknet-sdk/runtime');
        registerProtocol(protocol, () => new StarknetProtocolProvider());
        break;
      }
    }
  }
}
