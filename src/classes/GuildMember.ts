import {
  APIGuildMember,
  RESTPatchAPIGuildMemberJSONBody,
} from 'discord-api-types/v8';
import { Base } from './Base';

export class GuildMember extends Base<APIGuildMember> {
  async edit(data: RESTPatchAPIGuildMemberJSONBody): Promise<void> {
    try {
      data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
