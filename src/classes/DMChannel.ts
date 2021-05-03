import { ChannelType } from 'discord-api-types/v8';
import { BaseChannel, BaseChannelData } from './BaseChannel';

export interface DMChannelData extends BaseChannelData {
  type: ChannelType.DM;
}

export class DMChannel extends BaseChannel implements DMChannelData {
  type: ChannelType.DM = 1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(data: unknown): Promise<void> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }
}
