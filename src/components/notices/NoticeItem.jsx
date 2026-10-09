import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiFileText, FiStar } from 'react-icons/fi';
import { buttonOutline, buttonPrimary } from '../common/styles';
import { formatDate, formatFileSize, noticeDownloadUrl } from '../../api/content';

// Date block on the left of a notice: "12" over "Sep 2026".
export const NoticeDate = ({ date }) => (
    <time
        dateTime={date}
        className="flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-950 text-white sm:w-20"
    >
        <span className="text-2xl font-bold leading-none">{formatDate(date, { day: '2-digit' })}</span>
        <span className="mt-1 text-xs uppercase tracking-wide text-blue-200">{formatDate(date, { month: 'short', year: 'numeric' })}</span>
    </time>
);

// One row of the notice board. `compact` (home page, related notices) hides the excerpt and buttons.
const NoticeItem = ({ notice, index = 0, compact = false, headingLevel: Heading = 'h3' }) => {
    const to = `/notices/${notice.slug}`;
    const hasPdf = !!notice.attachment || !!notice.hasAttachment;
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.08 }}
            className={`flex gap-4 rounded-lg border-l-4 bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:gap-6 sm:p-5 ${notice.featured ? 'border-blue-600' : 'border-transparent'}`}
        >
            <NoticeDate date={notice.publishedAt} />
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    {notice.category && (
                        <Link to={`/notices?category=${notice.category.slug}`} className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 hover:bg-blue-200">
                            {notice.category.name}
                        </Link>
                    )}
                    {notice.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                            <FiStar aria-hidden="true" /> Important
                        </span>
                    )}
                    {hasPdf && (
                        <span className="inline-flex items-center gap-1 text-red-600" title="PDF attached">
                            <FiFileText className="h-4 w-4" aria-hidden="true" /> PDF
                            {notice.attachment?.size ? (
                                <span className="font-normal normal-case text-gray-500">({formatFileSize(notice.attachment.size)})</span>
                            ) : null}
                        </span>
                    )}
                </div>
                <Heading className="mt-2 text-lg font-semibold leading-snug text-gray-900">
                    <Link to={to} className="transition-colors hover:text-blue-600">{notice.title}</Link>
                </Heading>
                {!compact && notice.excerpt && <p className="mt-1 line-clamp-2 text-gray-600">{notice.excerpt}</p>}
                {!compact && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link to={to} className={buttonPrimary} aria-label={`Read more: ${notice.title}`}>
                            Read More <FiArrowRight aria-hidden="true" />
                        </Link>
                        {hasPdf && (
                            <a href={noticeDownloadUrl(notice.slug)} className={buttonOutline} aria-label={`Download PDF: ${notice.title}`}>
                                <FiDownload aria-hidden="true" /> Download PDF
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.article>
    );
};

export default NoticeItem;
