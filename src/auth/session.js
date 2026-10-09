// Single source of truth for the login session and the 15-minute inactivity logout.
//
// State lives in localStorage so every tab of the app shares it and it survives refreshes:
//   token         JWT from the API (its own `exp` is enforced too)
//   user          cached user object
//   lastActivity  epoch ms of the last user interaction in ANY tab
//
// Cross-tab sync: writes to localStorage fire a `storage` event in the other tabs, and a
// BroadcastChannel carries the logout reason. Each tab only re-checks the shared
// timestamp, so a tab where nobody is typing never logs out a session another tab is using.

const DEFAULT_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

// Development only: set localStorage `debug:idleTimeoutMs` (e.g. "20000") and reload to
// test the logout without waiting 15 minutes. Production builds always use 15 minutes.
const devTimeoutOverride = () => {
    if (!import.meta.env.DEV) return 0;
    try {
        return Number(window.localStorage.getItem('debug:idleTimeoutMs')) || 0;
    } catch {
        return 0;
    }
};

export const IDLE_TIMEOUT_MS = devTimeoutOverride() > 0 ? devTimeoutOverride() : DEFAULT_IDLE_TIMEOUT_MS;

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ACTIVITY_KEY = 'lastActivity';
const CHANNEL_NAME = 'nexas-auth';

// Limits localStorage writes from high-frequency events such as mousemove.
const ACTIVITY_WRITE_THROTTLE_MS = 5000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'wheel', 'scroll', 'touchstart', 'pointerdown'];

const storage = () => window.localStorage;
const now = () => Date.now();

const read = (key) => {
    try {
        return storage().getItem(key);
    } catch {
        return null;
    }
};

// ---- Token helpers ---------------------------------------------------------------

// Returns the JWT expiry in epoch ms, or null if the token has no readable `exp`.
export const getTokenExpiry = (token) => {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const { exp } = JSON.parse(atob(payload));
        return typeof exp === 'number' ? exp * 1000 : null;
    } catch {
        return null;
    }
};

export const getToken = () => read(TOKEN_KEY);

export const getUser = () => {
    try {
        return JSON.parse(read(USER_KEY)) || null;
    } catch {
        return null;
    }
};

