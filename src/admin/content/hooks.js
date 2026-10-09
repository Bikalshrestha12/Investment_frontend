import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../../api/content';
import { useDebounced } from '../../hooks/useAsync';

// Hooks and helpers shared by the News, Notices, Gallery and Media dashboard pages.

export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
    if (!err?.response) return 'Could not reach the server. Check your connection and try again.';
    const message = err.response.data?.error || err.response.data?.message;
    return typeof message === 'string' && message ? message : fallback;
};

// "Annual General Meeting 2026!" -> "annual-general-meeting-2026" (same rules as the server)
export const slugify = (text = '') =>
    text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
        .replace(/-+$/g, '');

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MESSAGE = 'Use lowercase letters, numbers and hyphens only';

/**
 * Load one item for an edit form. `id` undefined means "create": nothing is loaded.
 * Returns { item, loading, error }.
 */
export const useEditItem = (resource, id) => {
    const [state, setState] = useState({ item: null, loading: !!id, error: null });
    useEffect(() => {
        if (!id) { setState({ item: null, loading: false, error: null }); return undefined; }
        let cancelled = false;
        setState({ item: null, loading: true, error: null });
        adminApi.get(resource, id)
            .then((item) => { if (!cancelled) setState({ item, loading: false, error: null }); })
            .catch((err) => {
                if (cancelled) return;
                const notFound = err?.response?.status === 404;
                setState({ item: null, loading: false, error: notFound ? 'This item no longer exists.' : errorMessage(err, 'Could not load this item.') });
            });
        return () => { cancelled = true; };
    }, [resource, id]);
    return state;
};

// <input type="datetime-local"> works in local time without a timezone suffix.
export const toDateTimeInput = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
export const fromDateTimeInput = (value) => (value ? new Date(value).toISOString() : null);

// draft | scheduled (published, but dated in the future) | published
export const publishState = (item) => {
    if (item.status !== 'published') return 'draft';
    return item.publishedAt && new Date(item.publishedAt) > new Date() ? 'scheduled' : 'published';
};

/**
 * Server-side list for an admin table: search, status filter, sorting, pagination,
 * delete and quick field updates (publish / feature toggles).
 */
export const usePagedList = (resource, { limit = 10, defaultSort = 'createdAt', noun = 'item' } = {}) => {
    const [state, setState] = useState({ items: [], total: 0, pages: 1, loading: true, error: null });
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState({ field: defaultSort, order: 'desc' });
    const [version, setVersion] = useState(0);
    const debouncedSearch = useDebounced(search);

    useEffect(() => { setPage(1); }, [debouncedSearch, status]);

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        adminApi.list(resource, { page, limit, search: debouncedSearch.trim(), status, sort: sort.field, order: sort.order })
            .then((res) => {
                if (cancelled) return;
                // Deleting the last row of the last page leaves that page empty: step back.
                if (res.data.length === 0 && page > 1 && res.total > 0) { setPage(res.pages); return; }
                setState({ items: res.data, total: res.total, pages: res.pages, loading: false, error: null });
            })
            .catch((err) => {
                if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: errorMessage(err, `Could not load ${noun}s.`) }));
            });
        return () => { cancelled = true; };
    }, [resource, page, limit, debouncedSearch, status, sort, version, noun]);

    const reload = useCallback(() => setVersion((n) => n + 1), []);

    const toggleSort = useCallback((field) => {
        setSort((prev) => (prev.field === field
            ? { field, order: prev.order === 'asc' ? 'desc' : 'asc' }
            : { field, order: field === 'title' ? 'asc' : 'desc' }));
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await adminApi.remove(resource, id);
            toast.success(`${noun.charAt(0).toUpperCase()}${noun.slice(1)} deleted`);
            reload();
            return true;
        } catch (err) {
            toast.error(errorMessage(err, `Could not delete the ${noun}.`));
            return false;
        }
    }, [resource, noun, reload]);

    // Change a few fields of one row (publish/unpublish, feature/unfeature) and refresh it in place.
    const patch = useCallback(async (id, changes, successMessage) => {
        try {
            const updated = await adminApi.update(resource, id, changes);
            setState((prev) => ({
                ...prev,
                items: prev.items.map((item) => (item._id === id ? { ...item, ...updated } : item)),
            }));
            if (successMessage) toast.success(successMessage);
        } catch (err) {
            toast.error(errorMessage(err, `Could not update the ${noun}.`));
        }
    }, [resource, noun]);

    return { ...state, page, setPage, search, setSearch, status, setStatus, sort, toggleSort, reload, remove, patch };
};
