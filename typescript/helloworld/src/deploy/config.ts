import { chainMetadata } from '@humanode-hyperlane/registry';
import { RouterConfig } from '@humanode-hyperlane/sdk';

export type HelloWorldConfig = RouterConfig;

// SET DESIRED NETWORKS HERE OR USE THE DEFAULT SET FROM THE REGISTRY
export const prodConfigs = {
  ...chainMetadata,
};
