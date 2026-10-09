import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiCheck, FiCopy, FiDownload, FiEdit2, FiFileText, FiFolder, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import { adminApi, formatDate, formatFileSize, mediaUrl } from '../../api/content';
import { useDebounced } from '../../hooks/useAsync';
import { Card, ErrorBanner, PageHeader, Pagination, SearchInput } from '../ui';
import { Button, ConfirmDialog, ProgressBar, TextInput } from '../content/shared';
import { errorMessage } from '../content/hooks';
import { checkMedia, MEDIA_ACCEPT } from '../content/fileRules';

const PER_PAGE = 18;
const tabs = [
    { value: '', label: 'All files' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
];

const usageText = (usage) =>
    [
        usage.news && `${usage.news} news article(s)`,
        usage.notices && `${usage.notices} notice(s)`,
        usage.albums && `${usage.albums} album cover(s)`,
        usage.galleryImages && `${usage.galleryImages} gallery photo(s)`,
    ].filter(Boolean).join(', ');

const MediaCard = ({ media, onDelete, onAltSaved }) => {
    const [editing, setEditing] = useState(false);
    const [alt, setAlt] = useState(media.alt || '');
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const isImage = media.type === 'image';

    const saveAlt = async () => {
        setSaving(true);
        try {
            const updated = await adminApi.update('media', media._id, { alt: alt.trim() });
            onAltSaved(updated);
            setEditing(false);
            toast.success('Alt text saved');
        } catch (err) {
            toast.error(errorMessage(err, 'The alt text could not be saved.'));
        } finally {
            setSaving(false);
        }
    };

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(mediaUrl(media.url));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy the link.');
        }
    };

    const download = () =>
        adminApi.downloadMedia(media).catch((err) => toast.error(errorMessage(err, 'The file could not be downloaded.')));

    const iconButton = 'flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100';

    return (
        <li className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {isImage ? (
                <img src={mediaUrl(media.thumbUrl || media.url)} alt={media.alt || media.originalName} loading="lazy" className="aspect-[4/3] w-full bg-slate-100 object-cover" />
            ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-red-50 text-red-600">
                    <FiFileText className="h-10 w-10" />
                    <span className="text-xs font-semibold">PDF</span>
                </div>
            )}
            <div className="flex flex-1 flex-col p-3">
                <p className="truncate text-sm font-medium text-slate-800" title={media.originalName}>{media.originalName}</p>
                <p className="text-xs text-slate-500">
                    {formatFileSize(media.size)}
                    {media.width ? ` · ${media.width}×${media.height}` : ''} · {formatDate(media.createdAt)}
                </p>

                {isImage && (editing ? (
                    <div className="mt-2 flex gap-1">
                        <TextInput
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveAlt(); } }}
                            placeholder="Describe the image"
                            aria-label="Alt text"
                            maxLength={300}
                            autoFocus
                            className="!px-2 !py-1"
                        />
                        <button type="button" onClick={saveAlt} disabled={saving} className={`${iconButton} text-emerald-600`} aria-label="Save alt text"><FiCheck /></button>
                        <button type="button" onClick={() => { setEditing(false); setAlt(media.alt || ''); }} className={iconButton} aria-label="Cancel"><FiX /></button>
                    </div>
                ) : (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                        <span className="font-medium">Alt:</span> {media.alt || <span className="italic text-slate-400">not set</span>}
                    </p>
                ))}

                <div className="mt-auto flex items-center justify-end gap-0.5 pt-2">
                    {isImage ? (
                        <>
                            <button type="button" onClick={copyUrl} className={iconButton} title="Copy image link" aria-label={`Copy link of ${media.originalName}`}>
                                {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                            </button>
                            <button type="button" onClick={() => setEditing(true)} className={iconButton} title="Edit alt text" aria-label={`Edit alt text of ${media.originalName}`}>
                                <FiEdit2 />
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={download} className={iconButton} title="Download" aria-label={`Download ${media.originalName}`}>
                            <FiDownload />
                        </button>
                    )}
                    <button type="button" onClick={() => onDelete(media)} className={`${iconButton} text-red-600 hover:bg-red-50`} title="Delete" aria-label={`Delete ${media.originalName}`}>
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </li>
    );
};

