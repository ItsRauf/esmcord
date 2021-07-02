import { Client } from '../Client';
import {
  ChannelType,
  GatewayMessageCreateDispatch,
} from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { DMChannel } from '../classes/DMChannel';
import { Guild } from '../classes/Guild';
import { GuildText } from '../classes/GuildText';

export default async function (
  $: Client,
  data: GatewayMessageCreateDispatch
): Promise<void> {
  if (data.d.guild_id) {
    let guild = $.guilds.get(data.d.guild_id);
    if (guild?.unavailable) guild = await $.guilds.fetch(data.d.guild_id);
    if (guild instanceof Guild) {
      const channel = guild.channels.get(data.d.channel_id);
      if (channel) {
        const message = new Message($, channel, {
          ...data.d,
        });
        channel.messages.set(message.id, message);
        $.emit('MessageCreate', message);
      } else {
        const chan = new GuildText($, guild, {
          id: data.d.channel_id,
          type: ChannelType.GUILD_TEXT,
        });
        guild.channels.set(chan.id, chan);
        const message = new Message($, chan, {
          ...data.d,
        });
        chan.messages.set(message.id, message);
        $.emit('MessageCreate', message);
      }
    }
  } else {
    const channel = $.directMessages.get(data.d.channel_id);
    if (channel) {
      const message = new Message($, channel, {
        ...data.d,
      });
      channel.messages.set(message.id, message);
      $.emit('DirectMessageCreate', message);
    } else {
      const dm = new DMChannel($, {
        id: data.d.channel_id,
        type: ChannelType.DM,
      });
      $.directMessages.set(dm.id, dm);
      const message = new Message($, dm, {
        ...data.d,
      });
      dm.messages.set(message.id, message);
      $.emit('DirectMessageCreate', message);
    }
  }
}
