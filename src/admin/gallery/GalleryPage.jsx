import React, { useState } from 'react';
import { FiEdit2, FiExternalLink, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../api/content';
import {
    ActionButton, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SkeletonRows, Td, Thumb,
} from '../ui';
import { ConfirmDialog, ListToolbar, SortableTable, StatusBadge } from '../content/shared';
import { publishState, usePagedList } from '../content/hooks';

const columns = [
    { label: 'Album', field: 'title' },
    { label: 'Photos' },
    { label: 'Status', field: 'status' },
    { label: 'Date', field: 'publishedAt' },
    { label: 'Actions', align: 'right' },
];

const GalleryPage = () => {
    const list = usePagedList('gallery', { noun: 'album' });
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
        list.patch(item._id, { status: publish ? 'published' : 'draft' }, publish ? 'Album published' : 'Album unpublished');
    };

    return (
        <div>
            <PageHeader
                title="Gallery"
                subtitle="Photo albums shown on the Gallery page."
                actionLabel="New album"
                actionTo="/dashboard/galleryform"
            />
            <ErrorBanner message={list.error} />

            <Card>
                <ListToolbar
                    search={list.search}
                    onSearch={list.setSearch}
                    status={list.status}
                    onStatus={list.setStatus}
                    placeholder="Search by title or description..."
                />
                <SortableTable columns={columns} sort={list.sort} onSort={list.toggleSort}>
                    {list.loading ? <SkeletonRows cols={columns.length} /> : list.items.length === 0 ? (
                        <EmptyRow
                            colSpan={columns.length}
                            message={list.search || list.status ? 'No albums match your search.' : 'No albums yet. Create the first one.'}
                        />
                    ) : list.items.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex min-w-56 items-center gap-3">
                                    <Thumb src={item.coverImage} alt="" size="h-11 w-16" />
                                    <span className="line-clamp-1 font-medium text-slate-900">{item.title}</span>
                                </div>
                            </Td>
                            <Td className="whitespace-nowrap">{item.photoCount ?? 0}</Td>
                            <Td><StatusBadge item={item} /></Td>
                            <Td className="whitespace-nowrap text-slate-500">{formatDate(item.publishedAt) || '—'}</Td>
                            <Td className="whitespace-nowrap text-right">
                                {publishState(item) === 'published' && (
                                    <a
                                        href={`/gallery/${item.slug}`}
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
                                    onClick={() => togglePublish(item)}
                                    title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                                    color="blue"
                                    icon={item.status === 'published' ? FiEyeOff : FiEye}
                                />
                                <ActionButton to={`/dashboard/galleryformedit/${item._id}`} title="Edit album and photos" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => setToDelete(item)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </SortableTable>
                {!list.loading && <Pagination page={list.page} totalPages={list.pages} total={list.total} onChange={list.setPage} />}
            </Card>

            <ConfirmDialog
                open={!!toDelete}
                title="Delete album?"
                message={`"${toDelete?.title}" and its ${toDelete?.photoCount || 0} photo(s) will be permanently deleted. This cannot be undone.`}
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
};

export default GalleryPage;
