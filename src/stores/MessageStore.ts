import { RESTGetAPIChannelMessageResult } from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { MessageableChannel } from '../classes/MessageableChannel';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class MessageStore<
  C extends MessageableChannel
> extends BaseStore<Message> {
  constructor($: Client, protected channel: C) {
    super($);
  }
  async fetch(id: Message['id']): Promise<Message> {
    try {
      const res = await this.$.http(
        'GET',
        `/channels/${this.channel.id}/messages/${id}`
      );
      const messageJSON: RESTGetAPIChannelMessageResult = await res.json();
      const message = new Message(this.$, {
        ...messageJSON,
      });
      this.set(message.id, message);
      return message;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
