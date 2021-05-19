import { BaseUser } from './BaseUser';
import { DMChannel } from './DMChannel';

export class User extends BaseUser {
  edit(): Promise<this> {
    return Promise.reject(new Error('Edit not allowed on this Class'));
  }

  /**
   * Creates a DM with the current user
   * {@link https://discord.com/developers/docs/resources/user#create-dm}
   *
   * ---
   * @param {boolean} [cached=true]
   * @return {*}  {Promise<DMChannel>}
   * @memberof User
   */
  async createDM(cached = true): Promise<DMChannel> {
    try {
      const existing = this.$.directMessages
        .array()
        .find(channel => channel.recipients?.includes(this));
      if (existing && cached) {
        return existing;
      } else {
        return this.$.directMessages.fetch(this.id);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
