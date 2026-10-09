import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FiArrowDown, FiArrowUp, FiEdit2, FiMove, FiTrash2 } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import {
    ActionButton, Card, EmptyRow, ErrorBanner, PageHeader, Pagination, SearchInput,
    SkeletonRows, Table, Td, Thumb, truncate, useAdminList, useListControls,
} from '../ui';
import { htmlToText } from '../../components/common/RichText';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const columns = ['Order', 'Member', 'Role', 'About', 'Social', 'Actions'];
const searchFields = ['name', 'role', 'description'];
const socials = [
    { key: 'facebook', icon: FaFacebookF },
    { key: 'twitter', icon: FaTwitter },
    { key: 'instagram', icon: FaInstagram },
    { key: 'linkedin', icon: FaLinkedinIn },
];

// Every member is on one page, so a row can be dragged to any position.
const PER_PAGE = 1000;

const move = (list, from, to) => {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

const orderButton = 'inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30';

const TeamPage = () => {
    const { items, setItems, loading, error, remove } = useAdminList('/api/v1/team', 'team member');
    const { search, setSearch, page, setPage, totalPages, filtered, pageItems } = useListControls(items, searchFields, PER_PAGE);
    const dragFrom = useRef(null);
    const orderBeforeDrag = useRef(null);
    const [draggingId, setDraggingId] = useState(null);
    // A search result is only part of the list, so its rows cannot be given a position.
    const canReorder = !search.trim() && items.length > 1;

    const saveOrder = async (next, previous) => {
        try {
            await AxiosWithAuth().put('/api/v1/team/reorder', { order: next.map((m) => m._id) });
            toast.success('Team order saved');
        } catch (err) {
            setItems(previous);
            toast.error(err.response?.data?.error || err.response?.data?.message || 'The new order could not be saved.');
        }
    };

    const onMove = (from, to) => {
        const next = move(items, from, to);
        setItems(next);
        saveOrder(next, items);
    };

    // Drag and drop: the rows reorder live while dragging and the order is saved on drop.
    const onDragStart = (e, index) => {
        dragFrom.current = index;
        orderBeforeDrag.current = items;
        setDraggingId(items[index]._id);
        e.dataTransfer.effectAllowed = 'move';
    };
    const onDragOver = (e, index) => {
        if (dragFrom.current === null) return;
        e.preventDefault();
        const from = dragFrom.current;
        if (from === index) return;
        setItems((prev) => move(prev, from, index));
        dragFrom.current = index;
    };
    const onDragEnd = () => {
        if (dragFrom.current === null) return;
        dragFrom.current = null;
        setDraggingId(null);
        const before = orderBeforeDrag.current;
        if (before && before.some((m, i) => m._id !== items[i]?._id)) saveOrder(items, before);
    };

    return (
        <div>
            <PageHeader
                title="Team"
                subtitle="People listed on the Team page. Drag a row, or use the arrows, to set the order shown on the site."
                actionLabel="Add member"
                actionTo="/dashboard/teamsform"
            />
            <ErrorBanner message={error} />

            <Card>
                <div className="border-b border-slate-200 p-4">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search by name or role..." />
                </div>
                <Table columns={columns}>
                    {loading ? <SkeletonRows cols={columns.length} /> : pageItems.length === 0 ? (
                        <EmptyRow colSpan={columns.length} message={search ? 'No members match your search.' : 'No team members yet.'} />
                    ) : pageItems.map((m, index) => (
                        <tr
                            key={m._id}
                            draggable={canReorder}
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragOver={(e) => onDragOver(e, index)}
                            onDrop={(e) => e.preventDefault()}
                            onDragEnd={onDragEnd}
                            className={`hover:bg-slate-50 ${draggingId === m._id ? 'bg-blue-50 opacity-60' : ''}`}
                        >
                            <Td className="whitespace-nowrap">
                                {canReorder ? (
                                    <div className="flex items-center gap-1">
                                        <span className="flex h-7 w-7 cursor-grab items-center justify-center text-slate-400" title="Drag to reorder">
                                            <FiMove className="h-4 w-4" />
                                        </span>
                                        <button type="button" className={orderButton} onClick={() => onMove(index, index - 1)} disabled={index === 0} title="Move up" aria-label={`Move ${m.name} up`}>
                                            <FiArrowUp className="h-4 w-4" />
                                        </button>
                                        <button type="button" className={orderButton} onClick={() => onMove(index, index + 1)} disabled={index === items.length - 1} title="Move down" aria-label={`Move ${m.name} down`}>
                                            <FiArrowDown className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : <span className="text-slate-400">{items.indexOf(m) + 1}</span>}
                            </Td>
                            <Td>
                                <div className="flex items-center gap-3">
                                    <Thumb src={m.image} alt={m.name} rounded="rounded-full" />
                                    <span className="font-medium capitalize text-slate-900">{m.name}</span>
                                </div>
                            </Td>
                            <Td className="capitalize">{m.role?.trim() || '—'}</Td>
                            <Td className="max-w-xs text-slate-500">{truncate(htmlToText(m.description), 60) || '—'}</Td>
                            <Td>
                                <div className="flex gap-1.5">
                                    {socials.map(({ key, icon: Icon }) => (
                                        m[key] ? (
                                            <a key={key} href={m[key]} target="_blank" rel="noreferrer" title={key}
                                                className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600">
                                                <Icon className="h-3.5 w-3.5" />
                                            </a>
                                        ) : (
                                            <span key={key} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-300">
                                                <Icon className="h-3.5 w-3.5" />
                                            </span>
                                        )
                                    ))}
                                </div>
                            </Td>
                            <Td className="whitespace-nowrap text-right">
                                <ActionButton to={`/dashboard/teamsformedit/${m._id}`} title="Edit" color="green" icon={FiEdit2} />
                                <ActionButton onClick={() => remove(m._id, m.name)} title="Delete" color="red" icon={FiTrash2} />
                            </Td>
                        </tr>
                    ))}
                </Table>
                {!loading && <Pagination page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />}
            </Card>
        </div>
    );
};

export default TeamPage;
