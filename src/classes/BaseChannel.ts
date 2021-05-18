import { APIChannel, RESTDeleteAPIChannelResult } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';

export interface BaseChannel extends APIChannel {
  [key: string]: unknown;
}

/**
 * {@link https://discord.com/developers/docs/resources/channel#channel-object}
 *
 * @export
 * @abstract
 * @class BaseChannel
 * @extends {Base<APIChannel>}
 */
export abstract class BaseChannel extends Base<APIChannel> {
  constructor($: Client, data: APIChannel) {
    super($, data);
  }

  abstract edit(data: Record<string, unknown>): Promise<this>;

  /**
   * {@link https://discord.com/developers/docs/resources/channel#deleteclose-channel}
   *
   * ---
   * @return {*}  {Promise<RESTDeleteAPIChannelResult>}
   * @memberof BaseChannel
   */
  async delete(): Promise<RESTDeleteAPIChannelResult> {
    try {
      const res = await this.$.http('DELETE', `/channels/${this.id}`);
      return await res.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
