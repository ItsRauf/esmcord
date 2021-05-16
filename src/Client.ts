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

type GatewayMessage =
  | GatewaySendPayload
  | GatewayReceivePayload
  | GatewayDispatchPayload;

export interface ClientOptions {
  presence?: Record<string, unknown>;
  debug?: boolean;
}

type EventNames = keyof typeof GatewayDispatchEvents;
type Events = { [key in EventNames]: unknown[] };
export interface ClientEvents extends Events {
  RawGatewayMessage: [GatewayMessage];
  Ready: [Date];
  GuildCreate: [Guild];
  MessageCreate: [Message<GuildText>];
  DirectMessageCreate: [Message<DMChannel>];
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
export class Client extends EventEmitter {
  #socket!: Socket;
  public http: typeof HTTPRequest;
  public _connected = false;
  public _heartbeatInterval: number | null = null;
  public _sessionID: string | null = null;
  public _gatewayData!: Record<string, unknown>;
  #user!: ClientUser;
  public guilds: GuildStore;
  public directMessages: DirectMessageStore;

  constructor(public token: string, public opts: ClientOptions) {
    super();
    this.http = HTTPRequest.bind({ token });
    this.opts.presence = this.opts.presence ?? {};
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
                intents: 513,
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
