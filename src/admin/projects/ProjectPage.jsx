import React from 'react';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import { htmlToText } from '../../components/common/RichText';
import {
    ActionButton, Badge, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, truncate, useAdminList, useListControls,
} from '../ui';

const columns = ['Project', 'Category', 'Description', 'Actions'];
const searchFields = ['title', 'category', 'description'];

const ProjectPage = () => {
    const { items, loading, error, remove } = useAdminList('/api/v1/projects', 'project');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields);

    return (
        <div>
            <PageHeader
                title="Projects"
                subtitle="Investment projects visitors can browse and add to their cart."
                actionLabel="Add project"
                actionTo="/dashboard/projectform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by title or category..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No projects match your search.' : 'No projects yet.'} />
                    ) : pageItems.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Thumb src={p.image} alt={p.title} />
                                    <span className="font-medium text-slate-900">{p.title}</span>
                                </div>
                            </Td>
                            <Td>{p.category ? <Badge>{p.category}</Badge> : <span className="text-slate-400">—</span>}</Td>
                            <Td className="max-w-md text-slate-500">{truncate(htmlToText(p.description), 80)}</Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/projectdetailpage/${p._id}`} title="View" icon={FiEye} />
                                <ActionButton to={`/dashboard/projectformedit/${p._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(p._id, p.title)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default ProjectPage;
