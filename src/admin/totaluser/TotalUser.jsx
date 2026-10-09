import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiEye, FiX } from 'react-icons/fi';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';
import {
    ActionButton, Badge, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, useListControls,
} from '../ui';

const columns = ['User', 'Role', 'Phone', 'Joined', 'Actions'];
const searchFields = ['_id', 'fullName', 'email', 'role', 'phone'];

const formatDate = (dateString, pattern = 'MMM dd, yyyy') => {
    try {
        return format(new Date(dateString), pattern);
    } catch {
        return '—';
    }
};

const Avatar = ({ user, size = 'h-10 w-10' }) =>
    user.image ? (
        <Thumb src={user.image} alt={user.fullName} size={size} rounded="rounded-full" />
    ) : (
        <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold uppercase text-blue-700`}>
            {(user.fullName || user.email || '?').charAt(0)}
        </span>
    );

const TotalUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(users, searchFields, 10);

    useEffect(() => {
        AxiosWithAuth().get('/api/v1/auth/users')
            .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
            .catch((err) => {
                console.error('Error fetching user data:', err);
                setError(err.response?.data?.error || err.response?.data?.message || 'Could not load users.');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setSelectedUser(null);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div>
            <PageHeader title="Users" subtitle={loading ? 'Registered accounts.' : `${users.length} registered accounts.`} />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, role or ID..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No users match your search.' : 'No users yet.'} />
                    ) : pageItems.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Avatar user={u} />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-slate-900">{u.fullName || '—'}</p>
                                        <p className="truncate text-xs text-slate-500">{u.email}</p>
                                    </div>
                                </div>
                            </Td>
                            <Td><Badge color={u.role === 'admin' ? 'green' : 'slate'}><span className="capitalize">{u.role || 'user'}</span></Badge></Td>
                            <Td className="text-slate-500">{u.phone || '—'}</Td>
                            <Td className="whitespace-nowrap text-slate-500">{formatDate(u.createdAt)}</Td>
                            <Td className="text-right">
                                <ActionButton onClick={() => setSelectedUser(u)} title="View details" icon={FiEye} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>

            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
                    onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="user-details-title"
                >
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 id="user-details-title" className="text-lg font-semibold text-slate-900">User details</h3>
                            <button onClick={() => setSelectedUser(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <div className="mb-5 flex items-center gap-4">
                                <Avatar user={selectedUser} size="h-14 w-14" />
                                <div>
                                    <p className="font-semibold text-slate-900">{selectedUser.fullName || '—'}</p>
                                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                                </div>
                            </div>
                            <dl className="divide-y divide-slate-100 text-sm">
                                <DetailRow label="Role" value={<span className="capitalize">{selectedUser.role || '—'}</span>} />
                                <DetailRow label="Phone" value={selectedUser.phone} />
                                <DetailRow label="Address" value={selectedUser.address} />
                                <DetailRow label="Joined" value={formatDate(selectedUser.createdAt, 'MMM dd, yyyy HH:mm')} />
                                <DetailRow label="ID" value={<span className="font-mono text-xs">{selectedUser._id}</span>} />
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex gap-4 py-2.5">
        <dt className="w-20 shrink-0 text-slate-500">{label}</dt>
        <dd className="text-slate-900 break-all">{value || '—'}</dd>
    </div>
);

export default TotalUser;
