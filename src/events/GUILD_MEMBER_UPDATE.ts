import { Client } from '../Client';
import { GatewayGuildMemberUpdateDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';
import { GuildMember } from '../classes/GuildMember';

export default function (
  $: Client,
  data: GatewayGuildMemberUpdateDispatch
): void {
  const guild = $.guilds.get(data.d.guild_id) as Guild;
  if (guild.members) {
    if (guild.members.has(data.d.user!.id)) {
      const oldMember = guild.members.get(data.d.user!.id);
      const newMember = new GuildMember($, guild, {
        ...data.d,
        deaf: oldMember?.deaf,
        mute: oldMember?.mute,
      });
      guild.members.set(newMember.id, newMember);
      $.emit('GuildMemberUpdate', oldMember!, newMember);
    } else {
      const newMember = new GuildMember($, guild, {
        ...data.d,
        deaf: undefined,
        mute: undefined,
      });
      guild.members.set(newMember.id, newMember);
      $.emit('GuildMemberUpdate', undefined, newMember);
    }
  }
}
