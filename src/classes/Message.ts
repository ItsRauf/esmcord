import {
  APIMessage,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { MessageableChannel } from './MessageableChannel';
import { User } from './User';

export interface Message<C extends MessageableChannel> extends APIMessage {
  author: User;
  channel: C;
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
  }

  async edit(data: RESTPostAPIChannelMessageJSONBody): Promise<void> {
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
    } catch (error) {
      return Promise.reject(error);
    }
  }

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
