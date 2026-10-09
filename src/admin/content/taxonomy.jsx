import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { adminApi } from '../../api/content';
import { Button, ConfirmDialog, TextInput } from './shared';
import { errorMessage } from './hooks';

/**
 * Category dropdown with "add new" and "delete" built in.
 *   resource  'news-categories' | 'notice-categories'
 *   value     selected category id ('' for none)
 */
export const CategorySelect = ({ id, resource, value, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        let cancelled = false;
        adminApi.list(resource)
            .then((res) => { if (!cancelled) setCategories(res.data); })
            .catch((err) => toast.error(errorMessage(err, 'Could not load categories.')))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [resource]);

    const selected = categories.find((c) => c._id === value);

    const add = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            const created = await adminApi.create(resource, { name: name.trim() });
            setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
            onChange(created._id);
            setName('');
            setAdding(false);
            toast.success(`Category "${created.name}" added`);
        } catch (err) {
            toast.error(errorMessage(err, 'Could not add the category.'));
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        setSaving(true);
        try {
            await adminApi.remove(resource, selected._id);
            setCategories((prev) => prev.filter((c) => c._id !== selected._id));
            onChange('');
            toast.success('Category deleted');
        } catch (err) {
            toast.error(errorMessage(err, 'Could not delete the category.'));
        } finally {
            setSaving(false);
            setConfirm(false);
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{loading ? 'Loading…' : 'No category'}</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {selected && (
                    <button
                        type="button"
                        onClick={() => setConfirm(true)}
                        title={`Delete category "${selected.name}"`}
                        aria-label={`Delete category ${selected.name}`}
                        className="rounded-lg border border-slate-300 px-3 text-red-600 hover:bg-red-50"
                    >
                        <FiTrash2 />
                    </button>
                )}
            </div>

            {adding ? (
                <div className="mt-2 flex gap-2">
                    <TextInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                        placeholder="New category name"
                        aria-label="New category name"
                        maxLength={60}
                        autoFocus
                    />
                    <Button onClick={add} busy={saving} disabled={!name.trim()}>Add</Button>
                    <Button variant="secondary" onClick={() => { setAdding(false); setName(''); }} aria-label="Cancel"><FiX /></Button>
                </div>
            ) : (
                <button type="button" onClick={() => setAdding(true)} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <FiPlus /> Add category
                </button>
            )}

            <ConfirmDialog
                open={confirm}
                title="Delete category?"
                message={`"${selected?.name}" will be removed. Items in this category are kept and become uncategorised.`}
                busy={saving}
                onConfirm={remove}
                onCancel={() => setConfirm(false)}
            />
        </div>
    );
};

const MAX_TAGS = 10;

// Tags as removable chips. Enter or comma adds the typed tag.
export const TagInput = ({ id, value, onChange }) => {
    const [draft, setDraft] = useState('');

    const add = () => {
        const tag = draft.trim().replace(/,+$/, '').slice(0, 40);
        setDraft('');
        if (!tag || value.length >= MAX_TAGS) return;
        if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
        onChange([...value, tag]);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                {value.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {tag}
                        <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove tag ${tag}`} className="hover:text-blue-900">
                            <FiX />
                        </button>
                    </span>
                ))}
                <input
                    id={id}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
                        else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
                    }}
                    onBlur={add}
                    disabled={value.length >= MAX_TAGS}
                    placeholder={value.length >= MAX_TAGS ? 'Tag limit reached' : 'Type a tag and press Enter'}
                    className="min-w-32 flex-1 bg-transparent py-0.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
            </div>
            <p className="mt-1 text-xs text-slate-500">Up to {MAX_TAGS} tags.</p>
        </div>
    );
};
