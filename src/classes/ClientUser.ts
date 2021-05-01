import { BaseUser, BaseUserData } from './BaseUser';

import { APIApplication } from 'discord-api-types/v8';
import { Snowflake } from './Snowflake';
import { Client } from '../Client';

interface ClientUserApplicationData
  extends Pick<APIApplication, 'id' | 'flags'> {
  snowflake?: Snowflake;
}

export interface ClientUserData extends BaseUserData {
  application: ClientUserApplicationData;
}

export class ClientUser extends BaseUser implements ClientUserData {
  application!: ClientUserApplicationData;
  constructor($: Client, data: ClientUserData) {
    super($, data);
    this.application.snowflake = new Snowflake(this.application.id);
  }
}
