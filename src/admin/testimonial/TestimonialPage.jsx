import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
    ActionButton, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, truncate, useAdminList, useListControls,
} from '../ui';

const columns = ['Client', 'Testimonial', 'Actions'];
const searchFields = ['name', 'profession', 'text'];

const TestimonialPage = () => {
    const { items, loading, error, remove } = useAdminList('/api/v1/testimonials', 'testimonial');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields);

    return (
        <div>
            <PageHeader
                title="Testimonials"
                subtitle="Client quotes shown in the Testimonials section."
                actionLabel="Add testimonial"
                actionTo="/dashboard/testimonialsform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by name or profession..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No testimonials match your search.' : 'No testimonials yet.'} />
                    ) : pageItems.map((t) => (
                        <tr key={t._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Thumb src={t.image} alt={t.name} rounded="rounded-full" />
                                    <div>
                                        <p className="font-medium text-slate-900">{t.name}</p>
                                        <p className="text-xs text-slate-500">{t.profession}</p>
                                    </div>
                                </div>
                            </Td>
                            <Td className="max-w-lg italic text-slate-500">“{truncate(t.text, 110)}”</Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/testimonialsformedit/${t._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(t._id, t.name)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default TestimonialPage;
