import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiZoomIn } from 'react-icons/fi';
import { fetchHomeContent } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import NewsCard from '../news/NewsCard';
import NoticeItem from '../notices/NoticeItem';
import LazyImage from '../common/LazyImage';
import Lightbox from '../gallery/Lightbox';
import { SectionHeading } from '../common/PageParts';
import { NewsCardSkeleton, NoticeItemSkeleton, Skeleton, SkeletonGroup } from '../common/Skeleton';

// Latest News, Latest Notices and Gallery sections of the home page.
// All three come from one request, and that request only starts when the visitor
// scrolls near the sections, so they cost nothing for people who never get that far.

const viewAllClass =
    'mt-10 inline-block rounded-full border-x-2 bg-blue-700 px-5 py-3 text-center text-gray-200 duration-500 hover:bg-gray-200 hover:text-blue-700';

const ViewAll = ({ to, children }) => (
    <div className="text-center">
        <Link to={to} className={viewAllClass}>
            {children} <FiArrowRight className="ml-1 inline" aria-hidden="true" />
        </Link>
    </div>
);

const newsGrid = 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3';
const galleryGrid = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';

const LatestNews = ({ news, loading }) => (
    <section className="py-12" aria-labelledby="home-news">
        <div className="container mx-auto px-4">
            <SectionHeading kicker="Latest News" title={<span id="home-news">News & Announcements</span>} />
            {loading ? (
                <SkeletonGroup label="Loading news" className={newsGrid}>
                    {Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i} />)}
                </SkeletonGroup>
            ) : (
                <div className={newsGrid}>
                    {news.map((article, index) => <NewsCard key={article._id} article={article} index={index} />)}
                </div>
            )}
            <ViewAll to="/news">View All News</ViewAll>
        </div>
    </section>
);

const LatestNotices = ({ notices, loading }) => (
    <section className="bg-slate-50 py-12" aria-labelledby="home-notices">
        <div className="container mx-auto max-w-5xl px-4">
            <SectionHeading kicker="Notice Board" title={<span id="home-notices">Latest Notices</span>} />
            {loading ? (
                <SkeletonGroup label="Loading notices" className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <NoticeItemSkeleton key={i} />)}
                </SkeletonGroup>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice, index) => <NoticeItem key={notice._id} notice={notice} index={index} compact />)}
                </div>
            )}
            <ViewAll to="/notices">View All Notices</ViewAll>
        </div>
    </section>
);

const GalleryPreview = ({ images, loading }) => {
    const [active, setActive] = useState(null);
    return (
        <section className="py-12" aria-labelledby="home-gallery">
            <div className="container mx-auto px-4">
                <SectionHeading kicker="Gallery" title={<span id="home-gallery">Moments From Our Events</span>} />
                {loading ? (
                    <SkeletonGroup label="Loading gallery" className={galleryGrid}>
                        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
                    </SkeletonGroup>
                ) : (
                    <ul className={galleryGrid}>
                        {images.map((image, index) => (
                            <motion.li
                                key={image._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: Math.min(index, 7) * 0.06 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActive(index)}
                                    aria-label={`Open photo${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
                                    className="group relative block w-full overflow-hidden rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                >
                                    <LazyImage
                                        src={image.image}
                                        thumb={image.thumb}
                                        alt={image.alt || image.caption || image.album?.title || 'Gallery photo'}
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                        className="aspect-square"
                                        imgClassName="transform transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center bg-blue-950/50 text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                        <FiZoomIn aria-hidden="true" />
                                    </span>
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                )}
                <ViewAll to="/gallery">View Gallery</ViewAll>
                <Lightbox images={images} index={active} onChange={setActive} onClose={() => setActive(null)} />
            </div>
        </section>
    );
};

const HomeContent = () => {
    // Start loading a little before the sections scroll into view.
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '400px 0px' });
    const { data, error } = useAsync(fetchHomeContent, [], { enabled: inView });
    // Skeletons hold the space from the first render until a result (or error) arrives.
    const loading = !data && !error;

    const content = data?.data || {};
    const news = content.news || [];
    const notices = content.notices || [];
    const gallery = content.gallery || [];

    // The home page stays clean if the API is down or nothing is published yet:
    // these sections are simply left out (the dedicated pages show the full states).
    const failedOrEmpty = error || (!loading && !news.length && !notices.length && !gallery.length);
    if (failedOrEmpty) return null;

    return (
        <div ref={ref}>
            {(loading || news.length > 0) && <LatestNews news={news} loading={loading} />}
            {(loading || notices.length > 0) && <LatestNotices notices={notices} loading={loading} />}
            {(loading || gallery.length > 0) && <GalleryPreview images={gallery.slice(0, 8)} loading={loading} />}
        </div>
    );
};

export default HomeContent;
