/**
 * Vercel typed `req.query` values as `string | string[] | undefined`.
 * These helpers safely normalize them for use in route handlers,
 * mirroring how Express's `req.query` / `req.params` values
 * (always strings) were used in the original Express routes.
 */

export type QueryValue = string | string[] | undefined

/** Returns a single string value, or `undefined` if not present.
 *  If an array is passed (e.g. `?foo=a&foo=b`), the first element is used. */
export function getQueryString(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

/** Like {@link getQueryString}, but returns a fallback when missing/empty. */
export function getQueryStringOrDefault(value: QueryValue, fallback: string): string {
  const v = getQueryString(value)
  return v === undefined || v === '' ? fallback : v
}
