import { ChannelType, RESTDeleteAPIChannelResult } from 'discord-api-types/v8';
import { Client } from '../Client';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface DMChannelData extends MessageableChannelData {
  type: ChannelType.DM;
  guild_id?: never;
}

/**
 * Direct Message Channel
 *
 * @export
 * @class DMChannel
 * @extends {MessageableChannel}
 * @implements {DMChannelData}
 */
export class DMChannel extends MessageableChannel implements DMChannelData {
  type: ChannelType.DM = 1;
  guild_id?: never;
  delete: never;

  constructor(protected $: Client, data: DMChannelData) {
    super($, data);
  }

  edit(): Promise<void> {
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
