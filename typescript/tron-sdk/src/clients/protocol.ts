import {
  type AltVM,
  type ChainMetadataForAltVM,
  type ITransactionSubmitter,
  type MinimumRequiredGasByAction,
  type ProtocolProvider,
  type SignerConfig,
  type TransactionSubmitterConfig,
} from '@humanode-hyperlane/provider-sdk';
import { type IProvider } from '@humanode-hyperlane/provider-sdk/altvm';
import { type IRawHookArtifactManager } from '@humanode-hyperlane/provider-sdk/hook';
import { type IRawIsmArtifactManager } from '@humanode-hyperlane/provider-sdk/ism';
import { type IRawMailboxArtifactManager } from '@humanode-hyperlane/provider-sdk/mailbox';
import {
  type AnnotatedTx,
  type TxReceipt,
} from '@humanode-hyperlane/provider-sdk/module';
import { type IRawWarpArtifactManager } from '@humanode-hyperlane/provider-sdk/warp';
import { type IRawValidatorAnnounceArtifactManager } from '@humanode-hyperlane/provider-sdk/validator-announce';
import { assert } from '@humanode-hyperlane/utils';

import { TronProvider } from './provider.js';
import { TronSigner } from './signer.js';

export class TronProtocolProvider implements ProtocolProvider {
  createProvider(chainMetadata: ChainMetadataForAltVM): Promise<IProvider> {
    assert(chainMetadata.rpcUrls, 'rpc urls undefined');
    const rpcUrls = chainMetadata.rpcUrls.map((rpc) => rpc.http);
    return TronProvider.connect(rpcUrls);
  }

  async createSigner(
    chainMetadata: ChainMetadataForAltVM,
    config: SignerConfig,
  ): Promise<AltVM.ISigner<AnnotatedTx, TxReceipt>> {
    assert(chainMetadata.rpcUrls, 'rpc urls undefined');
    const rpcUrls = chainMetadata.rpcUrls.map((rpc) => rpc.http);

    const { privateKey } = config;

    return TronSigner.connectWithSigner(rpcUrls, privateKey, {
      metadata: chainMetadata,
    });
  }

  createSubmitter<TConfig extends TransactionSubmitterConfig>(
    _chainMetadata: ChainMetadataForAltVM,
    _config: TConfig,
  ): Promise<ITransactionSubmitter> {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  createIsmArtifactManager(
    _chainMetadata: ChainMetadataForAltVM,
  ): IRawIsmArtifactManager {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  createHookArtifactManager(
    _chainMetadata: ChainMetadataForAltVM,
    _context?: { mailbox?: string; proxyAdmin?: string },
  ): IRawHookArtifactManager {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  createWarpArtifactManager(
    _chainMetadata: ChainMetadataForAltVM,
    _context?: { mailbox?: string },
  ): IRawWarpArtifactManager {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  createMailboxArtifactManager(
    _chainMetadata: ChainMetadataForAltVM,
  ): IRawMailboxArtifactManager {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  createValidatorAnnounceArtifactManager(
    _chainMetadata: ChainMetadataForAltVM,
  ): IRawValidatorAnnounceArtifactManager | null {
    // @TODO Implement in a follow up PR
    throw Error('Not implemented');
  }

  getMinGas(): MinimumRequiredGasByAction {
    return {
      CORE_DEPLOY_GAS: BigInt(1e9),
      WARP_DEPLOY_GAS: BigInt(1e9),
      ISM_DEPLOY_GAS: BigInt(1e9),
      TEST_SEND_GAS: BigInt(1e9),
      AVS_GAS: BigInt(1e9),
    };
  }
}
