import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBell, FiCamera, FiImage, FiRss } from 'react-icons/fi';
import { adminApi, formatDate } from '../../api/content';
import { Card, Thumb } from '../ui';
import { StatusBadge } from './shared';
import { errorMessage } from './hooks';

// Dashboard overview block for News, Notices and Gallery: totals and recent activity.
// One request (/admin/content/stats) feeds the whole block.

const statCards = [
    { key: 'news', label: 'Total news', icon: FiRss, to: '/dashboard/news', color: 'bg-indigo-50 text-indigo-600' },
    { key: 'notices', label: 'Total notices', icon: FiBell, to: '/dashboard/notices', color: 'bg-amber-50 text-amber-600' },
    { key: 'albums', label: 'Total gallery albums', icon: FiImage, to: '/dashboard/gallery', color: 'bg-emerald-50 text-emerald-600' },
    { key: 'images', label: 'Total gallery images', icon: FiCamera, to: '/dashboard/gallery', color: 'bg-sky-50 text-sky-600' },
];

const RecentList = ({ title, to, items, loading, empty, renderItem }) => (
    <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                View all <FiArrowRight />
            </Link>
        </div>
        <ul className="divide-y divide-slate-100">
            {loading && Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="space-y-2 px-5 py-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                </li>
            ))}
            {!loading && items.length === 0 && <li className="px-5 py-10 text-center text-sm text-slate-500">{empty}</li>}
            {!loading && items.map(renderItem)}
        </ul>
    </Card>
);

const TextRow = ({ item, to }) => (
    <li>
        <Link to={to} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
            <div className="min-w-0">
                <p className="truncate font-medium text-slate-800">{item.title}</p>
                <p className="text-sm text-slate-500">Updated {formatDate(item.updatedAt)}</p>
            </div>
            <StatusBadge item={item} />
        </Link>
    </li>
);

const ContentOverview = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        adminApi.stats()
            .then((data) => { if (!cancelled) setStats(data); })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load the content overview.')); });
        return () => { cancelled = true; };
    }, []);

    const loading = !stats && !error;

    return (
        <section aria-labelledby="content-overview" className="space-y-4">
            <h2 id="content-overview" className="text-lg font-semibold text-slate-900">News, notices and gallery</h2>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(({ key, label, icon: Icon, to, color }) => (
                    <Link key={key} to={to} className="group">
                        <Card className="flex items-center gap-4 p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                <Icon className="h-6 w-6" />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm text-slate-500">{label}</p>
                                {loading ? (
                                    <div className="mt-1 h-7 w-12 animate-pulse rounded bg-slate-200" />
                                ) : (
                                    <p className="text-2xl font-bold text-slate-900">{stats ? stats.totals[key] : '—'}</p>
                                )}
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <RecentList
                    title="Recent news"
                    to="/dashboard/news"
                    loading={loading}
                    items={stats?.recentNews || []}
                    empty="No news articles yet."
                    renderItem={(item) => <TextRow key={item._id} item={item} to={`/dashboard/newsformedit/${item._id}`} />}
                />
                <RecentList
                    title="Recent notices"
                    to="/dashboard/notices"
                    loading={loading}
                    items={stats?.recentNotices || []}
                    empty="No notices yet."
                    renderItem={(item) => <TextRow key={item._id} item={item} to={`/dashboard/noticeformedit/${item._id}`} />}
                />
                <RecentList
                    title="Recent gallery activity"
                    to="/dashboard/gallery"
                    loading={loading}
                    items={stats?.recentGallery || []}
                    empty="No albums yet."
                    renderItem={(album) => (
                        <li key={album._id}>
                            <Link to={`/dashboard/galleryformedit/${album._id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
                                <Thumb src={album.coverImage} alt="" size="h-11 w-14" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-slate-800">{album.title}</p>
                                    <p className="text-sm text-slate-500">
                                        {album.photoCount} photo{album.photoCount === 1 ? '' : 's'} · updated {formatDate(album.updatedAt)}
                                    </p>
                                </div>
                                <StatusBadge item={album} />
                            </Link>
                        </li>
                    )}
                />
            </div>
        </section>
    );
};

export default ContentOverview;
