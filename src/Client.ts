import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayOPCodes,
  GatewayPresenceUpdateData,
  GatewayReceivePayload,
  GatewaySendPayload,
} from 'discord-api-types/v8';

import { ClientUser } from './classes/ClientUser';
import { EventEmitter } from 'events';
import { HTTPRequest } from './helpers/HTTPRequest';
import { Logger } from './helpers/Logger';
import Socket from 'ws';
import { platform } from 'os';
import { Guild } from './classes/Guild';
import { GuildStore } from './stores/GuildStore';
import { DirectMessageStore } from './stores/DirectMessageStore';
import { Message } from './classes/Message';
import { GuildText } from './classes/GuildText';
import { DMChannel } from './classes/DMChannel';
import { Intents } from './Intents';
import { UnavailableGuild } from './classes/UnavailableGuild';
import { GuildBan } from './classes/GuildBan';
import { GuildMember } from './classes/GuildMember';
import { MessageableChannel } from './classes/MessageableChannel';
import { waitUntil } from './helpers/waitUntil';

type GatewayMessage =
  | GatewaySendPayload
  | GatewayReceivePayload
  | GatewayDispatchPayload;

export interface ClientOptions {
  intents: Intents[];
  presence?: GatewayPresenceUpdateData;
  debug?: boolean;
}

// type EventNames = keyof typeof GatewayDispatchEvents;
// type Events = { [key in EventNames]: unknown[] };
export interface ClientEvents {
  ChannelCreate: [channel: GuildText];
  ChannelUpdate: [oldChannel: GuildText, newChannel: GuildText];
  DirectMessageCreate: [message: Message<DMChannel>];
  DirectMessageUpdate: [
    oldMessage: Message<DMChannel> | undefined,
    newMessage: Message<DMChannel>
  ];
  DirectMessagePinned: [message: Message<DMChannel>];
  DirectMessageUnpinned: [message: Message<DMChannel>];
  GuildBanAdd: [ban: GuildBan<Guild>];
  GuildBanRemove: [ban: GuildBan<Guild>];
  GuildCreate: [guild: Guild];
  GuildDelete: [guild: UnavailableGuild];
  GuildMemberAdd: [member: GuildMember<Guild>];
  GuildMemberRemove: [member: GuildMember<Guild>];
  GuildMemberUpdate: [
    oldMember: GuildMember<Guild> | undefined,
    newMember: GuildMember<Guild>
  ];
  GuildUpdate: [oldGuild: Guild, newGuild: Guild];
  MessageCreate: [message: Message<MessageableChannel>];
  MessagePinned: [message: Message<MessageableChannel>];
  MessageUnpinned: [message: Message<MessageableChannel>];
  MessageUpdate: [
    oldMessage: Message<MessageableChannel> | undefined,
    newMessage: Message<MessageableChannel>
  ];
  RawGatewayMessage: [message: GatewayMessage];
  Ready: [timestamp: Date];
}

export interface Client {
  on<E extends keyof ClientEvents>(
    event: E,
    listener: (...args: ClientEvents[E]) => void
  ): this;
  once<E extends keyof ClientEvents>(
    event: E,
    listener: (...args: ClientEvents[E]) => void
  ): this;
  emit<E extends keyof ClientEvents>(
    event: E,
    ...args: ClientEvents[E]
  ): boolean;
}

/**
 * @export
 * @class Client
 * @extends {EventEmitter}
 */
export class Client extends EventEmitter {
  #socket!: Socket;
  public http: typeof HTTPRequest;
  public _presence: GatewayPresenceUpdateData;
  public _connected = false;
  public _heartbeatInterval: number | null = null;
  public _sessionID: string | null = null;
  public _gatewayData!: Record<string, unknown>;
  public _intents: number | bigint;
  #user!: ClientUser;
  public guilds: GuildStore;
  public directMessages: DirectMessageStore;

