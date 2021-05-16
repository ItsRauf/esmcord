import { RESTGetAPIChannelResult } from 'discord-api-types/v8';
import { GuildText } from '../classes/GuildText';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class ChannelStore extends BaseStore<GuildText> {
  constructor($: Client) {
    super($);
  }

  /**
   * {@link https://discord.com/developers/docs/resources/channel#get-channel}
   *
   * ---
   * @param {GuildText['id']} id
   * @return {*}  {Promise<GuildText>}
   * @memberof ChannelStore
   */
  async fetch(id: GuildText['id']): Promise<GuildText> {
    try {
      const res = await this.$.http('GET', `/channels/${id}`);
      const channelJSON: RESTGetAPIChannelResult = await res.json();
      const channel = new GuildText(
        this.$,
        await this.$.guilds.fetch(channelJSON.guild_id!),
        {
          ...channelJSON,
          owner_id: undefined,
        }
      );
      this.set(channel.id, channel);
      return channel;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
