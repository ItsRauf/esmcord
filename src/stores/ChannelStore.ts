import {
  RESTGetAPIChannelResult,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildChannelResult,
} from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildText } from '../classes/GuildText';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class ChannelStore extends BaseStore<GuildText> {
  constructor($: Client, protected guild: Guild) {
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
      const channel = new GuildText(this.$, await this.guild, {
        ...channelJSON,
        owner_id: undefined,
      });
      this.set(channel.id, channel);
      return channel;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#create-guild-channel}
   *
   * ---
   * @param {RESTPostAPIGuildChannelJSONBody} data
   * @return {*}  {Promise<GuildText>}
   * @memberof ChannelStore
   */
  async create(data: RESTPostAPIGuildChannelJSONBody): Promise<GuildText> {
    try {
      const res = await this.$.http(
        'POST',
        `/guilds/${this.guild.id}/channels`,
        data
      );
      const channelJSON: RESTPostAPIGuildChannelResult = await res.json();
      const channel = new GuildText(this.$, await this.guild, {
        ...channelJSON,
        owner_id: undefined,
      });
      this.set(channel.id, channel);
      return channel;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
