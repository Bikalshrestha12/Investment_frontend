import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { mediaUrl } from '../../api/content';

const SWIPE_DISTANCE = 50;

/**
 * Full-screen photo viewer.
 *   images   [{ image, thumb, caption, alt }]
 *   index    photo to show, or null when closed
 * Keyboard: Esc closes, Left/Right change photo. Touch: swipe left/right.
 */
const Lightbox = ({ images, index, onChange, onClose }) => {
    const open = index !== null && index !== undefined && !!images[index];
    const closeRef = useRef(null);
    const touchStart = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const count = images.length;

    const go = useCallback((step) => {
        if (count > 1) onChange((index + step + count) % count);
    }, [count, index, onChange]);

    useEffect(() => { setLoaded(false); }, [index]);

    useEffect(() => {
        if (!open) return undefined;
        const previouslyFocused = document.activeElement;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = overflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') go(-1);
            else if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'Tab') {
                // Keep keyboard focus inside the viewer.
                const focusable = document.querySelectorAll('[data-lightbox] button');
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, go, onClose]);

    // Fetch the neighbouring photos so next/previous feel instant.
    useEffect(() => {
        if (!open || count < 2) return;
        [1, -1].forEach((step) => {
            const neighbour = images[(index + step + count) % count];
            if (neighbour) new Image().src = mediaUrl(neighbour.image);
        });
    }, [open, index, count, images]);

    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStart.current === null) return;
        const distance = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(distance) > SWIPE_DISTANCE) go(distance > 0 ? -1 : 1);
    };

    const photo = open ? images[index] : null;
    const navButton =
        'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-12 sm:w-12';

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    data-lightbox
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Photo ${index + 1} of ${count}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col bg-black"
                    onClick={onClose}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
                        <p className="text-sm" aria-live="polite">{index + 1} / {count}</p>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close photo viewer"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
                        {count > 1 && (
                            <button type="button" aria-label="Previous photo" className={`${navButton} left-2 sm:left-4`} onClick={(e) => { e.stopPropagation(); go(-1); }}>
                                <FiChevronLeft />
                            </button>
                        )}
                        {!loaded && <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" aria-hidden="true" />}
                        <img
                            key={photo.image}
                            src={mediaUrl(photo.image)}
                            alt={photo.alt || photo.caption || `Photo ${index + 1}`}
                            onLoad={() => setLoaded(true)}
                            onClick={(e) => e.stopPropagation()}
                            className={`max-h-full max-w-full select-none object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                            draggable={false}
                        />
                        {count > 1 && (
                            <button type="button" aria-label="Next photo" className={`${navButton} right-2 sm:right-4`} onClick={(e) => { e.stopPropagation(); go(1); }}>
                                <FiChevronRight />
                            </button>
                        )}
                    </div>

                    <div className="min-h-14 px-4 py-4 text-center text-white" onClick={(e) => e.stopPropagation()}>
                        {photo.caption && <p className="mx-auto max-w-3xl text-sm sm:text-base">{photo.caption}</p>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
};

export default Lightbox;
