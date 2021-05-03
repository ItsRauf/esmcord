import { APIUser } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';

export interface BaseUserData extends APIUser {
  [key: string]: unknown;
}

export class BaseUser extends Base<BaseUserData> implements BaseUserData {
  [key: string]: unknown;
  id!: BaseUserData['id'];
  username!: BaseUserData['username'];
  discriminator!: BaseUserData['discriminator'];
  avatar!: BaseUserData['avatar'];
  bot?: BaseUserData['bot'];
  system?: BaseUserData['system'];
  mfa_enabled?: BaseUserData['mfa_enabled'];
  locale?: BaseUserData['locale'];
  verified?: BaseUserData['verified'];
  email?: BaseUserData['email'];
  flags?: BaseUserData['flags'];
  premium_type?: BaseUserData['premium_type'];
  public_flags?: BaseUserData['public_flags'];

  public snowflake: Snowflake;

  constructor($: Client, data: BaseUserData) {
    super($, data);
    this.snowflake = new Snowflake(data.id);
  }

  /**
   * The discord "tag" for this user (ex. `Rauf#3543`)
   *
   * @readonly
   * @type {string}
   * @memberof BaseUser
   */
  public get tag(): string {
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * The discord mention for this user (ex. `@Rauf#3543`)
   *
   * @readonly
   * @type {string}
   * @memberof BaseUser
   */
  public get mention(): string {
    return this.snowflake.asUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(data: unknown): Promise<void> {
    return Promise.reject(new Error('Update not allowed on this Class'));
  }
}