import { Client } from '../Client';
import { Guild } from './Guild';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface GuildTextData extends MessageableChannelData {
  owner_id?: never;
}

export class GuildText
  extends MessageableChannel
  implements MessageableChannelData {
  owner_id?: never;
  constructor(protected $: Client, public guild: Guild, data: GuildTextData) {
    super($, data);
  }

  edit(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
