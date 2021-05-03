import { APIUnavailableGuild } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';

export interface UnavailableGuildData extends APIUnavailableGuild {
  [key: string]: unknown;
}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(data: unknown): Promise<void> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }
}