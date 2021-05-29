import { Client } from '../Client';
import { GatewayGuildBanAddDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildBan } from '../classes/GuildBan';

export default function ($: Client, data: GatewayGuildBanAddDispatch): void {
  const guild = $.guilds.get(data.d.guild_id) as Guild;
  const ban = new GuildBan($, guild, { user: data.d.user, reason: '' });
  if (!guild.bans.has(ban.id)) {
    guild.bans.set(ban.id, ban);
    $.emit('GuildBanAdd', ban);
  } else {
    const exisingBan = guild.bans.get(ban.id)!;
    $.emit('GuildBanAdd', exisingBan);
  }
}
