import { Client } from '../Client';

/**
 * Base Class (internal use only)
 *
 * @export
 * @class Base
 * @template T
 * @abstract
 */
export abstract class Base<T> {
  [key: string]: unknown;
  /**
   * Creates an instance of Base.
   * @param {T} data
   * @memberof Base
   */
  constructor(protected $: Client, data: T) {
    Object.assign(this, data);
  }

  abstract edit(data: Record<string, unknown>): Promise<void>;
}
