import { expect } from 'chai';

import { WarpRouteIds } from '../config/environments/mainnet3/warp/warpIds.js';
import { getRegistry } from '../config/registry.js';

describe('Warp IDs', function () {
  this.timeout(60_000); // 60s timeout for fetching all warp IDs from registry

  it('Has all warp IDs in the registry', async () => {
    // The registry checked out next to the monorepo at the version in
    // .registryrc (REGISTRY_URI overrides it), read from disk: one GitHub API
    // call per warp ID used up the workflow token's hourly limit.
    const registry = getRegistry();
    for (const warpId of Object.values(WarpRouteIds)) {
      const route = await registry.getWarpRoute(warpId);
      expect(
        route,
        `Warp ID ${warpId} not in registry, the .registryrc or your local registry may be out of date`,
      ).to.not.be.null.and.not.be.undefined;
    }
  });
});
