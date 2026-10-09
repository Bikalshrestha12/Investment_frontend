import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonOutline, buttonPrimary } from './styles';
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiInbox, FiRefreshCw, FiSearch } from 'react-icons/fi';

// Shared pieces of the public News, Notices and Gallery pages. They reuse the look of
// the existing pages: the gradient page banner, the blue section heading and rounded buttons.

// Banner at the top of a page: title and breadcrumb.
// trail: [{ label, to }] between "Home" and the current page.
export const PageBanner = ({ title, trail = [], current }) => (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-blue-500 opacity-50" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 py-10 text-center">
            <p className="mb-4 text-4xl text-white animate-fadeInDown md:text-5xl" aria-hidden="true">{title}</p>
            <nav aria-label="Breadcrumb">
                <ol className="m-0 flex list-none flex-wrap justify-center p-0 text-white animate-fadeInDown">
                    <li><Link to="/" className="hover:text-blue-300">Home</Link></li>
                    {trail.map((item) => (
                        <li key={item.to} className="flex">
                            <span className="mx-2" aria-hidden="true">/</span>
                            <Link to={item.to} className="hover:text-blue-300">{item.label}</Link>
                        </li>
                    ))}
                    <li className="flex min-w-0">
                        <span className="mx-2" aria-hidden="true">/</span>
                        <span className="max-w-[60vw] truncate text-blue-300" aria-current="page">{current || title}</span>
                    </li>
                </ol>
            </nav>
        </div>
    </div>
);

// Kicker + heading used above every section. `as` picks the heading level (h1 on pages, h2 on the home page).
export const SectionHeading = ({ kicker, title, description, as: Heading = 'h2' }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mb-10 max-w-2xl text-center"
    >
        {kicker && <p className="text-2xl font-medium text-blue-900">{kicker}</p>}
        <Heading className="text-3xl font-bold md:text-4xl">{title}</Heading>
        {description && <p className="mt-3 text-gray-600">{description}</p>}
    </motion.div>
);

export const EmptyState = ({ title, message, icon: Icon = FiInbox, children }) => (
    <div className="mx-auto max-w-md rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Icon className="h-7 w-7" />
        </span>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
);

export const SearchEmptyState = ({ onReset }) => (
    <EmptyState icon={FiSearch} title="No Results Found" message="Nothing matches your search or filters. Try different keywords or clear the filters.">
        <button type="button" onClick={onReset} className={buttonOutline}>Clear filters</button>
    </EmptyState>
);

export const ErrorState = ({ message, onRetry }) => (
    <div role="alert" className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiAlertCircle className="h-7 w-7" />
        </span>
        <h2 className="text-xl font-semibold text-gray-900">Unable to Load This Content</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        {onRetry && (
            <button type="button" onClick={onRetry} className={`${buttonPrimary} mt-6`}>
                <FiRefreshCw /> Try again
            </button>
        )}
    </div>
);

// Shown when a slug does not match any published item.
export const NotFoundState = ({ title, message, backTo, backLabel }) => (
    <div className="py-16">
        <EmptyState icon={FiAlertCircle} title={title} message={message}>
            <Link to={backTo} className={buttonPrimary}><FiChevronLeft /> {backLabel}</Link>
            <Link to="/" className={buttonOutline}>Go to Home</Link>
        </EmptyState>
    </div>
);

// Page numbers to show: first, last and the pages around the current one.
const pageList = (page, pages) => {
    const wanted = new Set([1, pages, page - 1, page, page + 1]);
    const list = [...wanted].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
    return list.flatMap((p, i) => (i > 0 && p - list[i - 1] > 1 ? ['gap', p] : [p]));
};

export const Pagination = ({ page, pages, onChange }) => {
    if (!pages || pages <= 1) return null;
    const base = 'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-200';
    const idle = 'border border-slate-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-gray-700';
    return (
        <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button type="button" className={`${base} ${idle}`} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
                <FiChevronLeft />
            </button>
            {pageList(page, pages).map((p, i) => p === 'gap' ? (
                <span key={`gap-${i}`} className="px-1 text-gray-400" aria-hidden="true">…</span>
            ) : (
                <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    aria-current={p === page ? 'page' : undefined}
                    aria-label={`Page ${p}`}
                    className={`${base} ${p === page ? 'bg-blue-600 text-white' : idle}`}
                >
                    {p}
                </button>
            ))}
            <button type="button" className={`${base} ${idle}`} onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">
                <FiChevronRight />
            </button>
        </nav>
    );
};

const fieldClass =
    'w-full rounded-full border border-slate-300 bg-white py-2.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20';

/**
 * Search box plus optional dropdown filters, used above the News, Notices and Gallery lists.
 *   selects: [{ label, value, onChange, options: [{ value, label }] }]
 */
export const FilterBar = ({ search, onSearch, placeholder = 'Search...', selects = [] }) => (
    <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mb-10 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-md md:flex-row md:items-center"
    >
        <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="search"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={`${fieldClass} pl-11 pr-4`}
            />
        </div>
        {selects.map((select) => (
            <select
                key={select.label}
                value={select.value}
                onChange={(e) => select.onChange(e.target.value)}
                aria-label={select.label}
                className={`${fieldClass} px-4 md:w-48`}
            >
                {select.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        ))}
    </form>
);
