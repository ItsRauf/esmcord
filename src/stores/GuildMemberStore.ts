import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildMember } from '../classes/GuildMember';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class GuildMemberStore<G extends Guild> extends BaseStore<
  GuildMember<G>
> {
  constructor($: Client, protected guild: G) {
    super($);
  }

  async fetch(id: GuildMember<G>['id']): Promise<GuildMember<G>> {
    try {
      const res = await this.$.http(
        'GET',
        `/guilds/${this.guild.id}/members/${id}`
      );
      const guildJSON: RESTGetAPIGuildMemberResult = await res.json();
      const guildMember = new GuildMember(this.$, this.guild, guildJSON);
      this.set(guildMember.id, guildMember);
      return guildMember;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
