import { Client } from '../Client';
import { GatewayGuildMemberRemoveDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';

export default function (
  $: Client,
  data: GatewayGuildMemberRemoveDispatch
): void {
  const guild = $.guilds.get(data.d.guild_id) as Guild;
  if (!guild.unavailable) {
    const guildMember = guild.members.get(data.d.user.id);
    $.emit('GuildMemberRemove', guildMember!);
  }
}
