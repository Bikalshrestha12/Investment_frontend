import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const TeamPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const tableRef = useRef(null);
    const scrollIntervalRef = useRef(null);

    const scrollSpeed = 1;
    const scrollInterval = 20;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const res = await AxiosWithAuth().get(`/api/v1/team`);
                setTeams(res.data.data || []);
            } catch (error) {
                console.error('Error fetching Teams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredTeams(teams);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredTeams(
                teams.filter(team =>
                    team.name.toLowerCase().includes(lower) ||
                    team.role.toLowerCase().includes(lower)
                )
            );
        }
    }, [searchTerm, teams]);

    useEffect(() => {
        const scroll = () => {
            const container = tableRef.current;
            if (!container) return;

            container.scrollLeft += scrollSpeed;

            if (container.scrollLeft >= container.scrollWidth) {
                container.scrollLeft = 0;
            }
        };

        if (isAutoScroll) {
            scrollIntervalRef.current = setInterval(scroll, scrollInterval);
        }

        return () => clearInterval(scrollIntervalRef.current);
    }, [isAutoScroll, filteredTeams]);

    const toggleAutoScroll = () => setIsAutoScroll(prev => !prev);

    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth().delete(`/api/v1/team/${id}`);
            setTeams(prev => prev.filter(team => team._id !== id));
        } catch (error) {
            console.error('Error deleting Team:', error);
        }
    };

    const renderTable = () => (
        <table className="w-full text-sm" style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Role</th>
                    <th className={`${thClass} hidden md:table-cell`}>Description</th>
                    <th className={`${thClass} hidden sm:table-cell`}>Image</th>
                    <th className={`${thClass} hidden lg:table-cell`}>Facebook</th>
                    <th className={`${thClass} hidden lg:table-cell`}>Twitter</th>
                    <th className={`${thClass} hidden lg:table-cell`}>Instagram</th>
                    <th className={`${thClass} hidden lg:table-cell`}>LinkedIn</th>
                    <th className={thClass}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredTeams.length > 0 ? filteredTeams.map(team => (
                    <tr key={team._id} className="hover:bg-gray-50 transition-all duration-200">
                        <td className={tdClass}>
                            <div className="md:hidden">
                                <div className="font-semibold">{team.name}</div>
                                <div className="text-xs text-gray-500">{team.role}</div>
                                <div className="text-xs text-gray-500 mt-1">{team.description}</div>
                            </div>
                            <div className="hidden md:block">{team.name}</div>
                        </td>
                        <td className={`${tdClass} hidden md:table-cell`}>{team.role}</td>
                        <td className={`${tdClass} hidden md:table-cell`}>
                            {team.description.split(' ').slice(0, 5).join(' ')}{team.description.split(' ').length > 15 ? '...' : ''}
                        </td>
                        <td className={`${tdClass} hidden sm:table-cell`}>
                            <img
                                src={team.image}
                                alt={team.name}
                                className="w-12 h-12 object-cover rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
                            />
                        </td>
                        <td className={`${tdClass} hidden lg:table-cell`}>{team.facebook || '-'}</td>
                        <td className={`${tdClass} hidden lg:table-cell`}>{team.twitter || '-'}</td>
                        <td className={`${tdClass} hidden lg:table-cell`}>{team.instagram || '-'}</td>
                        <td className={`${tdClass} hidden lg:table-cell`}>{team.linkedin || '-'}</td>
                        <td className={`${tdClass} text-right space-x-2`}>
                            <Link
                                to={`/dashboard/teamsformedit/${team._id}`}
                                className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-all duration-200"
                            >
                                ✏️
                            </Link>
                            <button
                                onClick={() => handleDelete(team._id)}
                                className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-200"
                            >
                                🗑️
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="9" className="text-center py-6">No team members found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-pulse text-xl text-gray-700">Loading team data...</div>
            </div>
        );
    }

    return (
        <div>
            <Sidbar />
            <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Team Member Management</h2>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <Link
                        to="/dashboard/teamsform"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-sm sm:text-base"
                    >
                        ➕ Add New Team Member
                    </Link>
                    <input
                        type="text"
                        placeholder="Search Team Members"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={toggleAutoScroll}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md text-sm sm:text-base"
                    >
                        {isAutoScroll ? 'Pause Scroll' : 'Resume Scroll'}
                    </button>
                </div>

                <div
                    ref={tableRef}
                    className="overflow-x-auto max-w-full whitespace-nowrap rounded-lg bg-white shadow"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex w-max min-w-full">
                        <div className="w-full">{renderTable()}</div>
                        {/* <div className="w-full">{renderTable()}</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const thClass = "text-left py-3 px-2 sm:px-4 text-gray-600 font-semibold border-b text-xs sm:text-sm";
const tdClass = "py-3 px-2 sm:px-4 border-b text-xs sm:text-sm";

export default TeamPage;
