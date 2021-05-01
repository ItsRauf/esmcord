import { APIChannel } from 'discord-api-types/v8';
import { Base } from './Base';

export interface BaseChannelData extends APIChannel {
  [key: string]: unknown;
}

export class BaseChannel
  extends Base<BaseChannelData>
  implements BaseChannelData {
  [key: string]: unknown;
  application_id?: BaseChannelData['application_id'];
  bitrate?: BaseChannelData['bitrate'];
  guild_id?: BaseChannelData['guild_id'];
  icon?: BaseChannelData['icon'];
  id!: BaseChannelData['id'];
  last_message_id?: BaseChannelData['last_message_id'];
  last_pin_timestamp?: BaseChannelData['last_pin_timestamp'];
  name?: BaseChannelData['name'];
  nsfw?: BaseChannelData['nsfw'];
  owner_id?: BaseChannelData['owner_id'];
  parent_id?: BaseChannelData['parent_id'];
  permission_overwrites?: BaseChannelData['permission_overwrites'];
  position?: BaseChannelData['position'];
  rate_limit_per_user?: BaseChannelData['rate_limit_per_user'];
  recipients?: BaseChannelData['recipients'];
  topic?: BaseChannelData['topic'];
  type!: BaseChannelData['type'];
  user_limit?: BaseChannelData['user_limit'];

  constructor(data: BaseChannelData) {
    super(data);
  }
}
