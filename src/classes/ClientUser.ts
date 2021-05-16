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

/**
 * The Current User
 *
 * @export
 * @class ClientUser
 * @extends {BaseUser}
 * @implements {ClientUserData}
 */
export class ClientUser extends BaseUser implements ClientUserData {
  application!: ClientUserApplicationData;
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
