import {
  APIGuildMember,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIGuildMemberResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Guild } from './Guild';
import { User } from './User';

export interface GuildMember<G extends Guild>
  extends Omit<APIGuildMember, 'user'> {
  [key: string]: unknown;
  guild: G;
  user: User;
}
export class GuildMember<G extends Guild> extends Base<APIGuildMember> {
  constructor($: Client, public guild: G, data: APIGuildMember) {
    super($, data);
    this.user = new User($, data.user!);
  }

  async edit(data: RESTPatchAPIGuildMemberJSONBody): Promise<this> {
    try {
      const res = await this.$.http(
        'PATCH',
        `/guilds/${this.guild.id}/members/${this.user.id}`,
        {
          ...data,
        }
      );
      const GuildMemberJSON: RESTPatchAPIGuildMemberResult = await res.json();
      Object.assign(this, new GuildMember(this.$, this.guild, GuildMemberJSON));
      return this;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
