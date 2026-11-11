import { spawn } from 'child_process';

import { getArgs, withChainRequired } from './agent-utils.js';
import { getEnvironmentConfig } from './core-utils.js';

async function getRpcUrl() {
  const { environment, chain } = await withChainRequired(getArgs()).argv;
  const environmentConfig = getEnvironmentConfig(environment);
  const registry = await environmentConfig.getRegistry(true);

  const chainMetadata = await registry.getChainMetadata(chain);
  if (!chainMetadata) {
    throw Error(`Unsupported chain: ${chain}`);
  }

  return chainMetadata.rpcUrls[0].http;
}

async function runAnvil(rpcUrl: string) {
  const args = [
    '--fork-url',
    rpcUrl,
    // The initial backoff, in milliseconds, before a failed fork request is
    // retried; rate-limit responses back off from here.
    '--fork-retry-backoff',
    '1000',
    '--gas-price',
    '1',
  ];

  // Anvil paces its fork requests to stay under the provider's budget, in
  // compute units per second, which keeps a free-tier RPC plan from answering
  // 429. Unset, anvil assumes Alchemy's free tier; set it lower when several
  // anvils share one plan.
  const computeUnitsPerSecond = process.env.ANVIL_COMPUTE_UNITS_PER_SECOND;
  if (computeUnitsPerSecond) {
    args.push('--compute-units-per-second', computeUnitsPerSecond);
  }

  // Anvil caches what it reads from the fork under
  // ~/.foundry/cache/rpc/<chain>/<block> and loads that cache on the next
  // start. Forking the latest block resolves to a new block every time, so
  // only a pinned block makes the cache reusable across runs.
  const forkBlockNumber = process.env.ANVIL_FORK_BLOCK_NUMBER;
  if (forkBlockNumber) {
    args.push('--fork-block-number', forkBlockNumber);
  }

  const anvilProcess = spawn('anvil', args, {
    detached: false,
    stdio: ['ignore', 'ignore', 'ignore'],
  });

  anvilProcess.on('exit', (code) => {
    console.log(`Anvil process exited with code ${code}`);
    process.exit(code || 0);
  });

  anvilProcess.on('error', (err) => {
    console.error(`Failed to start Anvil: ${err}`);
    process.exit(1);
  });

  return anvilProcess.pid;
}

async function main() {
  const rpcUrl = await getRpcUrl();
  const anvilPid = await runAnvil(rpcUrl);

  console.log(`Anvil PID: ${anvilPid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
