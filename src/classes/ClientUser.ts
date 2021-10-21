import {
  APIUser,
  RESTPatchAPICurrentUserJSONBody,
  RESTPatchAPICurrentUserResult,
} from 'discord-api-types';
import { Client } from '../Client';
import { Base } from './Base';

export interface ClientUser extends APIUser {
  [key: string]: unknown;
}

export class ClientUser extends Base {
  constructor($: Client, data: APIUser) {
    super($);
    Object.assign(this, data);
  }
  public async edit(data: RESTPatchAPICurrentUserJSONBody): Promise<void> {
    try {
      const res = await this.$.http('PATCH', '/users/@me', {
        ...data,
      });
      const currentUserJSON: RESTPatchAPICurrentUserResult = await res.json();
      Object.assign(this, currentUserJSON);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
