import { Client } from '../Client';
import { Guild } from './Guild';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface GuildTextData extends MessageableChannelData {
  owner_id?: never | undefined;
}

export interface GuildText extends GuildTextData {
  [key: string]: unknown;
  owner_id: never;
}

/**
 * @export
 * @class GuildText
 * @extends {MessageableChannel}
 */
export class GuildText extends MessageableChannel {
  constructor(protected $: Client, public guild: Guild, data: GuildTextData) {
    super($, data);
  }

  edit(): Promise<this> {
    throw new Error('Method not implemented.');
  }
}
