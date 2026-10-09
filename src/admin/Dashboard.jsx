import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiArrowRight, FiBriefcase, FiFileText, FiHelpCircle, FiLayers,
    FiMessageSquare, FiPlus, FiUserCheck, FiUsers,
} from 'react-icons/fi';
import DashboardCharts from './chart/BarChart';
import AxiosWithAuth from '../contexts/AxiosWithAuth';
import { Badge, Card, Thumb } from './ui';
import { htmlToText } from '../components/common/RichText';
import ContentOverview from './content/ContentOverview';

const statCards = [
    { key: 'users', label: 'Registered users', icon: FiUserCheck, to: '/dashboard/totalUser', color: 'bg-blue-50 text-blue-600' },
    { key: 'projects', label: 'Projects', icon: FiBriefcase, to: '/dashboard/projects', color: 'bg-emerald-50 text-emerald-600' },
    { key: 'services', label: 'Services', icon: FiLayers, to: '/dashboard/services', color: 'bg-violet-50 text-violet-600' },
    { key: 'blogs', label: 'Blog posts', icon: FiFileText, to: '/dashboard/blogs', color: 'bg-amber-50 text-amber-600' },
    { key: 'team', label: 'Team members', icon: FiUsers, to: '/dashboard/teams', color: 'bg-sky-50 text-sky-600' },
    { key: 'testimonials', label: 'Testimonials', icon: FiMessageSquare, to: '/dashboard/testimonials', color: 'bg-rose-50 text-rose-600' },
    { key: 'faqs', label: 'FAQs', icon: FiHelpCircle, to: '/dashboard/faqs', color: 'bg-slate-100 text-slate-600' },
];

const quickActions = [
    { label: 'New news article', to: '/dashboard/newsform' },
    { label: 'New notice', to: '/dashboard/noticeform' },
    { label: 'New album', to: '/dashboard/galleryform' },
    { label: 'New project', to: '/dashboard/projectform' },
    { label: 'New service', to: '/dashboard/servicesform' },
    { label: 'New blog post', to: '/dashboard/blogform' },
    { label: 'New team member', to: '/dashboard/teamsform' },
];

const listOf = (res) => (Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : []);

const Dashboard = () => {
    const [data, setData] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const api = AxiosWithAuth();
        const endpoints = {
            users: '/api/v1/auth/users',
            projects: '/api/v1/projects',
            services: '/api/v1/services',
            blogs: '/api/v1/blogs',
            team: '/api/v1/team',
            testimonials: '/api/v1/testimonials',
            faqs: '/api/v1/faqs',
        };

        const load = async () => {
            const keys = Object.keys(endpoints);
            // One failing endpoint should not blank out the whole dashboard.
            const [lists, chart] = await Promise.all([
                Promise.allSettled(keys.map((k) => api.get(endpoints[k]))),
                api.get('/api/v1/auth/dashboard').catch(() => null),
            ]);
            const next = {};
            lists.forEach((r, i) => { next[keys[i]] = r.status === 'fulfilled' ? listOf(r.value) : null; });
            setData(next);
            setStats(chart?.data || null);
            setLoading(false);
        };
        load();
    }, []);

    const recentProjects = (data.projects || []).slice(0, 5);
    const recentBlogs = [...(data.blogs || [])]
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        .slice(0, 4);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">A snapshot of your site content and users.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {quickActions.map((a) => (
                        <Link
                            key={a.to}
                            to={a.to}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-700"
                        >
                            <FiPlus className="h-4 w-4" /> {a.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stat cards */}
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
                                    <p className="text-2xl font-bold text-slate-900">{data[key] ? data[key].length : '—'}</p>
                                )}
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* News, notices and gallery: totals and recent activity */}
            <ContentOverview />

            <DashboardCharts roles={stats?.roles} monthly={stats?.monthlyRegistrations} loading={loading} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent projects */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">Projects</h2>
                        <Link to="/dashboard/projects" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                            View all <FiArrowRight />
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {loading && <li className="px-5 py-8"><div className="h-4 animate-pulse rounded bg-slate-200" /></li>}
                        {!loading && recentProjects.length === 0 && (
                            <li className="px-5 py-10 text-center text-sm text-slate-500">No projects yet.</li>
                        )}
                        {recentProjects.map((p) => (
                            <li key={p._id}>
                                <Link to={`/dashboard/projectdetailpage/${p._id}`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-slate-50">
                                    <Thumb src={p.image} alt={p.title} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-slate-800">{p.title}</p>
                                        <p className="truncate text-sm text-slate-500">{htmlToText(p.description)}</p>
                                    </div>
                                    {p.category && <Badge>{p.category}</Badge>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* Latest blog posts */}
                <Card>
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">Latest posts</h2>
                        <Link to="/dashboard/blogs" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                            View all <FiArrowRight />
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {!loading && recentBlogs.length === 0 && (
                            <li className="px-5 py-10 text-center text-sm text-slate-500">No blog posts yet.</li>
                        )}
                        {recentBlogs.map((b) => (
                            <li key={b._id}>
                                <Link to={`/dashboard/blogformedit/${b._id}`} className="block px-5 py-3 transition-colors hover:bg-slate-50">
                                    <p className="truncate font-medium text-slate-800">{b.title}</p>
                                    <p className="text-sm text-slate-500">
                                        {b.author || 'Unknown author'}
                                        {(b.date || b.createdAt) && ` · ${new Date(b.date || b.createdAt).toLocaleDateString()}`}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
