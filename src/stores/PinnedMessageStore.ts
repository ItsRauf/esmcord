import { MessageableChannel } from '../classes/MessageableChannel';
import { MessageStore } from './MessageStore';

export class PinnedMessageStore<
  C extends MessageableChannel
> extends MessageStore<C> {}
