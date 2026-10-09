import { useCallback, useEffect, useRef, useState } from 'react';
import { apiError } from '../api/content';

/**
 * Run an async loader and track { data, loading, error }.
 * Re-runs when `deps` change; a response that arrives after a newer request
 * (or after unmount) is ignored. `enabled: false` waits, e.g. until a section scrolls into view.
 */
export const useAsync = (loader, deps = [], { enabled = true } = {}) => {
    const [state, setState] = useState({ data: null, loading: enabled, error: null });
    const [attempt, setAttempt] = useState(0);
    const loaderRef = useRef(loader);
    loaderRef.current = loader;

    useEffect(() => {
        if (!enabled) return undefined;
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        loaderRef.current()
            .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
            .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: apiError(err) }); });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt, enabled]);

    const reload = useCallback(() => setAttempt((n) => n + 1), []);
    return { ...state, reload };
};

// Value that only updates after it has stopped changing for `delay` ms (search boxes).
export const useDebounced = (value, delay = 350) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};
