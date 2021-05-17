import { BaseUser } from './BaseUser';

export class User extends BaseUser {
  async edit(): Promise<void> {
    return Promise.reject(new Error('Edit not allowed on this Class'));
  }
}
