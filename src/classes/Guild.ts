import {
  APIGuild,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';
import { ProxySetToEdit } from '../helpers/ProxySetToEdit';
import { ChannelStore } from '../stores/ChannelStore';
import { GuildText } from './GuildText';

export interface Guild extends Omit<APIGuild, 'channels'> {
  channels: ChannelStore;
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
    this.channels = new ChannelStore($);
    data.channels?.forEach(channel =>
      this.channels.set(
        channel.id,
        new GuildText($, this, {
          ...channel,
          owner_id: undefined,
        })
      )
    );
    return new Proxy(this, ProxySetToEdit);
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
  async edit(data: RESTPatchAPIGuildJSONBody): Promise<void> {
    try {
      const res = await this.$.http('PATCH', `/guilds/${this.id}`, {
        ...data,
      });
      const guildJSON: RESTPatchAPIGuildResult = await res.json();
      Object.assign(
        this,
        new Guild(this.$, {
          ...guildJSON,
        })
      );
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
}
