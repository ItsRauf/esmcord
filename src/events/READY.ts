import { GatewayReadyDispatch } from 'discord-api-types';
import { ClientUser } from '../classes/ClientUser';
import { Client } from '../Client';

export default function ($: Client, data: GatewayReadyDispatch): void {
  $.session_id = data.d.session_id;
  $.user = new ClientUser($, data.d.user);
  $.emit('Ready', new Date());
  $.connected = true;
}
