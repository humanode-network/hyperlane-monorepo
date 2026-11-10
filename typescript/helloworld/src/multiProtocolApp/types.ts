import {
  ChainName,
  IRouterAdapter,
  TypedTransaction,
} from '@humanode-hyperlane/sdk';
import { Address } from '@humanode-hyperlane/utils';

export interface IHelloWorldAdapter extends IRouterAdapter {
  populateSendHelloTx: (
    destination: ChainName,
    message: string,
    value: string,
    sender: Address,
  ) => Promise<TypedTransaction>;

  sentStat: (destination: ChainName) => Promise<number>;
}
