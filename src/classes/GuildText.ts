import { Client } from '../Client';
import { Guild } from './Guild';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface GuildTextData extends MessageableChannelData {
  owner_id?: never;
  guild: Guild;
}

export class GuildText extends MessageableChannel {
  owner_id?: never;
  constructor(protected $: Client, data: GuildTextData) {
    super($, data);
  }

  update(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
