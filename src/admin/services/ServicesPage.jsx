import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { htmlToText } from '../../components/common/RichText';
import {
    ActionButton, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, truncate, useAdminList, useListControls,
} from '../ui';

const columns = ['Service', 'Description', 'Icon', 'Actions'];
const searchFields = ['title', 'description'];

const ServicesPage = () => {
    const { items, loading, error, remove } = useAdminList('/api/v1/services', 'service');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields);

    return (
        <div>
            <PageHeader
                title="Services"
                subtitle="Services shown on the public Services page."
                actionLabel="Add service"
                actionTo="/dashboard/servicesform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No services match your search.' : 'No services yet.'} />
                    ) : pageItems.map((s) => (
                        <tr key={s._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Thumb src={s.image} alt={s.title} />
                                    <span className="font-medium text-slate-900">{s.title}</span>
                                </div>
                            </Td>
                            <Td className="max-w-md text-slate-500">{truncate(htmlToText(s.description), 90)}</Td>
                            <Td><Thumb src={s.icon} alt="" size="h-8 w-8" rounded="rounded-md" /></Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/servicesformedit/${s._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(s._id, s.title)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default ServicesPage;
