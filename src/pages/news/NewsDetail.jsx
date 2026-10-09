import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { FiArrowLeft, FiCheck, FiLink, FiUser } from 'react-icons/fi';
import { fetchNewsBySlug, thumbOf } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useSeo } from '../../hooks/useSeo';
import LazyImage from '../../components/common/LazyImage';
import RichText from '../../components/common/RichText';
import NewsCard, { NewsMeta } from '../../components/news/NewsCard';
import { buttonOutline } from '../../components/common/styles';
import { ErrorState, NotFoundState, PageBanner } from '../../components/common/PageParts';
import { ArticleSkeleton, SkeletonGroup } from '../../components/common/Skeleton';

// Share links open the network's own share dialog; no third-party scripts are loaded.
const ShareButtons = ({ title }) => {
    const [copied, setCopied] = useState(false);
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const networks = [
        { label: 'Facebook', icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
        { label: 'X (Twitter)', icon: FaTwitter, href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
        { label: 'LinkedIn', icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    ];
    const round = 'flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors duration-200 hover:bg-blue-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be blocked; the address bar still has the link.
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-gray-900">Share:</span>
            {networks.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`} className={round}>
                    <Icon aria-hidden="true" />
                </a>
            ))}
            <button type="button" onClick={copy} aria-label="Copy link" className={round}>
                {copied ? <FiCheck aria-hidden="true" /> : <FiLink aria-hidden="true" />}
            </button>
            <span className="text-sm text-gray-600" aria-live="polite">{copied ? 'Link copied' : ''}</span>
        </div>
    );
};

const NewsDetail = () => {
    const { slug } = useParams();
    const { data, loading, error, reload } = useAsync(() => fetchNewsBySlug(slug), [slug]);
    const article = data?.data;
    const related = data?.related || [];
    const notFound = error?.status === 404;

    useSeo({
        title: article?.title || (notFound ? 'News Not Found' : undefined),
        description: article?.excerpt,
        image: article?.featuredImage,
        type: 'article',
        noindex: !!error,
    });

    return (
        <div>
            <PageBanner title="News" trail={[{ label: 'News', to: '/news' }]} current={article?.title || 'Article'} />
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <SkeletonGroup label="Loading article" className="mx-auto max-w-3xl"><ArticleSkeleton /></SkeletonGroup>
                ) : notFound ? (
                    <NotFoundState
                        title="News Article Not Found"
                        message="This article does not exist or is no longer available."
                        backTo="/news"
                        backLabel="All News"
                    />
                ) : error ? (
                    <ErrorState message={error.message} onRetry={reload} />
                ) : (
                    <>
                        <article className="mx-auto max-w-3xl">
                            <header>
                                <NewsMeta article={article} />
                                <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{article.title}</h1>
                                {article.author && (
                                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600">
                                        <FiUser aria-hidden="true" /> By <span className="font-semibold text-gray-900">{article.author}</span>
                                    </p>
                                )}
                            </header>

                            {article.featuredImage && (
                                <LazyImage
                                    src={article.featuredImage}
                                    thumb={thumbOf(article.featuredImage)}
                                    alt={article.featuredImageAlt || article.title}
                                    eager
                                    sizes="(min-width: 768px) 768px, 100vw"
                                    className="mt-8 aspect-[16/9] rounded-lg shadow-lg"
                                />
                            )}

                            <RichText html={article.content} className="mt-8" />

                            {article.tags?.length > 0 && (
                                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
                                    {article.tags.map((tag) => (
                                        <li key={tag._id}>
                                            <Link to={`/news?tag=${tag.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800">
                                                #{tag.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <ShareButtons title={article.title} />
                                <Link to="/news" className={buttonOutline}><FiArrowLeft aria-hidden="true" /> All News</Link>
                            </div>
                        </article>

                        {related.length > 0 && (
                            <section className="mt-16" aria-labelledby="related-news">
                                <h2 id="related-news" className="mb-8 text-center text-3xl font-bold">Related News</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {related.map((item, index) => <NewsCard key={item._id} article={item} index={index} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsDetail;
