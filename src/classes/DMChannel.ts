import { ChannelType, RESTDeleteAPIChannelResult } from 'discord-api-types/v8';
import { Client } from '../Client';
import {
  MessageableChannel,
  MessageableChannelData,
} from './MessageableChannel';

export interface DMChannelData extends MessageableChannelData {
  type: ChannelType.DM;
}

export class DMChannel extends MessageableChannel implements DMChannelData {
  type: ChannelType.DM = 1;

  constructor(protected $: Client, data: DMChannelData) {
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
}