export const getLastActivity = () => {
    const value = Number(read(ACTIVITY_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
};

// Why the stored session is unusable, or null if it is valid right now.
export const sessionProblem = (timeoutMs = IDLE_TIMEOUT_MS) => {
    const token = getToken();
    if (!token) return 'none';
    const expiry = getTokenExpiry(token);
    if (expiry && expiry <= now()) return 'expired';
    const last = getLastActivity();
    // A missing timestamp means we cannot prove recent activity, so treat it as idle.
    if (!last || now() - last >= timeoutMs) return 'idle';
    return null;
};

export const hasValidSession = (timeoutMs = IDLE_TIMEOUT_MS) => sessionProblem(timeoutMs) === null;

// ---- Mutations -------------------------------------------------------------------

let channel = null;
const getChannel = () => {
    if (!channel && typeof BroadcastChannel !== 'undefined') channel = new BroadcastChannel(CHANNEL_NAME);
    return channel;
};

const listeners = new Set();
const notify = (event) => listeners.forEach((fn) => fn(event));

// Subscribe to session changes in this tab (login, logout, user update, from any tab).
export const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};

export const startSession = (token, user) => {
    storage().setItem(TOKEN_KEY, token);
    if (user) storage().setItem(USER_KEY, JSON.stringify(user));
    storage().setItem(ACTIVITY_KEY, String(now()));
    lastWrite = now();
    notify({ type: 'login' });
    getChannel()?.postMessage({ type: 'login' });
};

export const updateUser = (user) => {
    storage().setItem(USER_KEY, JSON.stringify(user));
    notify({ type: 'user' });
};

// Replace the token without touching the inactivity clock (e.g. after a password change).
export const replaceToken = (token) => {
    storage().setItem(TOKEN_KEY, token);
};

/**
 * Clear the session in every tab. Idempotent: only the call that actually removes the
 * token broadcasts; later calls (other timers, other tabs, repeated 401s) are no-ops.
 * Returns true if this call ended the session.
 */
export const endSession = (reason = 'logout') => {
    if (!getToken()) {
        return false;
    }
    storage().removeItem(TOKEN_KEY);
    storage().removeItem(USER_KEY);
    storage().removeItem(ACTIVITY_KEY);
    notify({ type: 'logout', reason });
    getChannel()?.postMessage({ type: 'logout', reason });
    return true;
};

let lastWrite = 0;

// Record user activity for the shared session. Never revives a session that has
// already expired: a stale timestamp is checked before it is refreshed.
export const recordActivity = (timeoutMs = IDLE_TIMEOUT_MS) => {
    if (!getToken()) return;
    const problem = sessionProblem(timeoutMs);
    if (problem) {
        endSession(problem);
        return;
    }
    if (now() - lastWrite < ACTIVITY_WRITE_THROTTLE_MS) return;
    lastWrite = now();
    storage().setItem(ACTIVITY_KEY, String(lastWrite));
};

// ---- Inactivity manager ------------------------------------------------------------

/**
 * Start the inactivity watcher for this tab. Call once per page load; returns a stop()
 * function. There is exactly one timer per tab, and it never decides on its own: when it
 * fires it re-reads the shared `lastActivity`, so activity in any tab keeps every tab alive.
 */
export const startInactivityManager = ({ timeoutMs = IDLE_TIMEOUT_MS, onSessionEnd } = {}) => {
    let timer = null;
    // Whether this tab currently holds a live session; makes onSessionEnd fire once
    // even though a remote logout arrives both by BroadcastChannel and storage event.
    let active = !!getToken();

    const fireEnd = (reason) => {
        clear();
        if (!active) return;
        active = false;
        onSessionEnd?.(reason);
    };

    const markActive = () => {
        active = !!getToken();
        schedule();
    };

    const clear = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };

    // Schedule a check for the moment the session could next expire.
    const schedule = () => {
        clear();
        const token = getToken();
        if (!token) return;
        const deadlines = [(getLastActivity() || now()) + timeoutMs];
        const expiry = getTokenExpiry(token);
        if (expiry) deadlines.push(expiry);
        // setTimeout overflows above ~24.8 days; checking again later is harmless.
        const delay = Math.min(Math.max(Math.min(...deadlines) - now(), 0) + 250, 2 ** 31 - 1);
        timer = setTimeout(check, delay);
    };

    const check = () => {
        timer = null;
        if (!getToken()) return;
        const problem = sessionProblem(timeoutMs);
        if (problem) {
            endSession(problem);
            return;
        }
        schedule(); // another tab was active; wait for the new deadline
    };

    const onActivity = () => recordActivity(timeoutMs);

    // Returning to a tab (or waking the computer) must re-check straight away,
    // because browsers slow down timers in background tabs.
    const onVisible = () => {
        if (document.visibilityState === 'visible') check();
    };

    // Another tab changed the session through localStorage.
    const onStorage = (e) => {
        if (e.storageArea !== storage()) return;
        if (e.key === TOKEN_KEY || e.key === null) {
            if (!e.newValue) {
                fireEnd('remote');
            } else {
                notify({ type: 'login' });
                markActive();
            }
        } else if (e.key === USER_KEY) {
            notify({ type: 'user' });
        }
    };

    // BroadcastChannel carries the reason; storage events are the fallback.
    const onMessage = ({ data }) => {
        if (data?.type === 'logout') {
            fireEnd(data.reason || 'remote');
        } else if (data?.type === 'login') {
            notify({ type: 'login' });
            markActive();
        }
    };

    const unsubscribe = subscribe((event) => {
        if (event.type === 'login') markActive();
        if (event.type === 'logout') fireEnd(event.reason);
    });

    const opts = { passive: true, capture: true };
    ACTIVITY_EVENTS.forEach((type) => window.addEventListener(type, onActivity, opts));
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    window.addEventListener('storage', onStorage);
    getChannel()?.addEventListener('message', onMessage);

    // Covers refreshes and reopened tabs: an idle or expired stored session ends now.
    check();

    return () => {
        clear();
        unsubscribe();
        ACTIVITY_EVENTS.forEach((type) => window.removeEventListener(type, onActivity, opts));
        document.removeEventListener('visibilitychange', onVisible);
        window.removeEventListener('focus', onVisible);
        window.removeEventListener('storage', onStorage);
        getChannel()?.removeEventListener('message', onMessage);
    };
};
