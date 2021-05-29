import { Client } from '../Client';
import { GatewayGuildBanRemoveDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildBan } from '../classes/GuildBan';

export default function ($: Client, data: GatewayGuildBanRemoveDispatch): void {
  const guild = $.guilds.get(data.d.guild_id) as Guild;
  const ban = new GuildBan($, guild, { user: data.d.user, reason: '' });
  if (guild.bans.has(ban.id)) {
    const existing = guild.bans.get(ban.id)!;
    guild.bans.delete(existing.id);
    $.emit('GuildBanRemove', existing);
  } else {
    $.emit('GuildBanRemove', ban);
  }
}
