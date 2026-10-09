import React, { useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { mediaUrl, srcSetFor } from '../../api/content';

/**
 * Image that is only downloaded when it comes near the viewport (native lazy loading),
 * shows a skeleton until it has loaded and a neutral placeholder if it is missing or broken.
 *
 *   src / thumb   stored paths; `thumb` (640px) + `src` (1920px) become a responsive srcSet
 *   sizes         how wide the image is displayed, so the browser picks the right file
 *   className     size and shape of the frame, e.g. "aspect-[4/3] rounded-lg"
 *   eager         load immediately (use for the main image at the top of a page)
 */
const LazyImage = ({
    src, thumb, alt = '', sizes = '100vw', className = '', imgClassName = '',
    width, height, eager = false,
}) => {
    const [status, setStatus] = useState(src || thumb ? 'loading' : 'missing');
    const source = mediaUrl(src || thumb);

    useEffect(() => {
        setStatus(src || thumb ? 'loading' : 'missing');
    }, [src, thumb]);

    return (
        <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
            {status === 'loading' && <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />}
            {status === 'missing' ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300" role="img" aria-label={alt || 'No image'}>
                    <FiImage className="h-10 w-10" />
                </div>
            ) : (
                <img
                    src={source}
                    srcSet={srcSetFor(thumb, src)}
                    sizes={srcSetFor(thumb, src) ? sizes : undefined}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('missing')}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
                />
            )}
        </div>
    );
};

export default LazyImage;
