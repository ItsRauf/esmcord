import {
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { BaseChannel, BaseChannelData } from './BaseChannel';

export type MessageableChannelData = BaseChannelData;

export abstract class MessageableChannel extends BaseChannel {
  constructor(protected $: Client, data: MessageableChannelData) {
    super($, data);
  }

  async send(
    data: RESTPostAPIChannelMessageJSONBody
  ): Promise<RESTPostAPIChannelMessageResult> {
    try {
      if (!data.content || !data.embed) {
        return Promise.reject(new Error('Missing content or embed.'));
      }
      const res = await this.$.http('POST', `/channels/${this.id}/messages`, {
        ...data,
      });
      return await res.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
