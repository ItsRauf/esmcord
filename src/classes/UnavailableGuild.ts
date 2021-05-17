import { APIUnavailableGuild } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';

export interface UnavailableGuild extends APIUnavailableGuild {
  [key: string]: unknown;
}

/**
 * @export
 * @class UnavailableGuild
 * @extends {Base<APIUnavailableGuild>}
 */
export class UnavailableGuild extends Base<APIUnavailableGuild> {
  public snowflake: Snowflake;

  constructor($: Client, data: APIUnavailableGuild) {
    super($, data);
    this.snowflake = new Snowflake(this.id);
  }

  async edit(): Promise<void> {
    return Promise.reject(new Error('Edit not allowed on this Class'));
  }
}
