import { Address, HexString } from '@humanode-hyperlane/utils';

export type GetEventLogsResponse = {
  address: Address;
  blockNumber: number;
  data: HexString;
  logIndex: number;
  topics: ReadonlyArray<HexString>;
  transactionHash: HexString;
  transactionIndex: number;
};
