import React, { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSession } from '../auth/SessionProvider';
import {
    FiBell, FiBriefcase, FiExternalLink, FiFileText, FiFolder, FiGrid, FiHelpCircle, FiImage, FiLayers,
    FiLogOut, FiMenu, FiMessageSquare, FiRss, FiSettings, FiUsers, FiUserCheck, FiX,
} from 'react-icons/fi';
import { AdminPageSkeleton } from '../components/common/Skeleton';

// Sidebar sections. To add a page, add an entry to the group it belongs to.
// `match` lists the URL prefixes (after /dashboard/) that keep the entry highlighted.
export const adminNavGroups = [
    {
        items: [{ label: 'Dashboard', to: '/dashboard', icon: FiGrid, end: true }],
    },
    {
        title: 'Content',
        items: [
            { label: 'News', to: '/dashboard/news', icon: FiRss, match: ['news'] },
            { label: 'Notices', to: '/dashboard/notices', icon: FiBell, match: ['notice'] },
            { label: 'Gallery', to: '/dashboard/gallery', icon: FiImage, match: ['gallery'] },
        ],
    },
    {
        title: 'Media',
        items: [{ label: 'Media Library', to: '/dashboard/media', icon: FiFolder, match: ['media'] }],
    },
    {
        title: 'Manage',
        items: [
            { label: 'Services', to: '/dashboard/services', icon: FiLayers, match: ['services'] },
            { label: 'Projects', to: '/dashboard/projects', icon: FiBriefcase, match: ['project'] },
            { label: 'Blogs', to: '/dashboard/blogs', icon: FiFileText, match: ['blog'] },
            { label: 'Team', to: '/dashboard/teams', icon: FiUsers, match: ['teams'] },
            { label: 'Testimonials', to: '/dashboard/testimonials', icon: FiMessageSquare, match: ['testimonials'] },
            { label: 'FAQs', to: '/dashboard/faqs', icon: FiHelpCircle, match: ['faqs'] },
            { label: 'Users', to: '/dashboard/totalUser', icon: FiUserCheck, match: ['totalUser'] },
        ],
    },
    {
        title: 'Settings',
        items: [{ label: 'Site Settings', to: '/dashboard/settings', icon: FiSettings, match: ['settings'] }],
    },
];

export const adminNav = adminNavGroups.flatMap((group) => group.items);

// Section of the current URL, e.g. /dashboard/blogformedit/1 -> "blogformedit"
const sectionOf = (pathname) => pathname.split('/')[2] || '';

const isActive = (item, pathname) => {
    const section = sectionOf(pathname);
    if (item.end) return section === '';
    return item.match.some((m) => section.startsWith(m));
};

const SidebarContent = ({ pathname, onNavigate }) => (
    <div className="flex h-full flex-col">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">N</span>
            <div>
                <p className="text-base font-semibold text-white leading-tight">Nexas</p>
                <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
        </Link>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Dashboard">
            {adminNavGroups.map((group) => (
                <div key={group.title || 'main'}>
                    {group.title && (
                        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.title}</p>
                    )}
                    <ul className="space-y-1">
                        {group.items.map((item) => {
                            const active = isActive(item, pathname);
                            const Icon = item.icon;
                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.end}
                                        onClick={onNavigate}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-[18px] w-[18px] shrink-0" />
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>

        <div className="border-t border-white/10 p-3">
            <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
                <FiExternalLink className="h-[18px] w-[18px]" />
                View website
            </Link>
        </div>
    </div>
);

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user: sessionUser, logout } = useSession();
    const user = sessionUser || {};
    const displayName = user.fullName || user.name || user.email || 'Admin';
    const current = adminNav.find((item) => isActive(item, pathname));

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = () => {
        // Ends the session in every open tab; the other tabs redirect themselves.
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-roboto">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-slate-900 lg:block">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900 shadow-xl">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            aria-label="Close menu"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <FiMenu className="h-5 w-5" />
                    </button>
                    <p className="text-sm text-slate-500">
                        Dashboard
                        {current && !current.end && (
                            <>
                                <span className="mx-2 text-slate-300">/</span>
                                <span className="font-medium text-slate-800">{current.label}</span>
                            </>
                        )}
                    </p>

                    <div className="ml-auto flex items-center gap-3">
                        <Link to="profile" className=" text-right sm sm:flex sm:items-center sm:gap-3">
                            <div className="hidden sm sm:flex flex-col items-end">
                                <p className="text-sm font-medium text-slate-800 leading-tight">{displayName}</p>
                                <p className="text-xs capitalize text-slate-500">{user.role || 'admin'}</p>
                            </div>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold uppercase text-blue-700">
                                {displayName.charAt(0)}
                            </span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600"
                        >
                            <FiLogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {/* Dashboard pages are loaded on demand; the sidebar stays in place meanwhile. */}
                    <Suspense fallback={<AdminPageSkeleton />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AdminLayout;
