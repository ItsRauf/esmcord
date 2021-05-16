import {
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { MessageStore } from '../stores/MessageStore';
import { BaseChannel, BaseChannelData } from './BaseChannel';
import { Message } from './Message';

export type MessageableChannelData = BaseChannelData;

export abstract class MessageableChannel extends BaseChannel {
  messages: MessageStore<this>;
  constructor(protected $: Client, data: MessageableChannelData) {
    super($, data);
    this.messages = new MessageStore($, this);
  }

  async send(data: RESTPostAPIChannelMessageJSONBody): Promise<Message> {
    try {
      if (!data.content && !data.embed) {
        return Promise.reject(new Error('Missing content or embed.'));
      }
      const res = await this.$.http('POST', `/channels/${this.id}/messages`, {
        ...data,
      });
      const messageJSON = await res.json();
      return new Message(this.$, this, {
        ...messageJSON,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
