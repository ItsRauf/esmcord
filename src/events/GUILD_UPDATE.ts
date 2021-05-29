import { Client } from '../Client';
import { GatewayGuildUpdateDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';

export default async function (
  $: Client,
  data: GatewayGuildUpdateDispatch
): Promise<void> {
  const oldGuild = $.guilds.get(data.d.id) as Guild;
  const newGuild = new Guild($, data.d);
  $.guilds.set(newGuild.id, newGuild);
  $.emit('GuildUpdate', oldGuild, newGuild);
}
