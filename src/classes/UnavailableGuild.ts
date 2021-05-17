import { APIUnavailableGuild } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';

export interface UnavailableGuildData extends APIUnavailableGuild {
  [key: string]: unknown;
}

/**
 * @export
 * @class UnavailableGuild
 * @extends {Base<UnavailableGuildData>}
 * @implements {UnavailableGuildData}
 */
export class UnavailableGuild
  extends Base<UnavailableGuildData>
  implements UnavailableGuildData {
  [key: string]: unknown;
  id!: UnavailableGuildData['id'];
  unavailable!: UnavailableGuildData['unavailable'];

  public snowflake: Snowflake;

  constructor($: Client, data: UnavailableGuildData) {
    super($, data);
    this.snowflake = new Snowflake(this.id);
  }

  async edit(): Promise<void> {
    return Promise.reject(new Error('Edit not allowed on this Class'));
  }
}
