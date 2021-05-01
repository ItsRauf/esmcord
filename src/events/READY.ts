import { Client } from '../Client';
import { ClientUser } from '../classes/ClientUser';
import { GatewayReadyDispatch } from 'discord-api-types/v8';
import { UnavailableGuild } from '../classes/UnavailableGuild';

export default function ($: Client, data: GatewayReadyDispatch): void {
  $._connected = true;
  $._sessionID = data.d.session_id;
  $.user = new ClientUser($, {
    ...data.d.user,
    application: data.d.application,
  });
  data.d.guilds.map(g => {
    const guild = new UnavailableGuild($, {
      ...g,
    });
    $.guilds.set(guild.id, guild);
  });
  $.emit('Ready', new Date());
}
