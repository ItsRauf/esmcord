import { APIUser } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';

export interface BaseUser extends APIUser {
  [key: string]: unknown;
}

/**
 * {@link https://discord.com/developers/docs/resources/user#user-object}
 *
 * @export
 * @abstract
 * @class BaseUser
 * @extends {Base<APIUser>}
 * @implements {BaseUserData}
 */
export abstract class BaseUser extends Base<APIUser> {
  public snowflake: Snowflake;

  constructor($: Client, data: APIUser) {
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

  abstract edit(data: Record<string, unknown>): Promise<void>;
}
