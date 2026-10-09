import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiImage } from 'react-icons/fi';
import LazyImage from '../common/LazyImage';
import { formatDate } from '../../api/content';

const photoCountLabel = (count = 0) => `${count} ${count === 1 ? 'Photo' : 'Photos'}`;

// Album cover with title, year and number of photos.
const AlbumCard = ({ album, index = 0, headingLevel: Heading = 'h3' }) => (
    <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.1 }}
    >
        <Link
            to={`/gallery/${album.slug}`}
            className="group block overflow-hidden rounded-lg bg-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
            <div className="relative">
                <LazyImage
                    src={album.coverImage}
                    alt={`Cover of ${album.title}`}
                    className="aspect-[4/3]"
                    imgClassName="transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
            </div>
            <div className="bg-blue-950 p-4 text-white transition-colors duration-300 group-hover:bg-blue-900">
                <Heading className="truncate text-lg font-semibold">{album.title}</Heading>
                <p className="mt-1 flex items-center justify-between text-sm text-blue-200">
                    <time dateTime={album.publishedAt} className="inline-flex items-center gap-1.5">
                        <FiCalendar aria-hidden="true" /> {formatDate(album.publishedAt, { year: 'numeric' })}
                    </time>
                    <span className="inline-flex items-center gap-1.5">
                        <FiImage aria-hidden="true" /> {photoCountLabel(album.photoCount)}
                    </span>
                </p>
            </div>
        </Link>
    </motion.article>
);

export default AlbumCard;
