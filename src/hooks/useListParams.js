import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounced } from './useAsync';

/**
 * Search, filters and page number of a list page, kept in the URL
 * (?search=agm&category=meetings&page=2) so results can be bookmarked, shared
 * and survive the back button.
 *
 *   const { values, searchInput, setSearchInput, set, setPage, reset, hasFilters } =
 *       useListParams(['category', 'sort']);
 */
export const useListParams = (filterKeys = []) => {
    const [params, setParams] = useSearchParams();
    const urlSearch = params.get('search') || '';
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebounced(searchInput);

    const update = useCallback((changes, { keepPage = false } = {}) => {
        setParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(changes).forEach(([key, value]) => {
                if (value) next.set(key, value);
                else next.delete(key);
            });
            // Any new search or filter starts again from the first page.
            if (!keepPage) next.delete('page');
            return next;
        }, { replace: true });
    }, [setParams]);

    // Typing updates the URL (and therefore the request) once the user pauses.
    useEffect(() => {
        if (debouncedSearch.trim() !== urlSearch) update({ search: debouncedSearch.trim() });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    // Back/forward navigation changes the URL; keep the input in step with it.
    useEffect(() => {
        setSearchInput((current) => (current.trim() === urlSearch ? current : urlSearch));
    }, [urlSearch]);

    const values = { search: urlSearch, page: Math.max(1, parseInt(params.get('page'), 10) || 1) };
    filterKeys.forEach((key) => { values[key] = params.get(key) || ''; });

    const set = useCallback((key, value) => update({ [key]: value }), [update]);
    const setPage = useCallback((page) => {
        update({ page: page > 1 ? String(page) : '' }, { keepPage: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [update]);
    const reset = useCallback(() => {
        setSearchInput('');
        setParams({}, { replace: true });
    }, [setParams]);

    const hasFilters = !!values.search || filterKeys.some((key) => values[key]);
    return { values, searchInput, setSearchInput, set, setPage, reset, hasFilters };
};
