import { BaseUser } from './BaseUser';

import {
  APIApplication,
  APIUser,
  RESTPatchAPICurrentUserJSONBody,
  RESTPatchAPICurrentUserResult,
} from 'discord-api-types/v8';
import { Snowflake } from './Snowflake';
import { Client } from '../Client';

interface ClientUserApplication extends Pick<APIApplication, 'id' | 'flags'> {
  snowflake?: Snowflake;
}

export interface ClientUserData extends APIUser {
  application: ClientUserApplication;
}

export interface ClientUser extends ClientUserData {
  [key: string]: unknown;
}

/**
 * The Current User
 *
 * @export
 * @class ClientUser
 * @extends {BaseUser}
 */
export class ClientUser extends BaseUser {
  constructor(protected $: Client, data: ClientUserData) {
    super($, data);
    this.application.snowflake = new Snowflake(this.application.id);
  }

  /**
   * Edit the ClientUser
   * {@link https://discord.com/developers/docs/resources/user#modify-current-user}
   *
   * ---
   * @param {RESTPatchAPICurrentUserJSONBody} data
   * @return {*}  {Promise<void>}
   * @memberof ClientUser
   */
  public async edit(data: RESTPatchAPICurrentUserJSONBody): Promise<void> {
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
