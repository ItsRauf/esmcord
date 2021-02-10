import { EventEmitter } from 'events';
import { HTTPRequest } from './helpers/HTTPRequest';
import { Logger } from './helpers/Logger';
import Socket from 'ws';
import { platform } from 'os';

interface GatewayMessage {
  op: number;
  d?: Record<string, unknown>;
  s?: number | null;
  t?: string | null;
}

enum OpCodes {
  Dispatch = 0,
  Heartbeat,
  Identify,
  PresenceUpdate,
  VoiceStateUpdate,
  Resume = 6,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

export interface ClientOptions {
  presence?: Record<string, unknown>;
  debug?: boolean;
}

export class Client extends EventEmitter {
  #socket!: Socket;
  public http: typeof HTTPRequest;
  #connected = false;
  #heartbeatInterval: number | null = null;
  #sessionID: number | null = null;
  #gatewayData!: Record<string, unknown>;
  public guilds: Set<unknown>;

  constructor(public token: string, protected opts: ClientOptions) {
    super();
    this.http = HTTPRequest.bind({ token });
    this.opts.presence = this.opts.presence ?? {};
    this.guilds = new Set();
  }

  public async connect(): Promise<void> {
    this.#gatewayData = await (await this.http('GET', '/gateway/bot')).json();
    if (this.opts.debug) Logger.debug('GET /gateway/bot', this.#gatewayData);
    this.#socket = new Socket(
      `${
        this.#gatewayData?.url ?? 'wss://gateway.discord.gg'
      }?v=8&encoding=json`
    );
    this.#socket.on('open', () => {
      if (this.opts.debug) Logger.debug('Socket Open');
    });
    this.#socket.on('message', data => {
      const message: GatewayMessage = JSON.parse(data.toString());
      if (this.opts.debug) Logger.debug('', message);
      const sendHeartbeat = async () => {
        this.#socket.send(
          JSON.stringify({
            op: OpCodes.Heartbeat,
            d: null,
          })
        );
      };
      switch (message.op) {
        case OpCodes.Hello:
          this.#heartbeatInterval = message.d?.heartbeat_interval as number;
          sendHeartbeat().then(() => {
            setInterval(sendHeartbeat, this.#heartbeatInterval ?? 0);
          });
          this.#socket.send(
            JSON.stringify({
              op: OpCodes.Identify,
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

        default:
          break;
      }
    });
  }
}
