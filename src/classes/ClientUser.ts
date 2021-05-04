import { BaseUser, BaseUserData } from './BaseUser';

import {
  APIApplication,
  RESTPatchAPICurrentUserJSONBody,
  RESTPatchAPICurrentUserResult,
} from 'discord-api-types/v8';
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
  constructor(protected $: Client, data: ClientUserData) {
    super($, data);
    this.application.snowflake = new Snowflake(this.application.id);
  }
  public async update(data: RESTPatchAPICurrentUserJSONBody): Promise<void> {
    try {
      const res = await this.$.http('PATCH', '/users/@me', {
        ...data,
      });
      const currentUserJSON: RESTPatchAPICurrentUserResult = await res.json();
      Object.assign(
        this,
        new ClientUser(this.$, {
          ...currentUserJSON,
          application: this.application,
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
