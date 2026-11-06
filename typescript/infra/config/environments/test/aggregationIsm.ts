import { AggregationIsmConfig, IsmType } from '@humanode-hyperlane/sdk';

import { merkleRootMultisig, messageIdMultisig } from './multisigIsm.js';

export const aggregationIsm = (validatorKey: string): AggregationIsmConfig => {
  return {
    type: IsmType.AGGREGATION,
    modules: [
      merkleRootMultisig(validatorKey),
      messageIdMultisig(validatorKey),
    ],
    threshold: 1,
  };
};
