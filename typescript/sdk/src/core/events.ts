import type {
  DispatchEvent,
  ProcessEvent,
} from '@humanode-hyperlane/core/mailbox';

export { DispatchEvent, ProcessEvent };

export type HyperlaneLifecyleEvent = ProcessEvent | DispatchEvent;
