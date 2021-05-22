import {
  RESTGetAPIGuildMemberResult,
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersResult,
} from 'discord-api-types/v8';
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

  /**
   * {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
   *
   * ---
   * @param {GuildMember<G>['id']} id
   * @return {*}  {Promise<GuildMember<G>>}
   * @memberof GuildMemberStore
   */
  async fetch(id: GuildMember<G>['id']): Promise<GuildMember<G>> {
    try {
      const res = await this.$.http(
        'GET',
        `/guilds/${this.guild.id}/members/${id}`
      );
      const guildMemberJSON: RESTGetAPIGuildMemberResult = await res.json();
      const guildMember = new GuildMember(this.$, this.guild, guildMemberJSON);
      this.set(guildMember.id, guildMember);
      return guildMember;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#list-guild-members}
   *
   * ---
   * @param {RESTGetAPIGuildMembersQuery} query
   * @return {*}  {Promise<GuildMember<G>[]>}
   * @memberof GuildMemberStore
   */
  async fetchAll(
    query: RESTGetAPIGuildMembersQuery
  ): Promise<GuildMember<G>[]> {
    try {
      const res = await this.$.http(
        'GET',
        `/guilds/${this.guild.id}/members`,
        undefined,
        { ...query }
      );
      const guildMembersJSON: RESTGetAPIGuildMembersResult = await res.json();
      const guildMembers = guildMembersJSON.map(
        gm => new GuildMember(this.$, this.guild, gm)
      );
      guildMembers.forEach(gm => this.set(gm.id, gm));
      return guildMembers;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
