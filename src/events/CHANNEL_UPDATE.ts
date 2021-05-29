import { Client } from '../Client';
import { GatewayChannelUpdateDispatch } from 'discord-api-types/v8';
import { GuildText } from '../classes/GuildText';
import { Guild } from '../classes/Guild';

export default async function (
  $: Client,
  data: GatewayChannelUpdateDispatch
): Promise<void> {
  if (data.d.guild_id) {
    let guild = $.guilds.get(data.d.guild_id);
    if (!guild) guild = await $.guilds.fetch(data.d.guild_id);
    const oldChannel = (guild as Guild).channels.get(data.d.id)!;
    const newChannel = new GuildText($, guild as Guild, {
      ...data.d,
      owner_id: undefined,
    });
    (guild as Guild).channels.set(newChannel.id, newChannel);
    $.emit('ChannelUpdate', oldChannel, newChannel);
  }
}
