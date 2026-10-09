import React from 'react';
import { FiBell } from 'react-icons/fi';
import { fetchNoticeCategories, fetchNotices } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useListParams } from '../../hooks/useListParams';
import { useSeo } from '../../hooks/useSeo';
import NoticeItem from '../../components/notices/NoticeItem';
import {
    EmptyState, ErrorState, FilterBar, PageBanner, Pagination, SearchEmptyState, SectionHeading,
} from '../../components/common/PageParts';
import { NoticeItemSkeleton, SkeletonList } from '../../components/common/Skeleton';

const PER_PAGE = 10;

const NoticeList = () => {
    const { values, searchInput, setSearchInput, set, setPage, reset, hasFilters } = useListParams(['category', 'sort']);
    const { search, category, sort, page } = values;

    useSeo({
        title: 'Notices',
        description: 'Official notices, meeting announcements and downloadable documents from Nexas Global Investment.',
    });

    const { data: categories } = useAsync(fetchNoticeCategories);
    const { data, loading, error, reload } = useAsync(
        () => fetchNotices({ search, category, sort, page, limit: PER_PAGE }),
        [search, category, sort, page],
    );
    const notices = data?.data || [];

    return (
        <div>
            <PageBanner title="Notices" />
            <div className="bg-slate-50 py-12">
                <div className="container mx-auto max-w-5xl px-4">
                    <SectionHeading
                        as="h1"
                        kicker="Notice Board"
                        title="Notices & Announcements"
                        description="Official notices for shareholders, clients and the public."
                    />

                    <FilterBar
                        search={searchInput}
                        onSearch={setSearchInput}
                        placeholder="Search notices..."
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

                    {loading ? (
                        <SkeletonList as={NoticeItemSkeleton} count={5} className="space-y-4" />
                    ) : error ? (
                        <ErrorState message={error.message} onRetry={reload} />
                    ) : notices.length === 0 ? (
                        hasFilters ? <SearchEmptyState onReset={reset} /> : (
                            <EmptyState
                                icon={FiBell}
                                title="No Notices Available"
                                message="There are currently no notices available. Please check back later."
                            />
                        )
                    ) : (
                        <>
                            <div className="space-y-4">
                                {notices.map((notice, index) => (
                                    <NoticeItem key={notice._id} notice={notice} index={index} headingLevel="h2" />
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

export default NoticeList;
