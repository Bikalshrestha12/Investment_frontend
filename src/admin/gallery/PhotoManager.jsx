import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
    FiArrowLeft, FiArrowRight, FiCheck, FiFolder, FiImage, FiMove, FiStar, FiTrash2, FiUploadCloud,
} from 'react-icons/fi';
import { adminApi, mediaUrl } from '../../api/content';
import MediaPicker from '../content/MediaPicker';
import { Button, ConfirmDialog, ProgressBar } from '../content/shared';
import { errorMessage } from '../content/hooks';
import { checkImages, IMAGE_ACCEPT, MAX_FILES_PER_UPLOAD } from '../content/fileRules';

const move = (list, from, to) => {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

// One photo: thumbnail, caption (saved when the field loses focus), reorder, cover, delete.
const PhotoCard = ({ image, index, count, isCover, dragging, onDragStart, onDragOver, onDrop, onMove, onCover, onDelete, onCaption }) => {
    const [caption, setCaption] = useState(image.caption || '');
    const [saved, setSaved] = useState(false);

    const save = async () => {
        if (caption.trim() === (image.caption || '')) return;
        const ok = await onCaption(image, caption.trim());
        if (ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        } else {
            setCaption(image.caption || '');
        }
    };

    const iconButton = 'flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent';

    return (
        <li
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={onDrop}
            onDragEnd={onDrop}
            className={`overflow-hidden rounded-lg border bg-white shadow-sm transition ${dragging ? 'border-blue-500 opacity-50' : 'border-slate-200'}`}
        >
            <div className="relative">
                <img src={mediaUrl(image.thumb || image.image)} alt={image.alt || image.caption || `Photo ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute left-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-md bg-slate-900/70 text-white" title="Drag to reorder">
                    <FiMove className="h-4 w-4" />
                </span>
                {isCover && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
                        <FiStar className="fill-current" /> Cover
                    </span>
                )}
            </div>
            <div className="space-y-2 p-3">
                <div className="relative">
                    <input
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onBlur={save}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                        placeholder="Add a caption"
                        aria-label={`Caption for photo ${index + 1}`}
                        maxLength={300}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 pr-8 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {saved && <FiCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600" aria-label="Caption saved" />}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex">
                        <button type="button" className={iconButton} onClick={() => onMove(index, index - 1)} disabled={index === 0} title="Move earlier" aria-label={`Move photo ${index + 1} earlier`}>
                            <FiArrowLeft />
                        </button>
                        <button type="button" className={iconButton} onClick={() => onMove(index, index + 1)} disabled={index === count - 1} title="Move later" aria-label={`Move photo ${index + 1} later`}>
                            <FiArrowRight />
                        </button>
                    </div>
                    <div className="flex">
                        <button type="button" className={`${iconButton} ${isCover ? 'text-amber-500' : ''}`} onClick={() => onCover(image)} disabled={isCover} title="Use as album cover" aria-label={`Use photo ${index + 1} as album cover`}>
                            <FiStar className={isCover ? 'fill-current' : ''} />
                        </button>
                        <button type="button" className={`${iconButton} text-red-600 hover:bg-red-50`} onClick={() => onDelete(image)} title="Delete photo" aria-label={`Delete photo ${index + 1}`}>
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

/**
 * Photos of an album: upload several at once, pick from the media library, edit captions,
 * reorder (drag and drop or the arrow buttons), choose the cover and delete.
 * Every change is saved immediately.
 */
const PhotoManager = ({ albumId, images, setImages, coverImage, onCoverChange }) => {
    const inputRef = useRef(null);
    const dragFrom = useRef(null);
    const orderBeforeDrag = useRef(null);
    const [progress, setProgress] = useState(null);
    const [problem, setProblem] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [draggingId, setDraggingId] = useState(null);
    const busy = progress !== null;

    const saveOrder = async (next, previous) => {
        try {
            await adminApi.reorderAlbumImages(albumId, next.map((img) => img._id));
        } catch (err) {
            setImages(previous);
            toast.error(errorMessage(err, 'The new order could not be saved.'));
        }
    };

    const upload = async (fileList) => {
        const files = Array.from(fileList);
        if (!files.length) return;
        const invalid = checkImages(files);
        setProblem(invalid);
        if (invalid) return;
        setProgress(0);
        try {
            const added = await adminApi.uploadAlbumImages(albumId, files, setProgress);
            setImages((prev) => [...prev, ...added]);
            toast.success(`${added.length} photo${added.length === 1 ? '' : 's'} added`);
        } catch (err) {
            setProblem(errorMessage(err, 'The photos could not be uploaded.'));
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const addFromLibrary = async (selected) => {
        setPickerOpen(false);
        try {
            const added = await adminApi.addAlbumImagesFromLibrary(albumId, selected.map((m) => m._id));
            setImages((prev) => [...prev, ...added]);
            toast.success(`${added.length} photo${added.length === 1 ? '' : 's'} added`);
        } catch (err) {
            toast.error(errorMessage(err, 'The photos could not be added.'));
        }
    };

    const onMove = (from, to) => {
        const next = move(images, from, to);
        setImages(next);
        saveOrder(next, images);
    };

    // Drag and drop: the list reorders live while dragging and is saved on drop.
    const onDragStart = (e, index) => {
        dragFrom.current = index;
        orderBeforeDrag.current = images;
        setDraggingId(images[index]._id);
        e.dataTransfer.effectAllowed = 'move';
    };
    const onDragOver = (e, index) => {
        e.preventDefault();
        const from = dragFrom.current;
        if (from === null || from === index) return;
        setImages((prev) => move(prev, from, index));
        dragFrom.current = index;
    };
    const onDrop = () => {
        if (dragFrom.current === null) return;
        dragFrom.current = null;
        setDraggingId(null);
        const before = orderBeforeDrag.current;
        if (before && before.some((img, i) => img._id !== images[i]?._id)) saveOrder(images, before);
    };

    const onCaption = async (image, caption) => {
        try {
            const updated = await adminApi.updateAlbumImage(image._id, { caption });
            setImages((prev) => prev.map((img) => (img._id === image._id ? { ...img, caption: updated.caption } : img)));
            return true;
        } catch (err) {
            toast.error(errorMessage(err, 'The caption could not be saved.'));
            return false;
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await adminApi.deleteAlbumImage(toDelete._id);
            setImages((prev) => prev.filter((img) => img._id !== toDelete._id));
            if ([toDelete.image, toDelete.thumb].includes(coverImage)) onCoverChange('', { silent: true });
            toast.success('Photo deleted');
        } catch (err) {
            toast.error(errorMessage(err, 'The photo could not be deleted.'));
        } finally {
            setDeleting(false);
            setToDelete(null);
        }
    };

    return (
        <section aria-labelledby="photos-heading" className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 id="photos-heading" className="text-lg font-semibold text-slate-900">Photos ({images.length})</h2>
                    <p className="text-sm text-slate-500">Drag photos or use the arrows to reorder. Changes are saved automatically.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept={IMAGE_ACCEPT}
                        multiple
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                        onChange={(e) => upload(e.target.files)}
                    />
                    <Button onClick={() => inputRef.current?.click()} disabled={busy}><FiUploadCloud /> Upload photos</Button>
                    <Button variant="secondary" onClick={() => setPickerOpen(true)} disabled={busy}><FiFolder /> Media library</Button>
                </div>
            </div>

            {busy && <div className="mt-4"><ProgressBar value={progress} label="Uploading photos" /></div>}
            {problem && <p className="mt-3 text-sm text-red-500" role="alert">{problem}</p>}

            {images.length === 0 ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
                    disabled={busy}
                    className="mt-6 flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600"
                >
                    <FiImage className="h-8 w-8" />
                    <span className="font-medium">No photos yet</span>
                    <span className="text-sm">Click or drop images here. Up to {MAX_FILES_PER_UPLOAD} at a time, 8 MB each.</span>
                </button>
            ) : (
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                        <PhotoCard
                            key={image._id}
                            image={image}
                            index={index}
                            count={images.length}
                            isCover={!!coverImage && [image.image, image.thumb].includes(coverImage)}
                            dragging={draggingId === image._id}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onMove={onMove}
                            onCover={(img) => onCoverChange(img.thumb || img.image)}
                            onDelete={setToDelete}
                            onCaption={onCaption}
                        />
                    ))}
                </ul>
            )}

            <MediaPicker open={pickerOpen} multiple onClose={() => setPickerOpen(false)} onSelect={addFromLibrary} />
            <ConfirmDialog
                open={!!toDelete}
                title="Delete photo?"
                message="This photo will be removed from the album. This cannot be undone."
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </section>
    );
};

export default PhotoManager;
