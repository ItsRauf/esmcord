import { RESTGetAPIChannelResult } from 'discord-api-types/v8';
import { GuildText } from '../classes/GuildText';
import { Message } from '../classes/Message';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class ChannelStore extends BaseStore<GuildText> {
  constructor($: Client) {
    super($);
  }
  async fetch(id: Message<GuildText>['id']): Promise<GuildText> {
    try {
      const res = await this.$.http('GET', `/channels/${id}`);
      const channelJSON: RESTGetAPIChannelResult = await res.json();
      const channel = new GuildText(this.$, {
        ...channelJSON,
        owner_id: undefined,
        guild: await this.$.guilds.fetch(channelJSON.guild_id!),
      });
      this.set(channel.id, channel);
      return channel;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
