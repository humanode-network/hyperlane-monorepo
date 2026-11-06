import { BuildArtifact, ChainMap } from '@humanode-hyperlane/sdk';
import { readJson } from '@humanode-hyperlane/utils/fs';

import { fetchGCPSecret } from '../utils/gcloud.js';

// read build artifact from given path
export function extractBuildArtifact(buildArtifactPath: string): BuildArtifact {
  // check provided artifact is JSON
  if (!buildArtifactPath.endsWith('.json')) {
    throw new Error('Source must be a JSON file.');
  }

  // return as BuildArtifact
  return readJson<BuildArtifact>(buildArtifactPath);
}

// fetch explorer API keys from GCP
export async function fetchExplorerApiKeys(): Promise<ChainMap<string>> {
  return (await fetchGCPSecret('explorer-api-keys', true)) as any;
}
