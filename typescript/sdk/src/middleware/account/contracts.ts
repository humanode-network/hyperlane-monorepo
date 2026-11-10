import { InterchainAccountRouter__factory } from '@humanode-hyperlane/core';

export const interchainAccountFactories = {
  interchainAccountRouter: new InterchainAccountRouter__factory(),
};

export type InterchainAccountFactories = typeof interchainAccountFactories;
