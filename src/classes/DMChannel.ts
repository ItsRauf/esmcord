import { ChannelType, RESTDeleteAPIChannelResult } from 'discord-api-types/v8';
import { Client } from '../Client';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface DMChannel extends MessageableChannel {
  type: ChannelType.DM;
  guild_id?: never;
  delete: never;
}

/**
 * Direct Message Channel
 *
 * @export
 * @class DMChannel
 * @extends {MessageableChannel}
 */
export class DMChannel extends MessageableChannel {
  constructor(protected $: Client, data: MessageableChannelData) {
    super($, data);
  }

  edit(): Promise<this> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }

  /**
   * {@link https://discord.com/developers/docs/resources/channel#deleteclose-channel}
   *
   * ---
   * @return {*}  {Promise<RESTDeleteAPIChannelResult>}
   * @memberof DMChannel
   */
  async close(): Promise<RESTDeleteAPIChannelResult> {
    return super.delete();
  }
}
