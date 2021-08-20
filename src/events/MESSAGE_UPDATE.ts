import { Client } from '../Client';
import { GatewayMessageUpdateDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';

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
        $.emit('MessageUpdate', newMessage, oldMessage);
      } else {
        const chan = await guild.channels.fetch(data.d.channel_id);
        guild.channels.set(chan.id, chan);
        const message = await chan.messages.fetch(data.d.id);
        chan.messages.set(message.id, message);
        $.emit('MessageUpdate', message);
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
      $.emit('DirectMessageUpdate', newMessage, oldMessage);
    } else {
      const dm = await $.directMessages.fetch(data.d.channel_id);
      $.directMessages.set(dm.id, dm);
      const message = await dm.messages.fetch(data.d.id);
      dm.messages.set(message.id, message);
      $.emit('DirectMessageUpdate', message);
    }
  }
}
