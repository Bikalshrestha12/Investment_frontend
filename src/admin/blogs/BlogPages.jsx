import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
    ActionButton, Badge, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, useAdminList, useListControls,
} from '../ui';

const columns = ['Post', 'Category', 'Author', 'Date', 'Actions'];
const searchFields = ['title', 'category', 'author'];

const BlogPages = () => {
    const { items, loading, error, remove } = useAdminList('/api/v1/blogs', 'blog post');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields);

    return (
        <div>
            <PageHeader
                title="Blog posts"
                subtitle="Articles published in the Blog section."
                actionLabel="New post"
                actionTo="/dashboard/blogform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by title, category or author..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No posts match your search.' : 'No blog posts yet.'} />
                    ) : pageItems.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Thumb src={b.image} alt={b.title} size="h-11 w-16" />
                                    <span className="font-medium text-slate-900">{b.title}</span>
                                </div>
                            </Td>
                            <Td>{b.category ? <Badge color="amber">{b.category}</Badge> : '—'}</Td>
                            <Td>{b.author || '—'}</Td>
                            <Td className="whitespace-nowrap text-slate-500">
                                {b.date ? new Date(b.date).toLocaleDateString() : '—'}
                            </Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/blogformedit/${b._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(b._id, b.title)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default BlogPages;
