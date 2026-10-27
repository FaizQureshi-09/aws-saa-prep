/**
 * Thin wrappers around localStorage that never throw, so the app keeps
 * working when storage is blocked (private browsing, disabled cookies).
 */

/**
 * Reads and JSON-parses a stored value.
 * @template T
 * @param {string} key
 * @param {T} fallback - returned when the key is missing, unreadable or invalid
 * @returns {T}
 */
export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * JSON-serializes and stores a value; returns false if storage failed.
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean}
 */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
