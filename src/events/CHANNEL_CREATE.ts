import { Client } from '../Client';
import { GatewayChannelCreateDispatch } from 'discord-api-types/v8';
import { GuildText } from '../classes/GuildText';
import { Guild } from '../classes/Guild';

export default async function ($: Client, data: GatewayChannelCreateDispatch): Promise<void> {
  if (data.d.guild_id) {
    let guild = $.guilds.get(data.d.guild_id);
    if (!guild) guild = await $.guilds.fetch(data.d.guild_id);
    const channel = new GuildText($, guild as Guild, {
      ...data.d,
      owner_id: undefined,
    })
    $.emit('ChannelCreate', channel)
  }
}
