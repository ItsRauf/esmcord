import { Client } from '../Client';

/**
 * Base Class (internal use only)
 *
 * @export
 * @class Base
 * @template T
 * @abstract
 */
export abstract class Base<T extends Record<string, unknown>> {
  /**
   * Creates an instance of Base.
   * @param {T} data
   * @memberof Base
   */
  constructor($: Client, data: T) {
    Object.assign(this, data);
  }
}
