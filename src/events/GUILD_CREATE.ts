import { Client } from '../Client';
import { GatewayGuildCreateDispatch } from 'discord-api-types/v8';
import { Guild } from '../classes/Guild';

export default function ($: Client, data: GatewayGuildCreateDispatch): void {
  const guild = new Guild({
    ...data.d,
    unavailable: false,
  });
  $.guilds.set(guild.id, guild);
  $.emit('GuildCreate', guild);
}
