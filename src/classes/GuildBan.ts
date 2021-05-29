import { APIBan } from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Guild } from './Guild';

interface APIBanWithOptionalUser extends Omit<APIBan, 'user'> {
  user?: APIBan['user'];
}

export interface GuildBan<G extends Guild> extends APIBanWithOptionalUser {
  guild: G;
  id?: APIBan['user']['id'];
}

export class GuildBan<G extends Guild> extends Base<APIBanWithOptionalUser> {
  constructor(
    protected $: Client,
    public guild: G,
    data: APIBanWithOptionalUser
  ) {
    super($, data);
    this.id = data.user?.id;
  }
  edit(): Promise<this> {
    throw new Error('Method not implemented.');
  }

  /**
   * {@link https://discord.com/developers/docs/resources/guild#remove-guild-ban}
   *
   * ---
   * @return {*}  {Promise<void>}
   * @memberof GuildBan
   */
  async unban(): Promise<void> {
    try {
      await this.$.http('DELETE', `/guilds/${this.guild.id}/bans/${this.id}`);
      this.guild.bans.delete(this.id);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
