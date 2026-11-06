import { type ArtifactNew } from '@humanode-hyperlane/provider-sdk/artifact';
import {
  TokenType,
  type RawWarpArtifactConfigs,
} from '@humanode-hyperlane/provider-sdk/warp';

import {
  type StarknetRemoteRoutersOnChain,
  type StarknetWarpTokenOnChain,
  StarknetWarpTokenReaderBase,
  StarknetWarpTokenWriterBase,
} from './token-artifact-manager.js';

export class StarknetNativeTokenReader extends StarknetWarpTokenReaderBase<
  'native',
  RawWarpArtifactConfigs['native']
> {
  protected readonly tokenType = 'native' as const;

  protected toConfig(
    token: StarknetWarpTokenOnChain,
    remoteRouters: StarknetRemoteRoutersOnChain,
  ): RawWarpArtifactConfigs['native'] {
    return {
      type: TokenType.native,
      ...this.baseConfig(token, remoteRouters),
    };
  }
}

export class StarknetNativeTokenWriter extends StarknetWarpTokenWriterBase<
  'native',
  RawWarpArtifactConfigs['native']
> {
  protected readonly tokenType = 'native' as const;

  protected toConfig(
    token: StarknetWarpTokenOnChain,
    remoteRouters: StarknetRemoteRoutersOnChain,
  ): RawWarpArtifactConfigs['native'] {
    return {
      type: TokenType.native,
      ...this.baseConfig(token, remoteRouters),
    };
  }

  protected async createToken(
    artifact: ArtifactNew<RawWarpArtifactConfigs['native']>,
  ) {
    const tx = await this.signer.getCreateNativeTokenTransaction({
      signer: this.signer.getSignerAddress(),
      mailboxAddress: artifact.config.mailbox,
    });
    return this.signer.sendAndConfirmTransaction(tx);
  }
}
