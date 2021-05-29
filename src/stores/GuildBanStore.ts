import {
  RESTGetAPIGuildBanResult,
  RESTGetAPIGuildBansResult,
  RESTPutAPIGuildBanResult,
} from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildBan } from '../classes/GuildBan';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class GuildBanStore<G extends Guild> extends BaseStore<GuildBan<G>> {
  constructor($: Client, protected guild: G) {
    super($);
  }
  /**
   * {@link https://discord.com/developers/docs/resources/guild#get-guild-ban}
   *
   * ---
   * @param {GuildBan<G>['id']} id
   * @return {*}  {Promise<GuildBan<G>>}
   * @memberof GuildBanStore
   */
  async fetch(id: GuildBan<G>['id']): Promise<GuildBan<G>> {
    try {
      const res = await this.$.http(
        'GET',
        `/guilds/${this.guild.id}/bans/${id}`
      );
      const banJSON: RESTGetAPIGuildBanResult = await res.json();
      const ban = new GuildBan(this.$, this.guild, banJSON);
      this.set(ban.id, ban);
      return ban;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#get-guild-bans}
   *
   * ---
   * @return {*}  {Promise<GuildBan<G>[]>}
   * @memberof GuildBanStore
   */
  async fetchAll(): Promise<GuildBan<G>[]> {
    try {
      const res = await this.$.http('GET', `/guilds/${this.guild.id}/bans`);
      const bansJSON: RESTGetAPIGuildBansResult = await res.json();
      const bans = bansJSON.map(ban => new GuildBan(this.$, this.guild, ban));
      bans.forEach(ban => this.set(ban.id, ban));
      return bans;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
