import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);

    const servicesPerPage = 5; // Number of projects per page

    // Fetch Projects
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const res = await AxiosWithAuth().get(
                    `/api/v1/services?page=${page}&limit=${servicesPerPage}`
                );
                setServices(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [page]);

    // Search functionality
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredServices(services);
        } else {
            const filtered = services.filter(
                (service) =>
                    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredServices(filtered);
        }
    }, [searchTerm, services]);

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth().delete(`/api/v1/services/${id}`);
            setServices((prevServices) => prevServices.filter((service) => service._id !== id));
        } catch (error) {
            console.error("Error deleting services:", error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Sidbar />
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ marginBottom: '20px' }} className='font-semibold text-4xl text-center my-4' >Services Management</h2>

                {/* Add New Project Button and Search Input */}
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                        to="/dashboard/servicesform"
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#1565c0')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
                    >
                        ➕ Add New Services
                    </Link>

                    <input
                        type="text"
                        placeholder="Search Services"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '250px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                {/* Projects Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '10px',
                            backgroundColor: '#fff',
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Icon</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((services) => (
                                <tr key={services._id}>
                                    <td style={tdStyle}>{services.title}</td>
                                    {/* <td style={tdStyle}>{services.category}</td> */}
                                    <td style={tdStyle}>{services.description.slice(0, 50)}...</td>
                                    <td style={tdStyle}>
                                        <img src={services.image} alt={services.title} style={{ width: '50px', height: 'auto', borderRadius: '4px' }} />
                                    </td>
                                    <td style={tdStyle}>
                                        <img src={services.icon} alt={services.title} style={{ width: '30px', height: 'auto', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/servicesformedit/${services._id}`}
                                            style={actionButtonStyle('#4caf50')}
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(services._id)}
                                            style={actionButtonStyle('#f44336')}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={page === 1}
                        style={{
                            ...paginationButtonStyle,
                            backgroundColor: page === 1 ? '#ccc' : '#1976d2',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Prev
                    </button>
                    <span style={{ padding: '0 15px', fontSize: '16px' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={page === totalPages}
                        style={{
                            ...paginationButtonStyle,
                            backgroundColor: page === totalPages ? '#ccc' : '#1976d2',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

// Basic styles
const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    fontWeight: '600',
    fontSize: '14px',
};

const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
};

const actionButtonStyle = (bgColor) => ({
    marginRight: '8px',
    padding: '6px 12px',
    backgroundColor: bgColor,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s',
});

const paginationButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 5px',
    transition: 'background-color 0.3s',
};

export default ServicesPage;