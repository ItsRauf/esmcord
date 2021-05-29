import {
  APIGuildMember,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIGuildMemberResult,
  RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Guild } from './Guild';
import { GuildBan } from './GuildBan';
import { User } from './User';

export interface GuildMember<G extends Guild>
  extends Omit<APIGuildMember, 'user'> {
  id: `${bigint}`;
  guild: G;
  user: User;
}
export class GuildMember<G extends Guild> extends Base<APIGuildMember> {
  constructor($: Client, public guild: G, data: APIGuildMember) {
    super($, data);
    this.user = new User($, data.user!);
    this.id = this.user.id;
  }

  async edit(data: RESTPatchAPIGuildMemberJSONBody): Promise<this> {
    try {
      const res = await this.$.http(
        'PATCH',
        `/guilds/${this.guild.id}/members/${this.user.id}`,
        {
          ...data,
        }
      );
      const GuildMemberJSON: RESTPatchAPIGuildMemberResult = await res.json();
      Object.assign(this, new GuildMember(this.$, this.guild, GuildMemberJSON));
      return this;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#create-guild-ban}
   *
   * ---
   * @param {RESTPutAPIGuildBanJSONBody} data
   * @return {*}  {Promise<GuildBan<G>>}
   * @memberof GuildMember
   */
  async ban(data: RESTPutAPIGuildBanJSONBody): Promise<GuildBan<G>> {
    try {
      await this.$.http(
        'PUT',
        `/guilds/${this.guild.id}/bans/${this.user.id}`,
        { ...data }
      );
      const ban = new GuildBan(this.$, this.guild, {
        user: this.user,
        reason: data.reason ?? '',
      });
      this.guild.bans.set(ban.id, ban);
      return ban;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#remove-guild-member}
   *
   * ---
   * @return {*}  {Promise<void>}
   * @memberof GuildMember
   */
  async kick(): Promise<void> {
    try {
      await this.$.http(
        'DELETE',
        `/guilds/${this.guild.id}/members/${this.id}`
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
