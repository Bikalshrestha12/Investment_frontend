import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiImage, FiX } from 'react-icons/fi';
import { adminApi, mediaUrl } from '../../api/content';
import { useDebounced } from '../../hooks/useAsync';
import { Pagination, SearchInput } from '../ui';
import { Button } from './shared';
import { errorMessage } from './hooks';

const PER_PAGE = 18;

/**
 * Modal for choosing images that are already in the media library.
 *   multiple   allow several images (gallery); otherwise one click selects
 *   onSelect   receives an array of media items
 */
const MediaPicker = ({ open, multiple = false, onSelect, onClose }) => {
    const [items, setItems] = useState([]);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const debouncedSearch = useDebounced(search);

    useEffect(() => { setPage(1); }, [debouncedSearch]);
    useEffect(() => { if (open) { setSelected([]); setSearch(''); } }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        let cancelled = false;
        setLoading(true);
        adminApi.list('media', { type: 'image', page, limit: PER_PAGE, search: debouncedSearch.trim() })
            .then((res) => {
                if (cancelled) return;
                setItems(res.data);
                setPages(res.pages);
                setTotal(res.total);
                setError(null);
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load the media library.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [open, page, debouncedSearch]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const isSelected = (media) => selected.some((s) => s._id === media._id);
    const pick = (media) => {
        if (!multiple) { onSelect([media]); return; }
        setSelected((prev) => (isSelected(media) ? prev.filter((s) => s._id !== media._id) : [...prev, media]));
    };

    return createPortal(
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="media-picker-title">
            <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
            <div className="relative flex max-h-full w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <h2 id="media-picker-title" className="text-lg font-semibold text-slate-900">
                        {multiple ? 'Choose images' : 'Choose an image'}
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by file name or alt text..." />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    {error ? (
                        <p className="py-10 text-center text-sm text-red-600" role="alert">{error}</p>
                    ) : loading ? (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6" role="status" aria-label="Loading images">
                            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-slate-200" />)}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-12 text-center">
                            <FiImage className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                            <p className="text-sm text-slate-500">
                                {debouncedSearch ? 'No images match your search.' : 'The media library has no images yet. Upload one first.'}
                            </p>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                            {items.map((media) => (
                                <li key={media._id}>
                                    <button
                                        type="button"
                                        onClick={() => pick(media)}
                                        aria-pressed={multiple ? isSelected(media) : undefined}
                                        title={media.originalName}
                                        className={`relative block w-full overflow-hidden rounded-lg ring-2 ring-offset-2 transition focus:outline-none focus-visible:ring-blue-600 ${isSelected(media) ? 'ring-blue-600' : 'ring-transparent hover:ring-slate-300'}`}
                                    >
                                        <img src={mediaUrl(media.thumbUrl || media.url)} alt={media.alt || media.originalName} loading="lazy" className="aspect-square w-full object-cover" />
                                        {isSelected(media) && (
                                            <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                                <FiCheck className="h-4 w-4" />
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!loading && !error && <Pagination page={page} totalPages={pages} total={total} onChange={setPage} />}

                {multiple && (
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                        <p className="text-sm text-slate-600">{selected.length} selected</p>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button onClick={() => onSelect(selected)} disabled={selected.length === 0}>
                                Add {selected.length || ''} {selected.length === 1 ? 'image' : 'images'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};

export default MediaPicker;
