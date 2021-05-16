import { Client } from '../Client';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface GuildTextData extends MessageableChannelData {
  [key: string]: unknown;
}

export class GuildText extends MessageableChannel {
  constructor(protected $: Client, data: GuildTextData) {
    super($, data);
  }

  update(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
