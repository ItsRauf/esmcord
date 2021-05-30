import { Client } from '../Client';
import {
  ChannelType,
  GatewayMessageUpdateDispatch,
} from 'discord-api-types/v8';
import { DMChannel } from '../classes/DMChannel';
import { Guild } from '../classes/Guild';
import { GuildText } from '../classes/GuildText';

export default async function (
  $: Client,
  data: GatewayMessageUpdateDispatch
): Promise<void> {
  if (data.d.guild_id) {
    const guild = $.guilds.get(data.d.guild_id);
    if (guild instanceof Guild) {
      const channel = guild.channels.get(data.d.channel_id);
      if (channel) {
        const oldMessage = channel.messages.get(data.d.id);
        const newMessage = oldMessage
          ? Object.assign(oldMessage, data.d)
          : await channel.messages.fetch(data.d.id);
        channel.messages.set(newMessage.id, newMessage);
        $.emit('MessageUpdate', oldMessage, newMessage);
      } else {
        const chan = new GuildText($, guild, {
          id: data.d.channel_id,
          type: ChannelType.GUILD_TEXT,
        });
        guild.channels.set(chan.id, chan);
        const message = await chan.messages.fetch(data.d.id);
        chan.messages.set(message.id, message);
        $.emit('MessageUpdate', undefined, message);
      }
    }
  } else {
    const channel = $.directMessages.get(data.d.channel_id);
    if (channel) {
      const oldMessage = channel.messages.get(data.d.id);
      const newMessage = oldMessage
        ? Object.assign(oldMessage, data.d)
        : await channel.messages.fetch(data.d.id);
      channel.messages.set(newMessage.id, newMessage);
      $.emit('DirectMessageUpdate', oldMessage, newMessage);
    } else {
      const dm = new DMChannel($, {
        id: data.d.channel_id,
        type: ChannelType.DM,
      });
      $.directMessages.set(dm.id, dm);
      const message = await dm.messages.fetch(data.d.id);
      dm.messages.set(message.id, message);
      $.emit('DirectMessageUpdate', undefined, message);
    }
  }
}
