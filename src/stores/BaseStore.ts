import { Base } from '../classes/Base';
import { Client } from '../Client';

export abstract class BaseStore<
  T extends Base<Record<string, unknown>>
> extends Map<T['id'], T> {
  constructor(protected $: Client) {
    super();
  }

  abstract fetch(id: T['id']): Promise<T>;

  array() {
    return Array.from(this.values());
  }
}
