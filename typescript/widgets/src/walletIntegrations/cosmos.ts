import type { AssetList, Chain as CosmosChain } from '@chain-registry/types';
import type { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { useChains } from '@cosmos-kit/react';
import { useCallback } from 'react';

import { CosmosNativeSigner } from '@humanode-hyperlane/cosmos-sdk/runtime';
import { chainMetadataToCosmosChain } from '@humanode-hyperlane/sdk/metadata/chainMetadataConversion';
import {
  type TypedTransactionReceipt,
  ProviderType,
} from '@humanode-hyperlane/sdk/providers/ProviderType';
import type { MultiProviderAdapter } from '@humanode-hyperlane/sdk/providers/MultiProviderAdapter';
import type { ITokenMetadata } from '@humanode-hyperlane/sdk/token/ITokenMetadata';
import type { ChainName } from '@humanode-hyperlane/sdk/types';
import type { WarpTypedTransaction } from '@humanode-hyperlane/sdk/warp/types';
import { assert } from '@humanode-hyperlane/utils';

import { widgetLogger } from '../logger.js';

import {
  ChainTransactionFns,
  SwitchNetworkFns,
  WatchAssetFns,
} from './types.js';
import { getCosmosChainNames, getCosmosChains } from './cosmosWallet.js';

const logger = widgetLogger.child({
  module: 'widgets/walletIntegrations/cosmos',
});
export {
  useCosmosAccount,
  useCosmosActiveChain,
  useCosmosConnectFn,
  useCosmosDisconnectFn,
  useCosmosWalletDetails,
} from './cosmosWallet.js';

export function useCosmosSwitchNetwork(
  multiProvider: MultiProviderAdapter,
): SwitchNetworkFns {
  const onSwitchNetwork = useCallback(
    async (chainName: ChainName) => {
      const displayName =
        multiProvider.getChainMetadata(chainName).displayName || chainName;
      // CosmosKit does not have switch capability
      throw new Error(
        `Cosmos wallet must be connected to origin chain ${displayName}}`,
      );
    },
    [multiProvider],
  );

  return { switchNetwork: onSwitchNetwork };
}

export function useCosmosWatchAsset(
  _multiProvider: MultiProviderAdapter,
): WatchAssetFns {
  const onAddAsset = useCallback(
    async (_token: ITokenMetadata, _activeChainName: ChainName) => {
      throw new Error('Watch asset not available for cosmos');
    },
    [],
  );

  return { addAsset: onAddAsset };
}

export function useCosmosTransactionFns(
  multiProvider: MultiProviderAdapter,
): ChainTransactionFns {
  const cosmosChains = getCosmosChainNames(multiProvider);
  const chainToContext = useChains(cosmosChains);
  const { switchNetwork } = useCosmosSwitchNetwork(multiProvider);

  const onSendTx = useCallback(
    async ({
      tx,
      chainName,
      activeChainName,
    }: {
      tx: WarpTypedTransaction;
      chainName: ChainName;
      activeChainName?: ChainName;
    }) => {
      const chainContext = chainToContext[chainName];
      if (!chainContext?.address)
        throw new Error(`Cosmos wallet not connected for ${chainName}`);

      if (activeChainName && activeChainName !== chainName)
        await switchNetwork(chainName);

      logger.debug(`Sending tx on chain ${chainName}`);
      const {
        getSigningCosmWasmClient,
        getSigningStargateClient,
        getOfflineSigner,
        chain,
      } = chainContext;
      let receipt: DeliverTxResponse;

      if (tx.type === ProviderType.CosmJsWasm) {
        const client = await getSigningCosmWasmClient();
        const executionResult = await client.executeMultiple(
          chainContext.address,
          [tx.transaction],
          'auto',
        );
        const txDetails = await client.getTx(executionResult.transactionHash);
        assert(txDetails, `Cosmos tx failed: ${JSON.stringify(txDetails)}`);
        receipt = {
          ...txDetails,
          transactionHash: executionResult.transactionHash,
        };
      } else if (tx.type === ProviderType.CosmJs) {
        const client = await getSigningStargateClient();
        // The fee param of 'auto' here stopped working for Neutron-based IBC transfers
        // It seems the signAndBroadcast method uses a default fee multiplier of 1.4
        // https://github.com/cosmos/cosmjs/blob/e819a1fc0e99a3e5320d8d6667a08d3b92e5e836/packages/stargate/src/signingstargateclient.ts#L115
        // A multiplier of 1.6 was insufficient for Celestia -> Neutron|Cosmos -> XXX transfers, but 2 worked.
        receipt = await client.signAndBroadcast(
          chainContext.address,
          [tx.transaction],
          2,
        );
      } else if (tx.type === ProviderType.CosmJsNative) {
        const signer = getOfflineSigner();
        const chainMetadata = multiProvider.getChainMetadata(chainName);
        const rpcUrls =
          chain.apis?.rpc?.map((rpc) => ({ http: rpc.address })) ?? [];
        const client = await CosmosNativeSigner.connectWithSigner(
          {
            name: chainMetadata.name,
            protocol: chainMetadata.protocol,
            domainId: chainMetadata.domainId,
            chainId: chainMetadata.chainId,
            bech32Prefix: chainMetadata.bech32Prefix,
            nativeToken: chainMetadata.nativeToken,
            rpcUrls,
            // set zero gas price here so it does not error. actual gas price
            // will be injected from the wallet registry like Keplr or Leap
            gasPrice: {
              amount: '0',
              denom: 'token',
            },
          },
          signer,
        );

        receipt = await client.sendAndConfirmTransaction(tx.transaction);
      } else {
        throw new Error(`Invalid cosmos provider type ${tx.type}`);
      }

      const confirm = async (): Promise<TypedTransactionReceipt> => {
        assert(
          receipt && receipt.code === 0,
          `Cosmos tx failed: ${JSON.stringify(receipt)}`,
        );
        return {
          type: tx.type,
          receipt,
        };
      };
      return { hash: receipt.transactionHash, confirm };
    },
    [switchNetwork, chainToContext],
  );

  const onMultiSendTx = useCallback(
    async ({
      txs: _,
      chainName: __,
      activeChainName: ___,
    }: {
      txs: WarpTypedTransaction[];
      chainName: ChainName;
      activeChainName?: ChainName;
    }) => {
      throw new Error('Multi Transactions not supported on Cosmos');
    },
    [],
  );

  return {
    sendTransaction: onSendTx,
    sendMultiTransaction: onMultiSendTx,
    switchNetwork,
  };
}

// Metadata formatted for use in Wagmi config
export function getCosmosKitChainConfigs(multiProvider: MultiProviderAdapter): {
  chains: CosmosChain[];
  assets: AssetList[];
} {
  const chains = getCosmosChains(multiProvider);
  const configList = chains.map(chainMetadataToCosmosChain);
  return {
    chains: configList.map((c) => c.chain),
    assets: configList.map((c) => c.assets),
  };
}
