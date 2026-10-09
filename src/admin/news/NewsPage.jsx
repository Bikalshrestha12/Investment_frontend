import React, { useState } from 'react';
import { FiEdit2, FiExternalLink, FiEye, FiEyeOff, FiStar, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../api/content';
import {
    ActionButton, Badge, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SkeletonRows, Td, Thumb,
} from '../ui';
import { ConfirmDialog, ListToolbar, SortableTable, StatusBadge } from '../content/shared';
import { publishState, usePagedList } from '../content/hooks';

const columns = [
    { label: 'Article', field: 'title' },
    { label: 'Category' },
    { label: 'Status', field: 'status' },
    { label: 'Published', field: 'publishedAt' },
    { label: 'Actions', align: 'right' },
];

const NewsPage = () => {
    const list = usePagedList('news', { noun: 'news article' });
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = async () => {
        setDeleting(true);
        await list.remove(toDelete._id);
        setDeleting(false);
        setToDelete(null);
    };

    const togglePublish = (item) => {
        const publish = item.status !== 'published';
        list.patch(item._id, { status: publish ? 'published' : 'draft' }, publish ? 'Article published' : 'Article unpublished');
    };

    return (
        <div>
            <PageHeader
                title="News"
                subtitle="Articles shown on the News page and the home page."
                actionLabel="New article"
                actionTo="/dashboard/newsform"
            />
            <ErrorBanner message={list.error} />

            <Card>
                <ListToolbar
                    search={list.search}
                    onSearch={list.setSearch}
                    status={list.status}
                    onStatus={list.setStatus}
                    placeholder="Search by title, excerpt or author..."
                />
                <SortableTable columns={columns} sort={list.sort} onSort={list.toggleSort}>
                    {list.loading ? <SkeletonRows cols={columns.length} /> : list.items.length === 0 ? (
                        <EmptyRow
                            colSpan={columns.length}
                            message={list.search || list.status ? 'No articles match your search.' : 'No news articles yet. Create the first one.'}
                        />
                    ) : list.items.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex min-w-64 items-center gap-3">
                                    <Thumb src={item.featuredImage} alt="" size="h-11 w-16" />
                                    <div className="min-w-0">
                                        <p className="line-clamp-1 font-medium text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {item.author || 'No author'}
                                            {item.featured && <span className="ml-2 inline-flex items-center gap-1 text-amber-600"><FiStar className="fill-current" /> Featured</span>}
                                        </p>
                                    </div>
                                </div>
                            </Td>
                            <Td>{item.category ? <Badge color="blue">{item.category.name}</Badge> : <span className="text-slate-400">—</span>}</Td>
                            <Td><StatusBadge item={item} /></Td>
                            <Td className="whitespace-nowrap text-slate-500">{formatDate(item.publishedAt) || '—'}</Td>
                            <Td className="whitespace-nowrap text-right">
                                {publishState(item) === 'published' && (
                                    <a
                                        href={`/news/${item.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="View on site"
                                        aria-label={`View ${item.title} on site`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
                                    >
                                        <FiExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                                <ActionButton
                                    onClick={() => list.patch(item._id, { featured: !item.featured }, item.featured ? 'Removed from featured' : 'Marked as featured')}
                                    title={item.featured ? 'Unfeature' : 'Feature'}
                                    color="blue"
                                    icon={FiStar}
                                />
                                <ActionButton
                                    onClick={() => togglePublish(item)}
                                    title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                                    color="blue"
                                    icon={item.status === 'published' ? FiEyeOff : FiEye}
                                />
                                <ActionButton to={`/dashboard/newsformedit/${item._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => setToDelete(item)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </SortableTable>
                {!list.loading && <Pagination page={list.page} totalPages={list.pages} total={list.total} onChange={list.setPage} />}
            </Card>

            <ConfirmDialog
                open={!!toDelete}
                title="Delete news article?"
                message={`"${toDelete?.title}" will be permanently deleted. This cannot be undone.`}
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
};

export default NewsPage;
