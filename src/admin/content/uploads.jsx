import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiDownload, FiFileText, FiFolder, FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { adminApi, formatFileSize, mediaUrl } from '../../api/content';
import MediaPicker from './MediaPicker';
import { Button, ProgressBar } from './shared';
import { errorMessage } from './hooks';
import { checkImages, checkPdf, IMAGE_ACCEPT } from './fileRules';

// Upload controls used by the News, Notice, Album and Settings forms.

/**
 * Single image: preview, upload with progress, choose from the library, remove.
 *   value     stored image path ('' when empty)
 *   onChange  (path, media) => void
 *   useThumb  store the 640px version (album covers) instead of the full image
 */
export const ImageField = ({ value, onChange, useThumb = false, aspect = 'aspect-[16/9]', error }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [problem, setProblem] = useState(null);
    const busy = progress !== null;

    const choose = (media) => onChange(useThumb ? media.thumbUrl || media.url : media.url, media);

    const upload = async (file) => {
        const invalid = checkImages([file]);
        setProblem(invalid);
        if (invalid) return;
        setProgress(0);
        try {
            const [media] = await adminApi.uploadMedia([file], setProgress);
            choose(media);
            toast.success('Image uploaded');
        } catch (err) {
            setProblem(errorMessage(err, 'The image could not be uploaded.'));
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className={`relative overflow-hidden rounded-lg border bg-slate-50 ${aspect} ${error || problem ? 'border-red-400' : 'border-slate-300'}`}>
                {value ? (
                    <img src={mediaUrl(value)} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-400">
                        <FiImage className="h-8 w-8" />
                        <span className="text-sm">No image selected</span>
                    </div>
                )}
            </div>

            {busy && <div className="mt-3"><ProgressBar value={progress} /></div>}

            <div className="mt-3 flex flex-wrap gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(e) => e.target.files[0] && upload(e.target.files[0])}
                />
                <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
                    <FiUploadCloud /> {value ? 'Replace' : 'Upload image'}
                </Button>
                <Button variant="secondary" onClick={() => setPickerOpen(true)} disabled={busy}>
                    <FiFolder /> Media library
                </Button>
                {value && (
                    <Button variant="secondary" onClick={() => onChange('', null)} disabled={busy} className="text-red-600 hover:bg-red-50">
                        <FiTrash2 /> Remove
                    </Button>
                )}
            </div>
            <p className="mt-2 text-xs text-slate-500">JPG, PNG, WEBP or GIF, up to 8 MB. Images are optimised automatically.</p>
            {(problem || error) && <p className="mt-1 text-sm text-red-500" role="alert">{problem || error}</p>}

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={([media]) => { choose(media); setPickerOpen(false); setProblem(null); }}
            />
        </div>
    );
};

/**
 * PDF attachment of a notice: shows the file name, lets the admin upload, replace,
 * download or remove it.
 *   value     media item ({ _id, originalName, size }) or null
 *   onChange  (media | null) => void
 */
export const PdfField = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(null);
    const [problem, setProblem] = useState(null);
    const busy = progress !== null;

    const upload = async (file) => {
        const invalid = checkPdf(file);
        setProblem(invalid);
        if (invalid) return;
        setProgress(0);
        try {
            const [media] = await adminApi.uploadMedia([file], setProgress);
            onChange(media);
            toast.success('PDF uploaded');
        } catch (err) {
            setProblem(errorMessage(err, 'The PDF could not be uploaded.'));
        } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const download = () =>
        adminApi.downloadMedia(value).catch((err) => toast.error(errorMessage(err, 'The file could not be downloaded.')));

    return (
        <div>
            <div className={`rounded-lg border p-4 ${problem ? 'border-red-400' : 'border-slate-300'} ${value ? 'bg-white' : 'border-dashed bg-slate-50'}`}>
                {value ? (
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <FiFileText className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800" title={value.originalName}>{value.originalName}</p>
                            <p className="text-xs text-slate-500">PDF{value.size ? ` · ${formatFileSize(value.size)}` : ''}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-sm text-slate-500">No PDF attached</p>
                )}
            </div>

            {busy && <div className="mt-3"><ProgressBar value={progress} /></div>}

            <div className="mt-3 flex flex-wrap gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(e) => e.target.files[0] && upload(e.target.files[0])}
                />
                <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
                    <FiUploadCloud /> {value ? 'Replace PDF' : 'Upload PDF'}
                </Button>
                {value && (
                    <>
                        <Button variant="secondary" onClick={download} disabled={busy}><FiDownload /> Download</Button>
                        <Button variant="secondary" onClick={() => onChange(null)} disabled={busy} className="text-red-600 hover:bg-red-50">
                            <FiTrash2 /> Remove
                        </Button>
                    </>
                )}
            </div>
            <p className="mt-2 text-xs text-slate-500">PDF only, up to 15 MB.</p>
            {problem && <p className="mt-1 text-sm text-red-500" role="alert">{problem}</p>}
        </div>
    );
};
