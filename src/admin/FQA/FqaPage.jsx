import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const FqaPage = () => {
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFaq, setFilteredFaq] = useState([]);

    const faqPerPage = 5; // Number of projects per page

    // Fetch Projects
    useEffect(() => {
        const fetchFaq = async () => {
            try {
                setLoading(true);
                const res = await AxiosWithAuth().get(
                    `/api/v1/faqs?page=${page}&limit=${faqPerPage}`
                );
                setFaq(res.data.data);
                setTotalPages(res.data.totalPages); // Assuming API returns total pages info
            } catch (error) {
                console.error("Error fetching FAQS:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaq();
    }, [page]);

    // Search functionality
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredFaq(faq);
        } else {
            const filtered = faq.filter(
                (faqs) =>
                    faqs.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faqs.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFaq(filtered);
        }
    }, [searchTerm, faq]);

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth.delete(`/api/v1/faqs/${id}`);
            setFaq((prevFaq) => prevFaq.filter((Faqs) => Faqs._id !== id));
        } catch (error) {
            console.error("Error deleting FAQS:", error);
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
                <h2 style={{ marginBottom: '20px' }} className='font-semibold text-4xl text-center my-4' >FAQS Management</h2>

                {/* Add New Project Button and Search Input */}
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                        to="/dashboard/faqsform"
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
                        ➕ Add New FAQS
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
                                <th style={thStyle}>Question</th>
                                <th style={thStyle}>Answer</th>
                                {/* <th style={thStyle}>Image</th>
                            <th style={thStyle}>Icon</th> */}
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaq.map((faq) => (
                                <tr key={faq._id}>
                                    <td style={tdStyle}>{faq.question}</td>
                                    {/* <td style={tdStyle}>{services.category}</td> */}
                                    <td style={tdStyle}>{faq.answer.slice(0, 50)}...</td>
                                    {/* <td style={tdStyle}>
                                    <img src={services.image} alt={services.title} style={{ width: '50px', height: 'auto', borderRadius: '4px' }} />
                                </td>
                                <td style={tdStyle}>
                                    <img src={services.icon} alt={services.title} style={{ width: '30px', height: 'auto', borderRadius: '4px' }} />
                                </td> */}
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <Link
                                            to={`/dashboard/faqsformedit/${faq._id}`}
                                            style={actionButtonStyle('#4caf50')}
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(faq._id)}
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

export default FqaPage