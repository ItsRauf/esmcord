import {
  ChannelType,
  RESTDeleteAPIChannelResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { BaseChannel, BaseChannelData } from './BaseChannel';

export interface DMChannelData extends BaseChannelData {
  type: ChannelType.DM;
}

export class DMChannel extends BaseChannel implements DMChannelData {
  type: ChannelType.DM = 1;

  constructor(private $: Client, data: DMChannelData) {
    super($, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(data: unknown): Promise<void> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }

  async close(): Promise<RESTDeleteAPIChannelResult> {
    try {
      const res = await this.$.http('DELETE', `/channels/${this.id}`);
      return await res.json();
    } catch (error) {
      return Promise.reject(error);
    }
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
