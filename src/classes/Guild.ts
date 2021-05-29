import {
  APIGuild,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildResult,
  RESTPutAPIGuildBanJSONBody,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';
import { ChannelStore } from '../stores/ChannelStore';
import { GuildText } from './GuildText';
import { GuildBanStore } from '../stores/GuildBanStore';
import { GuildMemberStore } from '../stores/GuildMemberStore';
import { GuildMember } from './GuildMember';
import { User } from './User';
import { GuildBan } from './GuildBan';

export interface Guild extends Omit<APIGuild, 'channels' | 'members'> {
  channels: ChannelStore;
  members: GuildMemberStore<Guild>;
  bans: GuildBanStore<Guild>;
}
/**
 * {@link https://discord.com/developers/docs/resources/guild#guild-object}
 *
 * ---
 * @export
 * @class Guild
 * @extends {Base<APIGuild>}
 */
export class Guild extends Base<APIGuild> {
  [key: string]: unknown;
  public snowflake: Snowflake;
  // deletable!: boolean;

  constructor(protected $: Client, data: APIGuild) {
    super($, data);
    this.snowflake = new Snowflake(this.id);
    this.bans = new GuildBanStore($, this);
    this.channels = new ChannelStore($, this);
    data.channels?.forEach(channel =>
      this.channels.set(
        channel.id,
        new GuildText($, this, {
          ...channel,
          owner_id: undefined,
        })
      )
    );
    this.members = new GuildMemberStore($, this);
    data.members?.forEach(member => {
      this.members.set(member.user!.id, new GuildMember($, this, member));
    });
  }

  /**
   * Modify the current guild
   * {@link https://discord.com/developers/docs/resources/guild#modify-guild}
   *
   * ---
   * @param {RESTPatchAPIGuildJSONBody} data
   * @return {*}  {Promise<void>}
   * @memberof Guild
   */
  async edit(data: RESTPatchAPIGuildJSONBody): Promise<this> {
    try {
      const res = await this.$.http('PATCH', `/guilds/${this.id}`, {
        ...data,
      });
      const guildJSON: RESTPatchAPIGuildResult = await res.json();
      Object.assign(this, new Guild(this.$, guildJSON));
      return this;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Check if the current guild is deleteable
   *
   * @readonly
   * @type {boolean}
   * @memberof Guild
   */
  get deletable(): boolean {
    return this.owner_id === this.$.user.id;
  }

  /**
   * Delete the current guild
   * {@link https://discord.com/developers/docs/resources/guild#delete-guild}
   *
   * ---
   * @return {*}  {Promise<void>}
   * @memberof Guild
   */
  async delete(): Promise<void> {
    if (this.deletable) {
      await this.$.http('DELETE', `/guilds/${this.id}`);
    } else {
      return Promise.reject(new Error('User is not owner of this guild'));
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#create-guild-ban}
   *
   * ---
   * @param {User['id']} id
   * @param {RESTPutAPIGuildBanJSONBody} data
   * @return {*}  {Promise<GuildBan<this>>}
   * @memberof Guild
   */
  async forceban(
    id: User['id'],
    data: RESTPutAPIGuildBanJSONBody
  ): Promise<GuildBan<this>> {
    try {
      await this.$.http('PUT', `/guilds/${this.id}/bans/${id}`, { ...data });
      const ban = new GuildBan(this.$, this, {
        reason: data.reason ?? '',
      });
      return ban;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
   *
   * ---
   * @param {User['id']} id
   * @return {*}  {Promise<void>}
   * @memberof Guild
   */
  async unban(id: User['id']): Promise<void> {
    try {
      await this.$.http('DELETE', `/guilds/${this.id}/bans/${id}`);
      this.bans.delete(id);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
