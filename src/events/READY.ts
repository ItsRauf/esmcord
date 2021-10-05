import { GatewayReadyDispatch } from 'discord-api-types';
import { Client } from '../Client';

export default function ($: Client, data: GatewayReadyDispatch): void {
  $.session_id = data.d.session_id;
  $.emit('Ready', new Date());
  $.connected = true;
}
