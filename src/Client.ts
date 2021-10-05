import EventEmitter from 'events';
import WebSocket from 'ws';
import { Intents } from './Intents';
import { HTTPRequest } from './util/HTTPRequest';

export interface ClientOptions {
  intents: Intents[];
}

export class Client extends EventEmitter {
  #socket!: WebSocket;
  #http: typeof HTTPRequest;

  constructor(public token: string, public opts: ClientOptions) {
    super();
    this.#http = HTTPRequest.bind({ token });
  }
}
