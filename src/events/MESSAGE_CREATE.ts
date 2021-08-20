import { Client } from '../Client';
import { GatewayMessageCreateDispatch } from 'discord-api-types/v8';
import { Message } from '../classes/Message';
import { Guild } from '../classes/Guild';

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
        const chan = await guild.channels.fetch(data.d.channel_id);
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
      const dm = await $.directMessages.fetch(data.d.channel_id);
      const message = new Message($, dm, {
        ...data.d,
      });
      dm.messages.set(message.id, message);
      $.emit('DirectMessageCreate', message);
    }
  }
}
