import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    endSession, getUser, hasValidSession, startInactivityManager, startSession,
    subscribe, updateUser as storeUser,
} from './session';

const SessionContext = createContext(null);

// Routes that need a login. When the session ends, tabs showing one of these go to /login;
// tabs on public pages stay where they are and just show the logged-out state.
const PROTECTED_PREFIXES = ['/dashboard', '/carts', '/investment_start'];
export const isProtectedPath = (pathname) =>
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const readState = () => {
    const valid = hasValidSession();
    return { isAuthenticated: valid, user: valid ? getUser() : null };
};

/**
 * Global session layer. Mounted once around the whole app (see main.jsx), so there is
 * one inactivity manager per tab no matter how often routes or pages change.
 */
export const SessionProvider = ({ children }) => {
    const [state, setState] = useState(readState);
    const navigate = useNavigate();
    const location = useLocation();

    // The manager is started once per page load. `navigate` and the path change on
    // every route change, so read them through refs instead of restarting it.
    const pathRef = useRef(location.pathname);
    pathRef.current = location.pathname;
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;

    useEffect(() => {
        const onSessionEnd = (reason) => {
            setState({ isAuthenticated: false, user: null });
            const from = pathRef.current;
            if (isProtectedPath(from)) {
                navigateRef.current('/login', { replace: true, state: { reason, from } });
            }
        };

        const stop = startInactivityManager({ onSessionEnd });
        const unsubscribe = subscribe((event) => {
            if (event.type === 'login' || event.type === 'user') setState(readState());
        });
        return () => {
            unsubscribe();
            stop();
        };
    }, []);

    const login = useCallback((token, user) => startSession(token, user), []);
    const logout = useCallback(() => endSession('logout'), []);
    const updateUser = useCallback((user) => storeUser(user), []);

    return (
        <SessionContext.Provider value={{ ...state, login, logout, updateUser }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
    return ctx;
};
