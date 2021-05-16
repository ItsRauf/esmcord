import { RESTGetAPIChannelMessageResult } from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { MessageableChannel } from '../classes/MessageableChannel';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class MessageStore<C extends MessageableChannel> extends BaseStore<
  Message<C>
> {
  constructor($: Client, protected channel: C) {
    super($);
  }
  /**
   * {@link https://discord.com/developers/docs/resources/channel#get-channel-message}
   *
   * ---
   * @param {Message<C>['id']} id
   * @return {*}  {Promise<Message<C>>}
   * @memberof MessageStore
   */
  async fetch(id: Message<C>['id']): Promise<Message<C>> {
    try {
      const res = await this.$.http(
        'GET',
        `/channels/${this.channel.id}/messages/${id}`
      );
      const messageJSON: RESTGetAPIChannelMessageResult = await res.json();
      const message = new Message(this.$, this.channel, {
        ...messageJSON,
      });
      this.set(message.id, message);
      return message;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
