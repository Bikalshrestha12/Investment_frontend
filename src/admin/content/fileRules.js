// Client-side upload rules. They mirror the server (middleware/mediaUpload.js) so mistakes
// are caught before a file is sent; the server repeats every check.

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const IMAGE_MAX = 8 * 1024 * 1024;
const PDF_MAX = 15 * 1024 * 1024;

export const IMAGE_ACCEPT = IMAGE_TYPES.join(',');
export const MEDIA_ACCEPT = `${IMAGE_ACCEPT},application/pdf,.pdf`;
export const MAX_FILES_PER_UPLOAD = 20;

const isPdf = (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

// Each check returns an error message for the first invalid file, or null.
export const checkImages = (files) => {
    if (files.length > MAX_FILES_PER_UPLOAD) return `You can upload up to ${MAX_FILES_PER_UPLOAD} files at a time.`;
    for (const file of files) {
        if (!IMAGE_TYPES.includes(file.type)) return `"${file.name}" is not a JPG, PNG, WEBP or GIF image.`;
        if (file.size > IMAGE_MAX) return `"${file.name}" is larger than 8 MB.`;
    }
    return null;
};

export const checkPdf = (file) => {
    if (!isPdf(file)) return `"${file.name}" is not a PDF file.`;
    if (file.size > PDF_MAX) return `"${file.name}" is larger than 15 MB.`;
    return null;
};

// Media library accepts both.
export const checkMedia = (files) => {
    if (files.length > MAX_FILES_PER_UPLOAD) return `You can upload up to ${MAX_FILES_PER_UPLOAD} files at a time.`;
    for (const file of files) {
        const problem = isPdf(file) ? checkPdf(file) : checkImages([file]);
        if (problem) return problem;
    }
    return null;
};
