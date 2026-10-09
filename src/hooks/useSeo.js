import { useEffect, useState } from 'react';
import { fetchSettings, mediaUrl } from '../api/content';

export const DEFAULT_SITE_NAME = 'Nexas Global Investment';
const DEFAULT_DESCRIPTION =
    'Nexas Global Investment: investment services, projects, news, notices and gallery.';

// Site settings (name, description, URL, share image) are loaded once for the whole app.
let settingsPromise = null;
const loadSettings = () => {
    if (!settingsPromise) {
        settingsPromise = fetchSettings().then((res) => res.data || {}).catch(() => ({}));
    }
    return settingsPromise;
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState({});
    useEffect(() => {
        let cancelled = false;
        loadSettings().then((data) => { if (!cancelled) setSettings(data); });
        return () => { cancelled = true; };
    }, []);
    return settings;
};

const setMeta = (attribute, key, content) => {
    let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!content) {
        tag?.remove();
        return;
    }
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

const setCanonical = (href) => {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
};

const truncate = (text = '', max = 160) => (text.length > max ? `${text.slice(0, max - 1).trim()}…` : text);

/**
 * Page title, meta description, canonical URL and Open Graph / Twitter tags.
 *   useSeo({ title, description, image, type: 'article', noindex })
 * Pass `title: undefined` while the page is still loading; the tags update when data arrives.
 */
export const useSeo = ({ title, description, image, type = 'website', noindex = false } = {}) => {
    const settings = useSiteSettings();
    const siteName = settings.siteName || DEFAULT_SITE_NAME;
    const base = (settings.siteUrl || window.location.origin).replace(/\/+$/, '');
    const shareImage = image || settings.defaultShareImage || '';

    useEffect(() => {
        const fullTitle = title ? `${title} | ${siteName}` : siteName;
        const desc = truncate(description || settings.siteDescription || DEFAULT_DESCRIPTION);
        const url = `${base}${window.location.pathname}`;
        const imageUrl = shareImage ? mediaUrl(shareImage) : '';

        document.title = fullTitle;
        setMeta('name', 'description', desc);
        setMeta('name', 'robots', noindex ? 'noindex' : '');
        setCanonical(url);
        setMeta('property', 'og:site_name', siteName);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:image', imageUrl);
        setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image', imageUrl);

        return () => {
            // Pages without their own SEO fall back to the site defaults.
            document.title = siteName;
            setMeta('name', 'robots', '');
        };
    }, [title, description, shareImage, type, noindex, siteName, base, settings.siteDescription]);
};
