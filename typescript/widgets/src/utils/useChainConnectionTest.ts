import { useEffect, useState } from 'react';

import type { ChainMetadata } from '@humanode-hyperlane/sdk/metadata/chainMetadataTypes';
import { isBlockExplorerHealthy } from '@humanode-hyperlane/sdk/providers/explorerHealthTest';
import { isRpcHealthy } from '@humanode-hyperlane/sdk/providers/rpcHealthTest';
import { timeout } from '@humanode-hyperlane/utils';

import { ChainConnectionType } from '../chains/types.js';

const HEALTH_TEST_TIMEOUT = 5000; // 5s

export function useConnectionHealthTest(
  chainMetadata: ChainMetadata,
  index: number,
  type: ChainConnectionType,
) {
  const [isHealthy, setIsHealthy] = useState<boolean | undefined>(undefined);
  const tester =
    type === ChainConnectionType.RPC ? isRpcHealthy : isBlockExplorerHealthy;

  useEffect(() => {
    // TODO run explorer test through CORS proxy, otherwise it's blocked by browser
    if (type === ChainConnectionType.Explorer) return;
    timeout(tester(chainMetadata, index), HEALTH_TEST_TIMEOUT)
      .then((result) => setIsHealthy(result))
      .catch(() => setIsHealthy(false));
  }, [chainMetadata, index, type, tester]);

  return isHealthy;
}
