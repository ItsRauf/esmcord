import { RESTGetAPIChannelResult } from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { MessageableChannel } from '../classes/MessageableChannel';
import { Client } from '../Client';
import { BaseStore } from './BaseStore';

export class ChannelStore extends BaseStore<MessageableChannel> {
  constructor($: Client) {
    super($);
  }
  async fetch(id: Message['id']): Promise<MessageableChannel> {
    try {
      const res = await this.$.http('GET', `/channels/${id}`);
      const channelJSON: MessageableChannel = await res.json();
      // const channel = new MessageableChannel(this.$, {
      //   ...channelJSON,
      // });
      // this.set(channel.id, channel);
      // return channel;
      return channelJSON;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
