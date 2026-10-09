import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiImage, FiInbox, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AxiosWithAuth, { resolveImage } from '../contexts/AxiosWithAuth';

// Shared building blocks for the admin dashboard so every page looks the same.

export const PageHeader = ({ title, subtitle, actionLabel, actionTo, children }) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
            {children}
            {actionTo && (
                <Link
                    to={actionTo}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <FiPlus className="h-4 w-4" />
                    {actionLabel}
                </Link>
            )}
        </div>
    </div>
);

// Frame for add/edit forms: back link, title, and a white card around the form.
export const FormPage = ({ title, subtitle, backTo, backLabel, children }) => (
    <div className="mx-auto max-w-4xl">
        <Link to={backTo} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
            <FiChevronLeft /> Back to {backLabel}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div>
    </div>
);

export const Card =({ className = '', children }) => (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
);

export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
    <div className="relative w-full sm:w-72">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
    </div>
);

export const Table = ({ columns, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col}
                            scope="col"
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 last:text-right"
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
    </div>
);

export const Td = ({ className = '', children }) => (
    <td className={`px-4 py-3 align-middle text-slate-700 ${className}`}>{children}</td>
);

export const EmptyRow = ({ colSpan, message = 'Nothing here yet.' }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-14 text-center">
            <FiInbox className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">{message}</p>
        </td>
    </tr>
);

export const SkeletonRows = ({ cols, rows = 5 }) =>
    Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
            {Array.from({ length: cols }).map((__, c) => (
                <td key={c} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                </td>
            ))}
        </tr>
    ));

export const Thumb = ({ src, alt, size = 'h-11 w-11', rounded = 'rounded-lg' }) => {
    const [failed, setFailed] = useState(false);
    const url = resolveImage(src);
    if (!url || failed) {
        return (
            <div className={`${size} ${rounded} flex items-center justify-center bg-slate-100 text-slate-400`}>
                <FiImage className="h-4 w-4" />
            </div>
        );
    }
    return <img src={url} alt={alt} onError={() => setFailed(true)} className={`${size} ${rounded} object-cover ring-1 ring-slate-200`} />;
};

export const Badge = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        slate: 'bg-slate-100 text-slate-700 ring-slate-500/20',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors[color] || colors.blue}`}>
            {children}
        </span>
    );
};

const actionColors = {
    blue: 'text-blue-600 hover:bg-blue-50',
    green: 'text-emerald-600 hover:bg-emerald-50',
    red: 'text-red-600 hover:bg-red-50',
};

export const ActionButton = ({ to, onClick, title, color = 'blue', icon: Icon }) => {
    const className = `inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${actionColors[color]}`;
    if (to) {
        return (
            <Link to={to} title={title} aria-label={title} className={className}>
                <Icon className="h-4 w-4" />
            </Link>
        );
    }
    return (
        <button type="button" onClick={onClick} title={title} aria-label={title} className={className}>
            <Icon className="h-4 w-4" />
        </button>
    );
};

export const Pagination = ({ page, totalPages, total, onChange }) => {
    if (totalPages <= 1) {
        return <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">{total} total</div>;
    }
    const btn = 'inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';
    return (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <p className="text-sm text-slate-500">
                Page <span className="font-medium text-slate-700">{page}</span> of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
                <button className={btn} onClick={() => onChange(page - 1)} disabled={page === 1}>
                    <FiChevronLeft /> Prev
                </button>
                <button className={btn} onClick={() => onChange(page + 1)} disabled={page === totalPages}>
                    Next <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

// Search + paginate a list on the client (the API returns every record).
export const useListControls = (items, fields, perPage = 8) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return items;
        return items.filter((item) => fields.some((f) => String(item[f] ?? '').toLowerCase().includes(term)));
    }, [items, search, fields]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    useEffect(() => { setPage(1); }, [search]);
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

    const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
    return { search, setSearch, page, setPage, totalPages, filtered, pageItems };
};

// Load a collection from the API and delete items from it (with confirmation + toast).
export const useAdminList = (endpoint, noun = 'item') => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        AxiosWithAuth().get(endpoint)
            .then((res) => {
                if (cancelled) return;
                const d = res.data;
                setItems(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error(`Error fetching ${endpoint}:`, err);
                setError(err.response?.data?.message || err.response?.data?.error || 'Could not load data. Is the server running?');
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [endpoint]);

    const remove = async (id, label) => {
        if (!window.confirm(`Delete ${noun}${label ? ` "${label}"` : ''}? This cannot be undone.`)) return;
        try {
            await AxiosWithAuth().delete(`${endpoint}/${id}`);
            setItems((prev) => prev.filter((item) => item._id !== id));
            toast.success(`${noun.charAt(0).toUpperCase() + noun.slice(1)} deleted`);
        } catch (err) {
            console.error(`Error deleting ${noun}:`, err);
            toast.error(err.response?.data?.error || err.response?.data?.message || `Failed to delete ${noun}`);
        }
    };

    return { items, setItems, loading, error, remove };
};

export const ErrorBanner = ({ message }) =>
    message ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>
    ) : null;

export const truncate =(text = '', n = 70) => (text.length > n ? `${text.slice(0, n).trim()}…` : text);
