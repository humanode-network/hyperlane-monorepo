import { Address, ProtocolType } from '@humanode-hyperlane/utils';

import { SendTransactionOptions } from '../providers/MultiProvider.js';
import { ProtocolTypedTransaction } from '../providers/ProviderType.js';

export interface IMultiProtocolSigner<TProtocol extends ProtocolType> {
  address(): Promise<Address>;
  sendAndConfirmTransaction(
    tx: ProtocolTypedTransaction<TProtocol>,
    options?: SendTransactionOptions,
  ): Promise<string>;
}
