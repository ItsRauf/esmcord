import { Client } from '../Client';
import { GatewayGuildCreateDispatch } from 'discord-api-types/v8';

export default function ($: Client, data: GatewayGuildCreateDispatch): void {
  $.emit('GuildCreate', data);
}
