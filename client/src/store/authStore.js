/**
 * Auth Store — access token lives ONLY in memory (never localStorage/sessionStorage).
 * Refresh token is stored in an httpOnly cookie by the backend.
 * We keep a Set of subscribers so any component can react to token changes.
 */

let _accessToken = null;
const _subscribers = new Set();

const authStore = {
  getToken() {
    return _accessToken;
  },

  setToken(token) {
    _accessToken = token;
    _subscribers.forEach((cb) => cb(token));
  },

  clearToken() {
    _accessToken = null;
    _subscribers.forEach((cb) => cb(null));
  },

  subscribe(cb) {
    _subscribers.add(cb);
    return () => _subscribers.delete(cb);
  },

  isAuthenticated() {
    return !!_accessToken;
  },
};

export default authStore;