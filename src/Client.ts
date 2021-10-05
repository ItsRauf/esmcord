import {
  GatewayDispatchEvents,
  GatewayOpcodes,
  GatewayPresenceUpdateData,
  GatewayReceivePayload,
  RESTGetAPIGatewayBotResult,
} from 'discord-api-types';
import EventEmitter from 'events';
import { platform } from 'os';
import WebSocket from 'ws';
import { Intents } from './Intents';
import { HTTPRequest } from './util/HTTPRequest';

export interface ClientOptions {
  intents: Intents[];
  presence?: GatewayPresenceUpdateData;
}

export class Client extends EventEmitter {
  #socket!: WebSocket;
  #http: typeof HTTPRequest;
  #intents: number | bigint;
  #gatewayData!: RESTGetAPIGatewayBotResult;
  #heartbeatInterval: number | null = null;
  #presence: GatewayPresenceUpdateData;
  #connected = false;

  constructor(public token: string, public readonly opts: ClientOptions) {
    super();
    this.#http = HTTPRequest.bind({ token });
    this.#intents = this.opts.intents.reduce((prev, curr) => prev | curr, 0);
    this.#presence = this.opts.presence ?? ({} as GatewayPresenceUpdateData);
  }

  public async connect(): Promise<void> {
    this.#gatewayData = await (await this.#http('GET', '/gateway/bot')).json();
    this.#socket = new WebSocket(
      `${this.#gatewayData.url ?? 'wss://gateway.discord.gg'}?v=9&encoding=json`
    );
    this.#socket.on('message', async data => {
      const message: GatewayReceivePayload = JSON.parse(data.toString());
      this.emit('RawGatewayMessage', message);
      const sendHeartbeat = async () => {
        this.#socket.send(
          JSON.stringify({
            op: GatewayOpcodes.Heartbeat,
            d: null,
          })
        );
      };
      switch (message.op) {
        case GatewayOpcodes.Hello:
          this.#heartbeatInterval = message.d.heartbeat_interval;
          sendHeartbeat().then(() => {
            setInterval(sendHeartbeat, this.#heartbeatInterval ?? 0);
          });
          this.#socket.send(
            JSON.stringify({
              op: GatewayOpcodes.Identify,
              d: {
                token: this.token,
                properties: {
                  $os: platform(),
                  $browser: 'ESMCord',
                  $device: 'ESMCord',
                },
                intents: this.#intents,
                presence: this.#presence,
              },
            }),
            err => {
              if (err) throw err;
              this.#connected = true;
            }
          );
          break;

        case GatewayOpcodes.Heartbeat:
          sendHeartbeat();
          break;

        case GatewayOpcodes.Dispatch:
          switch (message.t) {
            case GatewayDispatchEvents.Ready:
              // (await import(`./events/${message.t}`)).default(this, message);
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
