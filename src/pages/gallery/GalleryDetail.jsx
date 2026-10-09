import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiImage, FiZoomIn } from 'react-icons/fi';
import { fetchAlbumBySlug, formatDate } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useSeo } from '../../hooks/useSeo';
import LazyImage from '../../components/common/LazyImage';
import Lightbox from '../../components/gallery/Lightbox';
import { buttonOutline } from '../../components/common/styles';
import { EmptyState, ErrorState, NotFoundState, PageBanner } from '../../components/common/PageParts';
import { PhotoGridSkeleton, Skeleton, SkeletonGroup } from '../../components/common/Skeleton';

const GalleryDetail = () => {
    const { slug } = useParams();
    const [active, setActive] = useState(null);
    const { data, loading, error, reload } = useAsync(() => fetchAlbumBySlug(slug), [slug]);
    const album = data?.data;
    const images = album?.images || [];
    const notFound = error?.status === 404;

    useSeo({
        title: album ? `${album.title} - Gallery` : notFound ? 'Album Not Found' : undefined,
        description: album?.description || (album ? `Photos from ${album.title}.` : undefined),
        image: album?.coverImage,
        noindex: !!error,
    });

    return (
        <div>
            <PageBanner title="Gallery" trail={[{ label: 'Gallery', to: '/gallery' }]} current={album?.title || 'Album'} />
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <SkeletonGroup label="Loading album">
                        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3">
                            <Skeleton className="h-9 w-3/4" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <PhotoGridSkeleton />
                    </SkeletonGroup>
                ) : notFound ? (
                    <NotFoundState
                        title="Album Not Found"
                        message="This album does not exist or is no longer available."
                        backTo="/gallery"
                        backLabel="All Albums"
                    />
                ) : error ? (
                    <ErrorState message={error.message} onRetry={reload} />
                ) : (
                    <>
                        <motion.header
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto mb-10 max-w-3xl text-center"
                        >
                            <h1 className="text-3xl font-bold md:text-4xl">{album.title}</h1>
                            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-gray-600">
                                <time dateTime={album.publishedAt} className="inline-flex items-center gap-1.5">
                                    <FiCalendar aria-hidden="true" /> {formatDate(album.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </time>
                                <span className="inline-flex items-center gap-1.5">
                                    <FiImage aria-hidden="true" /> {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                                </span>
                            </p>
                            {album.description && <p className="mt-4 text-gray-700">{album.description}</p>}
                        </motion.header>

                        {images.length === 0 ? (
                            <EmptyState icon={FiImage} title="No Photos Yet" message="Photos for this album have not been added yet. Please check back later." />
                        ) : (
                            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {images.map((image, index) => (
                                    <li key={image._id}>
                                        <button
                                            type="button"
                                            onClick={() => setActive(index)}
                                            aria-label={`Open photo ${index + 1} of ${images.length}${image.caption ? `: ${image.caption}` : ''}`}
                                            className="group relative block w-full overflow-hidden rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                        >
                                            <LazyImage
                                                src={image.image}
                                                thumb={image.thumb}
                                                alt={image.alt || image.caption || `${album.title} photo ${index + 1}`}
                                                width={image.width}
                                                height={image.height}
                                                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                                className="aspect-square"
                                                imgClassName="transform transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center bg-blue-950/50 text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                                <FiZoomIn aria-hidden="true" />
                                            </span>
                                            {image.caption && (
                                                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 text-left text-sm text-white">
                                                    {image.caption}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-10 text-center">
                            <Link to="/gallery" className={buttonOutline}><FiArrowLeft aria-hidden="true" /> All Albums</Link>
                        </div>

                        <Lightbox images={images} index={active} onChange={setActive} onClose={() => setActive(null)} />
                    </>
                )}
            </div>
        </div>
    );
};

export default GalleryDetail;
