import { DMChannel } from '../classes/DMChannel';
import { Client } from '../Client';

export class DirectMessageStore extends Map<DMChannel['id'], DMChannel> {
  constructor(private $: Client) {
    super();
  }
}
