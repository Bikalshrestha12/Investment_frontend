import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiFileText, FiX } from 'react-icons/fi';
import { fetchNews, fetchNewsCategories, thumbOf } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useListParams } from '../../hooks/useListParams';
import { useSeo } from '../../hooks/useSeo';
import LazyImage from '../../components/common/LazyImage';
import NewsCard, { NewsMeta } from '../../components/news/NewsCard';
import { buttonPrimary } from '../../components/common/styles';
import {
    EmptyState, ErrorState, FilterBar, PageBanner, Pagination, SearchEmptyState, SectionHeading,
} from '../../components/common/PageParts';
import { FeaturedNewsSkeleton, NewsCardSkeleton, SkeletonGroup } from '../../components/common/Skeleton';

const PER_PAGE = 9;

// Large card for the highlighted article at the top of the first page.
const FeaturedNews = ({ article }) => {
    const to = `/news/${article.slug}`;
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group mb-10 grid overflow-hidden rounded-lg bg-white shadow-lg lg:grid-cols-2"
        >
            <Link to={to} tabIndex={-1} aria-hidden="true" className="block">
                <LazyImage
                    src={article.featuredImage}
                    thumb={thumbOf(article.featuredImage)}
                    alt=""
                    eager
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="aspect-[16/10] h-full lg:aspect-auto lg:min-h-80"
                    imgClassName="transform transition-transform duration-500 group-hover:scale-105"
                />
            </Link>
            <div className="flex flex-col justify-center p-6 lg:p-10">
                <span className="mb-3 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Featured</span>
                <NewsMeta article={article} />
                <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                    <Link to={to} className="transition-colors hover:text-blue-600">{article.title}</Link>
                </h2>
                {article.excerpt && <p className="mt-3 line-clamp-3 text-gray-600">{article.excerpt}</p>}
                <div className="mt-6">
                    <Link to={to} className={buttonPrimary} aria-label={`Read more: ${article.title}`}>
                        Read More <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

const NewsList = () => {
    const { values, searchInput, setSearchInput, set, setPage, reset, hasFilters } = useListParams(['category', 'sort', 'tag']);
    const { search, category, sort, tag, page } = values;

    useSeo({
        title: 'News',
        description: 'Latest news, announcements and updates from Nexas Global Investment.',
    });

    const { data: categories } = useAsync(fetchNewsCategories);
    const { data, loading, error, reload } = useAsync(
        () => fetchNews({ search, category, sort, tag, page, limit: PER_PAGE }),
        [search, category, sort, tag, page],
    );

    const articles = data?.data || [];
    // The highlighted article only appears on the unfiltered first page.
    const showFeatured = !hasFilters && page === 1 && articles.length > 0;
    const featured = showFeatured ? articles.find((a) => a.featured) || articles[0] : null;
    const rest = featured ? articles.filter((a) => a._id !== featured._id) : articles;

    return (
        <div>
            <PageBanner title="News" />
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        as="h1"
                        kicker="Latest News"
                        title="News & Announcements"
                        description="Company updates, investment insights and announcements."
                    />

                    <FilterBar
                        search={searchInput}
                        onSearch={setSearchInput}
                        placeholder="Search news..."
                        selects={[
                            {
                                label: 'Category',
                                value: category,
                                onChange: (value) => set('category', value),
                                options: [{ value: '', label: 'All categories' }, ...(categories?.data || []).map((c) => ({ value: c.slug, label: c.name }))],
                            },
                            {
                                label: 'Sort by date',
                                value: sort,
                                onChange: (value) => set('sort', value),
                                options: [{ value: '', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }],
                            },
                        ]}
                    />

                    {tag && (
                        <p className="-mt-4 mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            Showing articles tagged
                            <button
                                type="button"
                                onClick={() => set('tag', '')}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 hover:bg-blue-200"
                                aria-label={`Remove tag filter ${tag}`}
                            >
                                #{tag} <FiX aria-hidden="true" />
                            </button>
                        </p>
                    )}

                    {loading ? (
                        <SkeletonGroup label="Loading news">
                            {!hasFilters && page === 1 && <div className="mb-10"><FeaturedNewsSkeleton /></div>}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
                            </div>
                        </SkeletonGroup>
                    ) : error ? (
                        <ErrorState message={error.message} onRetry={reload} />
                    ) : articles.length === 0 ? (
                        hasFilters ? <SearchEmptyState onReset={reset} /> : (
                            <EmptyState
                                icon={FiFileText}
                                title="No News Available"
                                message="There are currently no news articles available. Please check back later."
                            />
                        )
                    ) : (
                        <>
                            {featured && <FeaturedNews article={featured} />}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {rest.map((article, index) => (
                                    <NewsCard key={article._id} article={article} index={index} headingLevel={featured ? 'h3' : 'h2'} />
                                ))}
                            </div>
                            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsList;
