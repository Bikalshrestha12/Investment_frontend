import React from 'react';
import { FiImage } from 'react-icons/fi';
import { fetchAlbums } from '../../api/content';
import { useAsync } from '../../hooks/useAsync';
import { useListParams } from '../../hooks/useListParams';
import { useSeo } from '../../hooks/useSeo';
import AlbumCard from '../../components/gallery/AlbumCard';
import {
    EmptyState, ErrorState, FilterBar, PageBanner, Pagination, SearchEmptyState, SectionHeading,
} from '../../components/common/PageParts';
import { AlbumCardSkeleton, SkeletonList } from '../../components/common/Skeleton';

const PER_PAGE = 12;
const gridClass = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';

const GalleryList = () => {
    const { values, searchInput, setSearchInput, set, setPage, reset, hasFilters } = useListParams(['year']);
    const { search, year, page } = values;

    useSeo({
        title: 'Gallery',
        description: 'Photo albums from meetings, events and corporate activities of Nexas Global Investment.',
    });

    const { data, loading, error, reload } = useAsync(
        () => fetchAlbums({ search, year, page, limit: PER_PAGE }),
        [search, year, page],
    );
    const albums = data?.data || [];
    const years = data?.years || [];

    return (
        <div>
            <PageBanner title="Gallery" />
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <SectionHeading
                        as="h1"
                        kicker="Gallery"
                        title="Moments From Our Events"
                        description="Browse photo albums from our meetings, events and corporate activities."
                    />

                    <FilterBar
                        search={searchInput}
                        onSearch={setSearchInput}
                        placeholder="Search albums..."
                        selects={[{
                            label: 'Year',
                            value: year,
                            onChange: (value) => set('year', value),
                            options: [{ value: '', label: 'All years' }, ...years.map((y) => ({ value: String(y), label: String(y) }))],
                        }]}
                    />

                    {loading ? (
                        <SkeletonList as={AlbumCardSkeleton} count={6} className={gridClass} />
                    ) : error ? (
                        <ErrorState message={error.message} onRetry={reload} />
                    ) : albums.length === 0 ? (
                        hasFilters ? <SearchEmptyState onReset={reset} /> : (
                            <EmptyState
                                icon={FiImage}
                                title="No Albums Available"
                                message="There are currently no photo albums available. Please check back later."
                            />
                        )
                    ) : (
                        <>
                            <div className={gridClass}>
                                {albums.map((album, index) => (
                                    <AlbumCard key={album._id} album={album} index={index} headingLevel="h2" />
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

export default GalleryList;
