import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiDownload, FiExternalLink, FiFileText, FiStar } from 'react-icons/fi';
import { fetchNoticeBySlug, formatDate, formatFileSize, noticeDownloadUrl } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useSeo } from '../../hooks/useSeo';
import RichText from '../../components/common/RichText';
import { NoticeDate } from '../../components/notices/NoticeItem';
import { buttonOutline, buttonPrimary } from '../../components/common/styles';
import { ErrorState, NotFoundState, PageBanner } from '../../components/common/PageParts';
import { ArticleSkeleton, Skeleton, SkeletonGroup } from '../../components/common/Skeleton';

const Attachment = ({ notice }) => (
    <section aria-labelledby="attachment-heading" className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 id="attachment-heading" className="mb-4 text-lg font-semibold text-gray-900">Attached Document</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <FiFileText className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{notice.attachment.name}</p>
                <p className="text-sm text-gray-600">PDF document · {formatFileSize(notice.attachment.size)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <a href={noticeDownloadUrl(notice.slug, { inline: true })} target="_blank" rel="noopener noreferrer" className={buttonOutline}>
                    <FiExternalLink aria-hidden="true" /> View
                </a>
                <a href={noticeDownloadUrl(notice.slug)} className={buttonPrimary}>
                    <FiDownload aria-hidden="true" /> Download PDF
                </a>
            </div>
        </div>
    </section>
);

const RelatedNotices = ({ notices }) => (
    <aside aria-labelledby="related-notices" className="rounded-lg bg-white p-5 shadow-md">
        <h2 id="related-notices" className="mb-4 border-b border-slate-200 pb-3 text-xl font-bold text-gray-900">Related Notices</h2>
        <ul className="divide-y divide-slate-100">
            {notices.map((item) => (
                <li key={item._id} className="flex gap-3 py-3">
                    <NoticeDate date={item.publishedAt} />
                    <div className="min-w-0">
                        <Link to={`/notices/${item.slug}`} className="line-clamp-2 font-medium text-gray-900 transition-colors hover:text-blue-600">
                            {item.title}
                        </Link>
                        {item.category && <p className="mt-1 text-xs uppercase tracking-wide text-blue-800">{item.category.name}</p>}
                    </div>
                </li>
            ))}
        </ul>
    </aside>
);

const NoticeDetail = () => {
    const { slug } = useParams();
    const { data, loading, error, reload } = useAsync(() => fetchNoticeBySlug(slug), [slug]);
    const notice = data?.data;
    const related = data?.related || [];
    const notFound = error?.status === 404;

    useSeo({
        title: notice?.title || (notFound ? 'Notice Not Found' : undefined),
        description: notice?.excerpt,
        type: 'article',
        noindex: !!error,
    });

    return (
        <div>
            <PageBanner title="Notices" trail={[{ label: 'Notices', to: '/notices' }]} current={notice?.title || 'Notice'} />
            <div className="bg-slate-50 py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <SkeletonGroup label="Loading notice" className="grid gap-8 lg:grid-cols-3">
                            <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2"><ArticleSkeleton withImage={false} /></div>
                            <Skeleton className="h-72 w-full rounded-lg" />
                        </SkeletonGroup>
                    ) : notFound ? (
                        <NotFoundState
                            title="Notice Not Found"
                            message="This notice does not exist or is no longer available."
                            backTo="/notices"
                            backLabel="All Notices"
                        />
                    ) : error ? (
                        <ErrorState message={error.message} onRetry={reload} />
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-3">
                            <article className="rounded-lg bg-white p-6 shadow-md sm:p-8 lg:col-span-2">
                                <header className="border-b border-slate-200 pb-6">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        {notice.category && (
                                            <Link to={`/notices?category=${notice.category.slug}`} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 hover:bg-blue-200">
                                                {notice.category.name}
                                            </Link>
                                        )}
                                        {notice.featured && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                                                <FiStar aria-hidden="true" /> Important
                                            </span>
                                        )}
                                        <time dateTime={notice.publishedAt} className="inline-flex items-center gap-1.5">
                                            <FiCalendar aria-hidden="true" /> {formatDate(notice.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                    </div>
                                    <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">{notice.title}</h1>
                                </header>

                                {notice.content
                                    ? <RichText html={notice.content} className="mt-6" />
                                    : notice.excerpt && <p className="mt-6 text-gray-700">{notice.excerpt}</p>}

                                {notice.attachment && <Attachment notice={notice} />}

                                <div className="mt-8 border-t border-slate-200 pt-6">
                                    <Link to="/notices" className={buttonOutline}><FiArrowLeft aria-hidden="true" /> All Notices</Link>
                                </div>
                            </article>

                            <div>
                                {related.length > 0 && <RelatedNotices notices={related} />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;
