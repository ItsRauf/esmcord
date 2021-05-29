import { Client } from '../Client';
import { GatewayGuildDeleteDispatch } from 'discord-api-types/v8';
import { UnavailableGuild } from '../classes/UnavailableGuild';

export default async function (
  $: Client,
  data: GatewayGuildDeleteDispatch
): Promise<void> {
  const guild = $.guilds.get(data.d.id) as UnavailableGuild;
  if (!data.d.unavailable) {
    $.guilds.delete(guild.id);
  }
  $.emit('GuildDelete', guild);
}
