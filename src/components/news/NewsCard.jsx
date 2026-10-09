import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import LazyImage from '../common/LazyImage';
import { buttonPrimary } from '../common/styles';
import { formatDate, thumbOf } from '../../api/content';

export const NewsMeta = ({ article, className = '' }) => (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 ${className}`}>
        {article.category && (
            <Link
                to={`/news?category=${article.category.slug}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 hover:bg-blue-200"
            >
                {article.category.name}
            </Link>
        )}
        <time dateTime={article.publishedAt} className="inline-flex items-center gap-1.5">
            <FiCalendar aria-hidden="true" /> {formatDate(article.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
    </div>
);

// Card used on the news page, the home page and under "Related news".
const NewsCard = ({ article, index = 0, headingLevel: Heading = 'h3' }) => {
    const to = `/news/${article.slug}`;
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.1 }}
            className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        >
            <Link to={to} tabIndex={-1} aria-hidden="true" className="block">
                <LazyImage
                    src={article.featuredImage}
                    thumb={thumbOf(article.featuredImage)}
                    alt=""
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                    className="aspect-[16/10]"
                    imgClassName="transform transition-transform duration-500 group-hover:scale-110"
                />
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <NewsMeta article={article} />
                <Heading className="mt-3 text-xl font-semibold leading-snug text-gray-900">
                    <Link to={to} className="transition-colors hover:text-blue-600">{article.title}</Link>
                </Heading>
                {article.excerpt && <p className="mt-2 line-clamp-3 text-gray-600">{article.excerpt}</p>}
                <div className="mt-auto pt-5">
                    <Link to={to} className={buttonPrimary} aria-label={`Read more: ${article.title}`}>
                        Read More <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

export default NewsCard;
