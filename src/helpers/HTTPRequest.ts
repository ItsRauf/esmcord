import centra from 'centra';

const BASE_URL = 'https://discord.com/api/v8';

/**
 * Helper function for HTTP Requests
 *
 * @export
 * @param {centra.Request['method']} method HTTP method (get, post, put, patch, delete)
 * @param {string} endpoint Request Endpoint
 * @param {Record<string, unknown>} data Request Body (json)
 * @param {string} _token
 * @returns {Promise<centra.Response>}
 */
export function HTTPRequest(
  this: { token: string },
  method: centra.Request['method'],
  endpoint: string,
  data: Record<string, unknown>
): Promise<centra.Response> {
  return centra(`${BASE_URL}/${endpoint}`, method)
    .timeout(10000)
    .body(data, 'json')
    .header({
      'Content-Type': 'application/json',
      Authorization: `Bot ${this.token}`,
    })
    .send();
}
