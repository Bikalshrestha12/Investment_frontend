import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

// Links written in the editor open in a new tab; make sure they cannot reach back into this page.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
    }
});

const ALLOWED_TAGS = [
    'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
    'blockquote', 'ul', 'ol', 'li', 'a', 'hr', 'code', 'pre',
];

// Renders HTML from the dashboard editor. The server already sanitises it when it is
// saved; it is sanitised again here so nothing unsafe can reach the page either way.
const RichText = ({ html, className = '' }) => {
    const clean = useMemo(
        () => DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR: ['href', 'target', 'rel'] }),
        [html],
    );
    return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
};

// Plain text of editor HTML, for places too small for formatting (cards, table cells).
export const htmlToText = (html = '') =>
    new DOMParser()
        .parseFromString(String(html).replace(/<\/(p|h[2-4]|li|blockquote)>|<br\s*\/?>/gi, '$& '), 'text/html')
        .body.textContent.replace(/\s+/g, ' ').trim();

export default RichText;
