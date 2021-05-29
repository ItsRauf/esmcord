import {
  APIMessage,
  RESTPostAPIChannelMessageCrosspostResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Guild } from './Guild';
import { MessageableChannel } from './MessageableChannel';
import { User } from './User';

export interface Message<C extends MessageableChannel> extends APIMessage {
  author: User;
  channel: C;
  guild?: Guild;
}

/**
 * {@link https://discord.com/developers/docs/resources/channel#message-object}
 *
 * ---
 * @export
 * @class Message
 * @extends {Base<APIMessage>}
 * @template C {MessageableChannel}
 */
export class Message<C extends MessageableChannel> extends Base<APIMessage> {
  constructor(protected $: Client, public channel: C, data: APIMessage) {
    super($, data);
    this.author = new User($, {
      ...data.author,
    });
    if (data.guild_id) {
      this.guild = $.guilds.get(data.guild_id) as Guild | undefined;
    }
  }

  /**
   * Check if the current user can edit the current Message
   *
   * @readonly
   * @type {boolean}
   * @memberof Message
   */
  get editable(): boolean {
    if (this.author.id === this.$.user.id) return true;
    return false;
  }

  /**
   * Edits the current Message
   * {@link https://discord.com/developers/docs/resources/channel#edit-message}
   *
   * ---
   * @param {RESTPostAPIChannelMessageJSONBody} data
   * @return {*}  {Promise<void>}
   * @memberof Message
   */
  async edit(data: RESTPostAPIChannelMessageJSONBody): Promise<this> {
    if (!this.editable) return Promise.reject(new Error());
    try {
      const res = await this.$.http(
        'POST',
        `/channels/${this.channel_id}/messages/${this.id}`,
        {
          ...data,
        }
      );
      const messageJSON: RESTPostAPIChannelMessageResult = await res.json();
      Object.assign(this, new Message(this.$, this.channel, messageJSON));
      return this;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Crossposts the current message
   * {@link https://discord.com/developers/docs/resources/channel#crosspost-message}
   *
   * ---
   * @return {*}  {Promise<void>}
   * @memberof Message
   */
  async crosspost(): Promise<void> {
    try {
      const res = await this.$.http(
        'POST',
        `/channels/${this.channel_id}/messages/${this.id}/crosspost`
      );
      const messageJSON: RESTPostAPIChannelMessageCrosspostResult =
        await res.json();
      Object.assign(this, new Message(this.$, this.channel, messageJSON));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes the current message
   * {@link https://discord.com/developers/docs/resources/channel#delete-message}
   *
   * ---
   * @return {*}  {Promise<boolean>}
   * @memberof Message
   */
  async delete(): Promise<boolean> {
    try {
      await this.$.http(
        'DELETE',
        `/channels/${this.channel_id}/messages/${this.id}`
      );
      return this.channel.messages.delete(this.id);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
