import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayOPCodes,
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

type GatewayMessage =
  | GatewaySendPayload
  | GatewayReceivePayload
  | GatewayDispatchPayload;

export interface ClientOptions {
  intents: Intents[];
  presence?: Record<string, unknown>;
  debug?: boolean;
}

// type EventNames = keyof typeof GatewayDispatchEvents;
// type Events = { [key in EventNames]: unknown[] };
export interface ClientEvents {
  RawGatewayMessage: [message: GatewayMessage];
  Ready: [timestamp: Date];
  GuildCreate: [guild: Guild];
  MessageCreate: [message: Message<GuildText>];
  DirectMessageCreate: [message: Message<DMChannel>];
  ChannelCreate: [channel: GuildText];
  ChannelUpdate: [oldChannel: GuildText, newChannel: GuildText];
  GuildUpdate: [oldGuild: Guild, newGuild: Guild];
  GuildDelete: [guild: UnavailableGuild];
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
  protected _connected = false;
  protected _heartbeatInterval: number | null = null;
  protected _sessionID: string | null = null;
  protected _gatewayData!: Record<string, unknown>;
  protected _intents: number | bigint;
  #user!: ClientUser;
  public guilds: GuildStore;
  public directMessages: DirectMessageStore;

  constructor(public token: string, public opts: ClientOptions) {
    super();
    this.http = HTTPRequest.bind({ token });
    this.opts.presence = this.opts.presence ?? {};
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
              },
            })
          );
          break;

        case GatewayOPCodes.Heartbeat:
          sendHeartbeat();
          break;

        case GatewayOPCodes.Dispatch:
          switch (message.t) {
            case GatewayDispatchEvents.Ready:
            case GatewayDispatchEvents.GuildCreate:
            case GatewayDispatchEvents.MessageCreate:
            case GatewayDispatchEvents.ChannelCreate:
            case GatewayDispatchEvents.ChannelUpdate:
            case GatewayDispatchEvents.GuildUpdate:
            case GatewayDispatchEvents.GuildDelete:
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
