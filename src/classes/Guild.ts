// import {
//   APIChannel,
//   APIEmoji,
//   APIGuild,
//   APIGuildMember,
//   APIGuildWelcomeScreen,
//   APIRole,
//   GatewayPresenceUpdate,
//   GatewayVoiceState,
//   GuildDefaultMessageNotifications,
//   GuildExplicitContentFilter,
//   GuildFeature,
//   GuildMFALevel,
//   GuildPremiumTier,
//   GuildSystemChannelFlags,
//   GuildVerificationLevel,
// } from 'discord-api-types/v8';
import {
  APIGuild,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildResult,
} from 'discord-api-types/v8';
import { Client } from '../Client';
import { Base } from './Base';
import { Snowflake } from './Snowflake';
import { ProxySetToUpdate } from '../helpers/ProxySetToUpdate';
import { ChannelStore } from '../stores/ChannelStore';
import { GuildText } from './GuildText';

export interface GuildData extends APIGuild {
  [key: string]: unknown;
}
export class Guild extends Base<GuildData> {
  [key: string]: unknown;
  afk_channel_id!: GuildData['afk_channel_id'];
  afk_timeout!: GuildData['afk_timeout'];
  application_id!: GuildData['application_id'];
  approximate_member_count?: GuildData['approximate_member_count'];
  approximate_presence_count?: GuildData['approximate_presence_count'];
  banner!: GuildData['banner'];
  channels: ChannelStore;
  default_message_notifications!: GuildData['default_message_notifications'];
  description!: GuildData['description'];
  discovery_splash!: GuildData['discovery_splash'];
  emojis!: GuildData['emojis'];
  explicit_content_filter!: GuildData['explicit_content_filter'];
  features!: GuildData['features'];
  icon!: GuildData['icon'];
  icon_hash?: GuildData['icon_hash'];
  id!: GuildData['id'];
  joined_at?: GuildData['joined_at'];
  large?: GuildData['large'];
  max_members?: GuildData['max_members'];
  max_presences?: GuildData['max_presences'];
  max_video_channel_users?: GuildData['max_video_channel_users'];
  member_count?: GuildData['member_count'];
  members?: GuildData['members'];
  mfa_level!: GuildData['mfa_level'];
  name!: GuildData['name'];
  owner?: GuildData['owner'];
  owner_id!: GuildData['owner_id'];
  permissions?: GuildData['permissions'];
  preferred_locale!: GuildData['preferred_locale'];
  premium_subscription_count?: GuildData['premium_subscription_count'];
  premium_tier!: GuildData['premium_tier'];
  presences?: GuildData['presences'];
  public_updates_channel_id!: GuildData['public_updates_channel_id'];
  region!: GuildData['region'];
  roles!: GuildData['roles'];
  rules_channel_id!: GuildData['rules_channel_id'];
  splash!: GuildData['splash'];
  system_channel_flags!: GuildData['system_channel_flags'];
  system_channel_id!: GuildData['system_channel_id'];
  unavailable?: GuildData['unavailable'];
  vanity_url_code!: GuildData['vanity_url_code'];
  verification_level!: GuildData['verification_level'];
  voice_states?: GuildData['voice_states'];
  welcome_screen?: GuildData['welcome_screen'];
  widget_channel_id?: GuildData['widget_channel_id'];
  widget_enabled?: GuildData['widget_enabled'];

  public snowflake: Snowflake;
  // deletable!: boolean;

  constructor(protected $: Client, data: GuildData) {
    super($, data);
    this.snowflake = new Snowflake(this.id);
    this.channels = new ChannelStore($);
    data.channels?.forEach(channel =>
      this.channels.set(
        channel.id,
        new GuildText($, this, {
          ...channel,
          owner_id: undefined,
        })
      )
    );
    return new Proxy(this, ProxySetToUpdate);
  }

  async edit(data: RESTPatchAPIGuildJSONBody): Promise<void> {
    try {
      const res = await this.$.http('PATCH', `/guilds/${this.id}`, {
        ...data,
      });
      const guildJSON: RESTPatchAPIGuildResult = await res.json();
      Object.assign(
        this,
        new Guild(this.$, {
          ...guildJSON,
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  get deletable(): boolean {
    return this.owner_id === this.$.user.id;
  }

  async delete(): Promise<void> {
    if (this.deletable) {
      await this.$.http('DELETE', `/guilds/${this.id}`);
    } else {
      return Promise.reject(new Error('User is not owner of this guild'));
    }
  }
}
