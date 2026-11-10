import {
  AnnotatedTx,
  TxReceipt,
} from '@humanode-hyperlane/provider-sdk/module';
import type { ContractType } from '@humanode-hyperlane/starknet-core/runtime';
import {
  Call,
  GetTransactionReceiptResponse,
  RawArgs,
  RawArgsArray,
} from 'starknet';

export type StarknetInvokeCall = Omit<Call, 'calldata'> & {
  calldata: RawArgsArray;
};

export type StarknetInvokeTx = AnnotatedTx & {
  kind: 'invoke';
  contractAddress: Call['contractAddress'];
  entrypoint: Call['entrypoint'];
  calldata: RawArgsArray;
  calls?: StarknetInvokeCall[];
};

export type StarknetDeployTx = AnnotatedTx & {
  kind: 'deploy';
  contractName: string;
  contractType?: ContractType;
  constructorArgs: RawArgs;
};

export type StarknetAnnotatedTx = StarknetInvokeTx | StarknetDeployTx;

export type StarknetTxReceipt = TxReceipt & {
  transactionHash: string;
  receipt?: GetTransactionReceiptResponse;
  contractAddress?: string;
};
