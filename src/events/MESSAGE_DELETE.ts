import { Client } from '../Client';
import { GatewayMessageDeleteDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';

export default async function (
  $: Client,
  data: GatewayMessageDeleteDispatch
): Promise<void> {
  if (data.d.guild_id) {
    const guild = $.guilds.get(data.d.guild_id);
    if (guild instanceof Guild) {
      const channel = guild.channels.get(data.d.channel_id);
      if (channel) {
        const message = channel.messages.get(data.d.id);
        if (message) channel.messages.delete(message.id);
        $.emit('MessageDelete', message);
      } else {
        await guild.channels.fetch(data.d.channel_id);
        $.emit('MessageDelete');
      }
    }
  } else {
    const channel = $.directMessages.get(data.d.channel_id);
    if (channel) {
      const message = channel.messages.get(data.d.id);
      if (message) channel.messages.delete(message.id);
      $.emit('DirectMessageDelete', message);
    } else {
      await $.directMessages.fetch(data.d.channel_id);
      $.emit('DirectMessageDelete');
    }
  }
}
