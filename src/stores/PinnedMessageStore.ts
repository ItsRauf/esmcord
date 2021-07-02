import { RESTGetAPIChannelPinsResult } from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { MessageableChannel } from '../classes/MessageableChannel';
import { MessageStore } from './MessageStore';

export class PinnedMessageStore<
  C extends MessageableChannel
> extends MessageStore<C> {
  async fetchAll(): Promise<Message<C>[]> {
    try {
      const res = await this.$.http('GET', `/channels/${this.channel.id}/pins`);
      const messages: RESTGetAPIChannelPinsResult = await res.json();
      const msgs = messages.map(m => new Message(this.$, this.channel, m));
      msgs.forEach(m => {
        this.channel.messages.set(m.id, m);
        this.channel.pins.set(m.id, m);
      });
      return msgs;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
