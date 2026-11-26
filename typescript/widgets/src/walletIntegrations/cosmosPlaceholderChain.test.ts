import assert from 'node:assert/strict';

import { ProtocolType } from '@humanode-hyperlane/utils';

import { getAddressFromAccountAndChain } from './accountUtils.js';
import { COSMOS_PLACEHOLDER_CHAIN } from './cosmosPlaceholderChain.js';
import { getCosmosChains } from './cosmosWallet.js';

const metadataOf = (chains: Array<{ name: string; protocol: ProtocolType }>) =>
  ({
    metadata: Object.fromEntries(chains.map((c) => [c.name, c])),
  }) as any;

describe('the Cosmos placeholder chain', () => {
  it('is the Cosmos Hub', () => {
    assert.equal(COSMOS_PLACEHOLDER_CHAIN.name, 'cosmoshub');
    assert.equal(COSMOS_PLACEHOLDER_CHAIN.protocol, ProtocolType.Cosmos);
    assert.equal(COSMOS_PLACEHOLDER_CHAIN.chainId, 'cosmoshub-4');
  });

  it('is added to the Cosmos chains when none is configured', () => {
    const chains = getCosmosChains(
      metadataOf([{ name: 'base', protocol: ProtocolType.Ethereum }]),
    );
    assert.deepEqual(
      chains.map((c) => c.name),
      [COSMOS_PLACEHOLDER_CHAIN.name],
    );
  });

  it('is not added twice when the app configures it', () => {
    const chains = getCosmosChains(
      metadataOf([{ name: 'cosmoshub', protocol: ProtocolType.Cosmos }]),
    );
    assert.equal(chains.length, 1);
  });

  it("gives a Cosmos account's address when it has none for the chain", () => {
    const account = {
      protocol: ProtocolType.Cosmos,
      addresses: [
        { address: 'cosmos1hub', chainName: COSMOS_PLACEHOLDER_CHAIN.name },
      ],
    } as any;
    assert.equal(
      getAddressFromAccountAndChain(account, 'neutron'),
      'cosmos1hub',
    );
  });
});
