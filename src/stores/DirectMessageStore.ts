import { ChannelType, RESTGetAPIChannelResult } from 'discord-api-types/v8';
import { DMChannel } from '../classes/DMChannel';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class DirectMessageStore extends BaseStore<DMChannel> {
  constructor($: Client) {
    super($);
  }

  /**
   * {@link https://discord.com/developers/docs/resources/channel#get-channel}
   *
   * ---
   * @param {DMChannel['id']} id
   * @return {*}  {Promise<DMChannel>}
   * @memberof DirectMessageStore
   */
  async fetch(id: DMChannel['id']): Promise<DMChannel> {
    try {
      const res = await this.$.http('GET', `/channels/${id}`);
      const dmJSON: RESTGetAPIChannelResult = await res.json();
      if (dmJSON.type === ChannelType.DM) {
        const dm = new DMChannel(this.$, {
          ...dmJSON,
          type: ChannelType.DM,
          guild_id: undefined,
        });
        this.set(dm.id, dm);
        return dm;
      } else return Promise.reject(new Error('Channel is not of type DM'));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
