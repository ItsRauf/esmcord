import { Client } from '../Client';
import { GatewayGuildMemberAddDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildMember } from '../classes/GuildMember';

export default function ($: Client, data: GatewayGuildMemberAddDispatch): void {
  const guild = $.guilds.get(data.d.guild_id) as Guild;
  if (!guild.unavailable) {
    const guildMember = new GuildMember($, guild, data.d);
    guild.members.set(guildMember.id, guildMember);
    $.emit('GuildMemberAdd', guildMember);
  }
}
