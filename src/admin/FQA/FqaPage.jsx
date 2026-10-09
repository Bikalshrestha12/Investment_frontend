import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
    ActionButton, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, truncate, useAdminList, useListControls,
} from '../ui';

const columns = ['Question', 'Answer', 'Actions'];
const searchFields = ['question', 'answer'];

const FqaPage = () => {
    const { items, loading, error, remove } = useAdminList('/api/v1/faqs', 'FAQ');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields);

    return (
        <div>
            <PageHeader
                title="FAQs"
                subtitle="Frequently asked questions shown on the FAQ page."
                actionLabel="Add FAQ"
                actionTo="/dashboard/faqsform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search questions and answers..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No FAQs match your search.' : 'No FAQs yet.'} />
                    ) : pageItems.map((f) => (
                        <tr key={f._id} className="hover:bg-slate-50">
                            <Td className="max-w-xs font-medium text-slate-900">{f.question}</Td>
                            <Td className="max-w-lg text-slate-500">{truncate(f.answer, 120)}</Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/faqsformedit/${f._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(f._id, truncate(f.question, 40))} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default FqaPage;
