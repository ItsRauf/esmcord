import { APIUnavailableGuild } from 'discord-api-types/v8';
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

  constructor(data: UnavailableGuildData) {
    super(data);
    this.snowflake = new Snowflake(this.id);
  }
}
