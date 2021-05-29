import { APIBan } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Guild } from './Guild';

export interface GuildBan<G extends Guild> extends APIBan {
  guild: G;
  id: APIBan['user']['id'];
}

export class GuildBan<G extends Guild> extends Base<APIBan> {
  constructor(protected $: Client, public guild: G, data: APIBan) {
    super($, data);
    this.id = data.user.id;
  }
  edit(): Promise<this> {
    throw new Error('Method not implemented.');
  }
}