// All uploaded images and PDFs in one place.
const MediaLibrary = () => {
    const inputRef = useRef(null);
    const [state, setState] = useState({ items: [], total: 0, pages: 1, loading: true, error: null });
    const [type, setType] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [version, setVersion] = useState(0);
    const [progress, setProgress] = useState(null);
    const [problem, setProblem] = useState(null);
    // { media, usage } - `usage` is set when the server says the file is still in use.
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const debouncedSearch = useDebounced(search);
    const busy = progress !== null;

    useEffect(() => { setPage(1); }, [debouncedSearch, type]);

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        adminApi.list('media', { type, page, limit: PER_PAGE, search: debouncedSearch.trim() })
            .then((res) => {
                if (cancelled) return;
                if (res.data.length === 0 && page > 1 && res.total > 0) { setPage(res.pages); return; }
                setState({ items: res.data, total: res.total, pages: res.pages, loading: false, error: null });
            })
            .catch((err) => {
                if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: errorMessage(err, 'Could not load the media library.') }));
            });
        return () => { cancelled = true; };
    }, [type, page, debouncedSearch, version]);

    const reload = useCallback(() => setVersion((n) => n + 1), []);

    const upload = async (fileList) => {
        const files = Array.from(fileList);
        if (!files.length) return;
        const invalid = checkMedia(files);
        setProblem(invalid);
        if (invalid) return;
        setProgress(0);
        try {
            const added = await adminApi.uploadMedia(files, setProgress);
            toast.success(`${added.length} file${added.length === 1 ? '' : 's'} uploaded`);
            setPage(1);
            reload();
        } catch (err) {
            setProblem(errorMessage(err, 'The upload failed.'));
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await adminApi.remove('media', toDelete.media._id, toDelete.usage ? { force: true } : undefined);
            toast.success('File deleted');
            setToDelete(null);
            reload();
        } catch (err) {
            // First attempt on a file that is in use: ask again, naming where it is used.
            if (err?.response?.status === 409 && err.response.data?.usage) {
                setToDelete({ media: toDelete.media, usage: err.response.data.usage });
            } else {
                toast.error(errorMessage(err, 'The file could not be deleted.'));
                setToDelete(null);
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Media Library" subtitle="Images and PDF documents used across the site.">
                <input
                    ref={inputRef}
                    type="file"
                    accept={MEDIA_ACCEPT}
                    multiple
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(e) => upload(e.target.files)}
                />
                <Button onClick={() => inputRef.current?.click()} disabled={busy}><FiUploadCloud /> Upload files</Button>
            </PageHeader>
            <ErrorBanner message={state.error} />

            {(busy || problem) && (
                <Card className="mb-4 p-4">
                    {busy && <ProgressBar value={progress} />}
                    {problem && <p className="text-sm text-red-600" role="alert">{problem}</p>}
                </Card>
            )}

            <Card>
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 rounded-lg bg-slate-100 p-1" role="tablist" aria-label="File type">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                role="tab"
                                aria-selected={type === tab.value}
                                onClick={() => setType(tab.value)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${type === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by file name or alt text..." />
                </div>

                <div
                    className="p-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); if (!busy) upload(e.dataTransfer.files); }}
                >
                    {state.loading ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" role="status" aria-label="Loading files">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-lg border border-slate-200">
                                    <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                                    <div className="space-y-2 p-3">
                                        <div className="h-3 animate-pulse rounded bg-slate-200" />
                                        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : state.items.length === 0 ? (
                        <div className="py-14 text-center">
                            <FiFolder className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                            <p className="text-sm text-slate-500">
                                {debouncedSearch || type ? 'No files match your search.' : 'No files yet. Upload images or PDFs, or drop them here.'}
                            </p>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {state.items.map((media) => (
                                <MediaCard
                                    key={media._id}
                                    media={media}
                                    onDelete={(item) => setToDelete({ media: item })}
                                    onAltSaved={(updated) => setState((prev) => ({
                                        ...prev,
                                        items: prev.items.map((m) => (m._id === updated._id ? updated : m)),
                                    }))}
                                />
                            ))}
                        </ul>
                    )}
                </div>
                {!state.loading && <Pagination page={page} totalPages={state.pages} total={state.total} onChange={setPage} />}
            </Card>

            <ConfirmDialog
                open={!!toDelete}
                title={toDelete?.usage ? 'This file is in use' : 'Delete file?'}
                message={toDelete?.usage
                    ? `"${toDelete.media.originalName}" is used by ${usageText(toDelete.usage)}. Deleting it will leave a missing image or attachment there.`
                    : `"${toDelete?.media.originalName}" will be permanently deleted. This cannot be undone.`}
                confirmLabel={toDelete?.usage ? 'Delete anyway' : 'Delete'}
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
};

export default MediaLibrary;
