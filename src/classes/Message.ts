import { APIMessage } from 'discord-api-types/v8';
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

  edit(): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
}
