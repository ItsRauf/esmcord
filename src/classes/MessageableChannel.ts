import {
  APIChannel,
  RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { MessageStore } from '../stores/MessageStore';
import { BaseChannel } from './BaseChannel';
import { Message } from './Message';

export type MessageableChannelData = APIChannel;

export interface MessageableChannel extends BaseChannel {
  messages: MessageStore<this>;
}

/**
 * @export
 * @abstract
 * @class MessageableChannel
 * @extends {BaseChannel}
 */
export abstract class MessageableChannel extends BaseChannel {
  messages: MessageStore<this>;
  constructor(protected $: Client, data: MessageableChannelData) {
    super($, data);
    this.messages = new MessageStore($, this);
  }

  /**
   * {@link https://discord.com/developers/docs/resources/channel#create-message}
   *
   * ---
   * @param {RESTPostAPIChannelMessageJSONBody} data
   * @return {*}  {Promise<Message<this>>}
   * @memberof MessageableChannel
   */
  async send(data: RESTPostAPIChannelMessageJSONBody): Promise<Message<this>> {
    try {
      if (!data.content && !data.embed) {
        return Promise.reject(new Error('Missing content or embed.'));
      }
      const res = await this.$.http('POST', `/channels/${this.id}/messages`, {
        ...data,
      });
      const messageJSON = await res.json();
      const message = new Message(this.$, this, {
        ...messageJSON,
      });
      this.messages.set(message.id, message);
      return message;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
