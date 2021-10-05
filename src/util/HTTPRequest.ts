import centra from 'centra';

const BASE_URL = 'https://discord.com/api/v9';

/**
 * Helper function for HTTP Requests
 *
 * @export
 * @param {centra.Request['method']} method HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {string} endpoint Request Endpoint
 * @param {Record<string, unknown>} data Request Body (json)
 * @param {string} _token
 * @returns {Promise<centra.Response>}
 */
export function HTTPRequest(
  this: { token: string },
  method: centra.Request['method'],
  endpoint: string,
  data?: Record<string, unknown>,
  query?: Record<string, unknown>
): Promise<centra.Response> {
  let req = centra(`${BASE_URL}/${endpoint}`, method)
    .timeout(10000)
    .header({
      'Content-Type': 'application/json',
      Authorization: `Bot ${this.token}`,
    });
  if (query) req = req.query(query);
  if (data) req = req.body(data, 'json');
  return req.send();
}
