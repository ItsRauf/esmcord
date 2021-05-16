import { APIMessage } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { MessageableChannel } from './MessageableChannel';

export interface MessageData extends APIMessage {
  [key: string]: unknown;
}

export class Message<C extends MessageableChannel>
  extends Base<MessageData>
  implements MessageData {
  [key: string]: unknown;
  id!: MessageData['id'];
  channel_id!: MessageData['channel_id'];
  guild_id?: MessageData['guild_id'];
  author!: MessageData['author'];
  member?: MessageData['member'];
  content!: MessageData['content'];
  timestamp!: MessageData['timestamp'];
  edited_timestamp!: MessageData['edited_timestamp'];
  tts!: MessageData['tts'];
  mention_everyone!: MessageData['mention_everyone'];
  mentions!: MessageData['mentions'];
  mention_roles!: MessageData['mention_roles'];
  mention_channels?: MessageData['mention_channels'];
  attachments!: MessageData['attachments'];
  embeds!: MessageData['embeds'];
  reactions?: MessageData['reactions'];
  nonce?: MessageData['nonce'];
  pinned!: MessageData['pinned'];
  webhook_id?: MessageData['webhook_id'];
  type!: MessageData['type'];
  activity?: MessageData['activity'];
  application?: MessageData['application'];
  message_reference?: MessageData['message_reference'];
  flags?: MessageData['flags'];
  stickers?: MessageData['stickers'];
  referenced_message?: MessageData['referenced_message'];

  constructor(protected $: Client, public channel: C, data: MessageData) {
    super($, data);
  }

  edit(): Promise<void> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }
}
