import { EventEmitter } from 'events';
import { HTTPRequest } from './helpers/HTTPRequest';
import Socket from 'ws';
import { platform } from 'os';

export interface ClientOptions {
  presence: Record<string, unknown>;
}

export class Client extends EventEmitter {
  private socket: Socket;
  public http: typeof HTTPRequest;
  #connected = false;
  #heartbeatInterval: number | null = null;
  #sessionID: number | null = null;
  public guilds: Set<unknown>;

  constructor(private token: string, protected opts: ClientOptions) {
    super();
    this.http = HTTPRequest.bind({ token });
    this.opts.presence = opts.presence ?? {};
    this.socket = new Socket('wss://gateway.discord.gg/?v=8&encoding=json');
    this.guilds = new Set();
  }

  public connect(): void {
    this.socket.on('open', () => {
      // Do Nothing
    });
  }
}
