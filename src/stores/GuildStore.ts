import { RESTGetAPIGuildResult } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { UnavailableGuild } from '../classes/UnavailableGuild';
import { Client } from '../Client';

export class GuildStore extends Map<Guild['id'], Guild | UnavailableGuild> {
  constructor(private $: Client) {
    super();
  }
  async fetch(id: Guild['id']): Promise<Guild> {
    try {
      const res = await this.$.http('GET', `/guilds/${id}`);
      const guildJSON: RESTGetAPIGuildResult = await res.json();
      const guild = new Guild(this.$, {
        ...guildJSON,
      });
      this.set(guild.id, guild);
      return guild;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}