  constructor(public token: string, public opts: ClientOptions) {
    super();
    this.http = HTTPRequest.bind({ token });
    this.opts.presence =
      this.opts.presence ?? ({} as GatewayPresenceUpdateData);
    this._presence = this.opts.presence;
    this._intents = this.opts.intents.reduce((prev, curr) => prev | curr, 0);
    this.guilds = new GuildStore(this);
    this.directMessages = new DirectMessageStore(this);
    Object.freeze(this.opts);
  }

  public get user(): ClientUser {
    return this.#user;
  }

  public set user(val: ClientUser) {
    this.#user = val;
  }

  public get presence(): GatewayPresenceUpdateData {
    return this._presence;
  }

  async updatePresence(presence: GatewayPresenceUpdateData): Promise<void> {
    if (this._connected) {
      this.#socket.send(
        JSON.stringify({
          op: GatewayOPCodes.PresenceUpdate,
          d: presence,
        })
      );
    } else {
      return Promise.reject(new Error('ESMCord is not connected'));
    }
  }

  /**
   * Connect to the Gateway
   *
   * @return {*}  {Promise<void>}
   * @memberof Client
   */
  public async connect(): Promise<void> {
    this._gatewayData = await (await this.http('GET', '/gateway/bot')).json();
    if (this.opts.debug) Logger.debug('GET /gateway/bot', this._gatewayData);
    this.#socket = new Socket(
      `${
        this._gatewayData?.url ?? 'wss://gateway.discord.gg'
      }?v=8&encoding=json`
    );
    this.#socket.on('open', () => {
      if (this.opts.debug) Logger.debug('Socket Open');
    });
    this.#socket.on('message', async data => {
      const message: GatewayMessage = JSON.parse(data.toString());
      this.emit('RawGatewayMessage', message);
      if (this.opts.debug) Logger.debug('', JSON.stringify(message, null, 2));
      const sendHeartbeat = async () => {
        this.#socket.send(
          JSON.stringify({
            op: GatewayOPCodes.Heartbeat,
            d: null,
          })
        );
      };
      switch (message.op) {
        case GatewayOPCodes.Hello:
          this._heartbeatInterval = message.d.heartbeat_interval;
          sendHeartbeat().then(() => {
            setInterval(sendHeartbeat, this._heartbeatInterval ?? 0);
          });
          this.#socket.send(
            JSON.stringify({
              op: GatewayOPCodes.Identify,
              d: {
                token: this.token,
                properties: {
                  $os: platform(),
                  $browser: 'ESMCord',
                  $device: 'ESMCord',
                },
                intents: this._intents,
                presence: this._presence,
              },
            }),
            err => {
              if (err) throw err;
              this._connected = true;
            }
          );
          break;

        case GatewayOPCodes.Heartbeat:
          sendHeartbeat();
          break;

        case GatewayOPCodes.Dispatch:
          switch (message.t) {
            case GatewayDispatchEvents.Ready:
              (await import(`./events/${message.t}`)).default(this, message);
              break;
            case GatewayDispatchEvents.ChannelCreate:
            case GatewayDispatchEvents.ChannelPinsUpdate:
            case GatewayDispatchEvents.ChannelUpdate:
            case GatewayDispatchEvents.GuildBanAdd:
            case GatewayDispatchEvents.GuildBanRemove:
            case GatewayDispatchEvents.GuildCreate:
            case GatewayDispatchEvents.GuildDelete:
            case GatewayDispatchEvents.GuildMemberAdd:
            case GatewayDispatchEvents.GuildMemberRemove:
            case GatewayDispatchEvents.GuildMemberUpdate:
            case GatewayDispatchEvents.GuildUpdate:
            case GatewayDispatchEvents.MessageCreate:
            case GatewayDispatchEvents.MessageUpdate:
              await waitUntil(() => this._connected);
              (await import(`./events/${message.t}`)).default(this, message);
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    });
  }
}
