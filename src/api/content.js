import AxiosWithAuth, { API_BASE_URL, resolveImage } from '../contexts/AxiosWithAuth';

// API calls for News, Notices, Gallery, Media and Site settings.
// Public reads are cached in memory for a minute so moving between pages (or the same
// request from two components) does not hit the server again.

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map();

const cleanParams = (params = {}) =>
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null));

const cachedGet = (url, params) => {
    const query = cleanParams(params);
    const key = `${url}?${new URLSearchParams(query)}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.time < CACHE_TTL_MS) return hit.promise;

    const promise = AxiosWithAuth().get(url, { params: query }).then((res) => res.data);
    cache.set(key, { time: Date.now(), promise });
    // A failed request must not be served from the cache.
    promise.catch(() => cache.delete(key));
    return promise;
};

// Called after every admin change so the public pages show it straight away.
export const clearContentCache = () => cache.clear();

// Turn an axios error into { status, message } with wording fit for visitors.
export const apiError = (err) => {
    const status = err?.response?.status || 0;
    const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
    if (!err?.response) {
        return { status: 0, message: 'We could not reach the server. Please check your connection and try again.' };
    }
    if (status >= 500) return { status, message: 'Something went wrong on our side. Please try again in a moment.' };
    return { status, message: typeof serverMessage === 'string' ? serverMessage : 'The request could not be completed.' };
};

// ---- Helpers -----------------------------------------------------------------------

export const mediaUrl = resolveImage;

// Thumbnail (640px) for small screens and cards, full image (up to 1920px) for the rest.
export const srcSetFor = (thumb, image) =>
    thumb && image && thumb !== image ? `${resolveImage(thumb)} 640w, ${resolveImage(image)} 1920w` : undefined;

// Media library images have a 640px companion file next to the full one.
export const thumbOf = (image = '') =>
    image.startsWith('/uploads/media/') && !image.endsWith('-thumb.webp')
        ? image.replace(/\.webp$/, '-thumb.webp')
        : undefined;

export const noticeDownloadUrl =(slug, { inline = false } = {}) =>
    `${API_BASE_URL}/api/v1/notices/${encodeURIComponent(slug)}/download${inline ? '?inline=1' : ''}`;

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', options);
};

export const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ---- Public ------------------------------------------------------------------------

export const fetchHomeContent = () => cachedGet('/api/v1/content/home');
export const fetchSettings = () => cachedGet('/api/v1/settings');

export const fetchNews = (params) => cachedGet('/api/v1/news', params);
export const fetchNewsCategories = () => cachedGet('/api/v1/news/categories');
export const fetchNewsBySlug = (slug) => cachedGet(`/api/v1/news/${encodeURIComponent(slug)}`);

export const fetchNotices = (params) => cachedGet('/api/v1/notices', params);
export const fetchNoticeCategories = () => cachedGet('/api/v1/notices/categories');
export const fetchNoticeBySlug = (slug) => cachedGet(`/api/v1/notices/${encodeURIComponent(slug)}`);

export const fetchAlbums = (params) => cachedGet('/api/v1/gallery', params);
export const fetchAlbumBySlug = (slug) => cachedGet(`/api/v1/gallery/${encodeURIComponent(slug)}`);

// ---- Admin -------------------------------------------------------------------------

const ADMIN = '/api/v1/admin';

const mutate = async (request) => {
    const res = await request;
    clearContentCache();
    return res.data;
};

export const adminApi = {
    list: (resource, params) => AxiosWithAuth().get(`${ADMIN}/${resource}`, { params: cleanParams(params) }).then((r) => r.data),
    get: (resource, id) => AxiosWithAuth().get(`${ADMIN}/${resource}/${id}`).then((r) => r.data.data),
    create: (resource, body) => mutate(AxiosWithAuth().post(`${ADMIN}/${resource}`, body)).then((d) => d.data),
    update: (resource, id, body) => mutate(AxiosWithAuth().put(`${ADMIN}/${resource}/${id}`, body)).then((d) => d.data),
    remove: (resource, id, params) => mutate(AxiosWithAuth().delete(`${ADMIN}/${resource}/${id}`, { params })),

    stats: () => AxiosWithAuth().get(`${ADMIN}/content/stats`).then((r) => r.data.data),
    saveSettings: (body) => mutate(AxiosWithAuth().put(`${ADMIN}/settings`, body)).then((d) => d.data),

    // Upload images / PDFs to the media library. `onProgress` receives 0-100.
    uploadMedia: (files, onProgress) => {
        const form = new FormData();
        Array.from(files).forEach((file) => form.append('files', file));
        return mutate(AxiosWithAuth().post(`${ADMIN}/media`, form, {
            timeout: 5 * 60 * 1000,
            onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
        })).then((d) => d.data);
    },

    // PDFs are not public files, so they are fetched with the session token.
    downloadMedia: async (media) => {
        const res = await AxiosWithAuth().get(`${ADMIN}/media/${media._id}/download`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = media.originalName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    uploadAlbumImages: (albumId, files, onProgress) => {
        const form = new FormData();
        Array.from(files).forEach((file) => form.append('images', file));
        return mutate(AxiosWithAuth().post(`${ADMIN}/gallery/${albumId}/images`, form, {
            timeout: 5 * 60 * 1000,
            onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
        })).then((d) => d.data);
    },
    addAlbumImagesFromLibrary: (albumId, mediaIds) =>
        mutate(AxiosWithAuth().post(`${ADMIN}/gallery/${albumId}/images`, { mediaIds })).then((d) => d.data),
    reorderAlbumImages: (albumId, order) =>
        mutate(AxiosWithAuth().put(`${ADMIN}/gallery/${albumId}/images/reorder`, { order })),
    updateAlbumImage: (imageId, body) =>
        mutate(AxiosWithAuth().put(`${ADMIN}/gallery/images/${imageId}`, body)).then((d) => d.data),
    deleteAlbumImage: (imageId) => mutate(AxiosWithAuth().delete(`${ADMIN}/gallery/images/${imageId}`)),
};
