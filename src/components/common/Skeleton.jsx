import React from 'react';

// Skeleton placeholders shown while content is loading. Each one mirrors the shape of
// the real component, so the page does not jump when the data arrives.

export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />
);

const Lines = ({ widths = ['w-full', 'w-5/6', 'w-2/3'] }) => (
    <div className="space-y-2">
        {widths.map((w, i) => <Skeleton key={i} className={`h-3 ${w}`} />)}
    </div>
);

// Wraps a group of skeletons and announces the loading state to screen readers once.
export const SkeletonGroup = ({ label = 'Loading content', className = '', children }) => (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
        <span className="sr-only">{label}…</span>
        {children}
    </div>
);

export const NewsCardSkeleton = () => (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="space-y-4 p-5">
            <div className="flex gap-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-11/12" />
            <Lines />
            <Skeleton className="h-9 w-28 rounded-full" />
        </div>
    </div>
);

export const FeaturedNewsSkeleton = () => (
    <div className="grid overflow-hidden rounded-lg bg-white shadow-lg lg:grid-cols-2">
        <Skeleton className="aspect-[16/10] w-full rounded-none lg:aspect-auto lg:min-h-80" />
        <div className="space-y-4 p-6 lg:p-10">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-8 w-2/3" />
            <Lines />
            <Skeleton className="h-10 w-32 rounded-full" />
        </div>
    </div>
);

export const NoticeItemSkeleton = () => (
    <div className="flex gap-4 rounded-lg bg-white p-5 shadow-md sm:gap-6">
        <Skeleton className="h-20 w-16 shrink-0 sm:w-20" />
        <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Lines widths={['w-full', 'w-2/3']} />
            <div className="flex gap-3">
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
            </div>
        </div>
    </div>
);

export const AlbumCardSkeleton = () => (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    </div>
);

export const PhotoGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
    </div>
);

// Article-style detail page (news and notices).
export const ArticleSkeleton = ({ withImage = true }) => (
    <div className="space-y-6">
        <div className="flex gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-9 w-11/12" />
        <Skeleton className="h-9 w-2/3" />
        {withImage && <Skeleton className="aspect-[16/9] w-full rounded-lg" />}
        <Lines widths={['w-full', 'w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-2/3']} />
    </div>
);

export const SkeletonList = ({ count = 6, as: Item, className }) => (
    <SkeletonGroup className={className}>
        {Array.from({ length: count }).map((_, i) => <Item key={i} />)}
    </SkeletonGroup>
);

// Fallback while a lazily loaded page (code-split route) is being downloaded.
export const PageSkeleton = () => (
    <SkeletonGroup label="Loading page">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-10">
            <div className="container mx-auto flex flex-col items-center gap-4 px-4">
                <div className="h-10 w-56 animate-pulse rounded bg-white/20" />
                <div className="h-4 w-40 animate-pulse rounded bg-white/20" />
            </div>
        </div>
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-3/4" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i} />)}
            </div>
        </div>
    </SkeletonGroup>
);

// Fallback for lazily loaded dashboard pages.
export const AdminPageSkeleton = () => (
    <SkeletonGroup label="Loading page" className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
        </div>
    </SkeletonGroup>
);
