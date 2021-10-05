import EventEmitter from 'events';
import WebSocket from 'ws';
import { Intents } from './Intents';

export interface ClientOptions {
  intents: Intents[];
}

export class Client extends EventEmitter {
  #socket!: WebSocket;

  constructor(public token: string, public opts: ClientOptions) {
    super();
  }
}
