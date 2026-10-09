import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle, FiArrowDown, FiArrowUp, FiLoader } from 'react-icons/fi';
import { SearchInput } from '../ui';
import { publishState } from './hooks';

// Building blocks for the News, Notices, Gallery, Media and Settings dashboard pages.
// They extend the shared pieces in ../ui.jsx with what these pages need on top:
// a confirmation dialog, sortable table headers, status badges and form fields.

// ---- Confirmation dialog -------------------------------------------------------------

export const ConfirmDialog = ({
    open, title, message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel,
}) => {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        cancelRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, busy, onCancel]);

    if (!open) return null;
    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <div className="absolute inset-0 bg-slate-900/60" onClick={busy ? undefined : onCancel} />
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <FiAlertTriangle className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2>
                        <p id="confirm-message" className="mt-1 break-words text-sm text-slate-600">{message}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className={buttonSecondary}>Cancel</button>
                    <button type="button" onClick={onConfirm} disabled={busy} className={buttonDanger}>
                        {busy && <Spinner />} {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

// ---- Buttons ---------------------------------------------------------------------------

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
const buttonPrimaryClass = `${buttonBase} bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600`;
const buttonSecondary = `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400`;
const buttonDanger = `${buttonBase} bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600`;

export const Spinner = ({ className = 'h-4 w-4' }) => <FiLoader className={`animate-spin ${className}`} aria-hidden="true" />;

export const Button = ({ variant = 'primary', busy = false, className = '', children, ...props }) => {
    const styles = { primary: buttonPrimaryClass, secondary: buttonSecondary, danger: buttonDanger };
    return (
        <button type="button" {...props} disabled={busy || props.disabled} className={`${styles[variant]} ${className}`}>
            {busy && <Spinner />}
            {children}
        </button>
    );
};

// ---- Tables ----------------------------------------------------------------------------

/**
 * Table with sortable column headers.
 *   columns: [{ label, field?, align? }]  (a column with `field` can be sorted)
 */
export const SortableTable = ({ columns, sort, onSort, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
                <tr>
                    {columns.map((col) => {
                        const active = col.field && sort?.field === col.field;
                        return (
                            <th
                                key={col.label}
                                scope="col"
                                aria-sort={active ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
                                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                            >
                                {col.field ? (
                                    <button
                                        type="button"
                                        onClick={() => onSort(col.field)}
                                        className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-slate-800 ${active ? 'text-slate-800' : ''}`}
                                    >
                                        {col.label}
                                        {active && (sort.order === 'asc' ? <FiArrowUp aria-hidden="true" /> : <FiArrowDown aria-hidden="true" />)}
                                    </button>
                                ) : col.label}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
    </div>
);

const stateStyles = {
    published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    scheduled: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    draft: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

export const StatusBadge = ({ item }) => {
    const state = publishState(item);
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${stateStyles[state]}`}>
            {state}
        </span>
    );
};

// Search box + status filter above a table.
export const ListToolbar = ({ search, onSearch, status, onStatus, placeholder, children }) => (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={onSearch} placeholder={placeholder} />
        {onStatus && (
            <select
                value={status}
                onChange={(e) => onStatus(e.target.value)}
                aria-label="Filter by status"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
            </select>
        )}
        {children}
    </div>
);

// ---- Form fields -----------------------------------------------------------------------

const inputBase = 'w-full rounded-lg border px-4 py-2 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500';
const inputClass = (invalid) => `${inputBase} ${invalid ? 'border-red-500' : 'border-gray-300'}`;

// Label, optional hint and error message around any control.
export const Field = ({ label, htmlFor, hint, error, required, className = '', children }) => (
    <div className={className}>
        <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        {children}
        {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-1 text-sm text-red-500" role="alert">{error}</p>}
    </div>
);

// Text input / textarea / select wired to a Formik instance by field name.
export const FormikField = ({ formik, name, label, hint, required, as = 'input', className, children, ...props }) => {
    const error = formik.touched[name] && formik.errors[name];
    const Control = as;
    return (
        <Field label={label} htmlFor={name} hint={hint} error={error} required={required} className={className}>
            <Control
                id={name}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={!!error}
                className={`${inputClass(error)} ${as === 'textarea' ? 'resize-y' : ''}`}
                {...props}
            >
                {children}
            </Control>
        </Field>
    );
};

export const TextInput = ({ invalid, className = '', ...props }) => (
    <input {...props} className={`${inputClass(invalid)} ${className}`} />
);

export const Toggle = ({ id, checked, onChange, label, description }) => (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex shrink-0">
            <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
            <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
        <span>
            <span className="block text-sm font-medium text-gray-700">{label}</span>
            {description && <span className="block text-xs text-slate-500">{description}</span>}
        </span>
    </label>
);

export const ProgressBar = ({ value, label = 'Uploading' }) => (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="mb-1 flex justify-between text-xs text-slate-600">
            <span>{value < 100 ? `${label}…` : 'Processing…'}</span>
            <span>{value}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-200" style={{ width: `${value}%` }} />
        </div>
    </div>
);

// Sticky footer of a form: cancel + save.
export const FormActions = ({ onCancel, saving, saveLabel, children }) => (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        {children}
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" busy={saving}>{saving ? 'Saving…' : saveLabel}</Button>
    </div>
);
