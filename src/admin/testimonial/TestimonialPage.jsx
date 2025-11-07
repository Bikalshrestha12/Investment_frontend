import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const TestimonialPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTestimonials, setFilteredTestimonials] = useState([]);

    const testimonialsPerPage = 5;

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const res = await AxiosWithAuth().get(
                    `/api/v1/testimonials?page=${page}&limit=${testimonialsPerPage}`
                );
                setTestimonials(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, [page]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredTestimonials(testimonials);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = testimonials.filter(
                t =>
                    t.name.toLowerCase().includes(term) ||
                    t.profession.toLowerCase().includes(term)
            );
            setFilteredTestimonials(filtered);
        }
    }, [searchTerm, testimonials]);

    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth().delete(`/v1/testimonials/${id}`);
            setTestimonials(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error deleting testimonial:", error);
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
                <h2 className="font-semibold text-4xl text-center my-4">Testimonials Management</h2>

                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                        to="/dashboard/testimonialsform"
                        style={actionButtonStyle('#1976d2')}
                    >
                        ➕ Add New Testimonial
                    </Link>

                    <input
                        type="text"
                        placeholder="Search Testimonials"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '250px',
                            fontSize: '14px',
                        }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Profession</th>
                                <th style={thStyle}>Text</th>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Created At</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.map(testimonial => (
                                <tr key={testimonial._id}>
                                    <td style={tdStyle}>{testimonial.name}</td>
                                    <td style={tdStyle}>{testimonial.profession}</td>
                                    <td style={tdStyle}>{testimonial.text.slice(0, 50)}...</td>
                                    <td style={tdStyle}>
                                        <img src={testimonial.image} alt={testimonial.name} style={{ width: '50px', borderRadius: '4px' }} />
                                    </td>
                                    <td style={tdStyle}>{new Date(testimonial.createdAt).toLocaleDateString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <Link to={`/dashboard/testimonialsformedit/${testimonial._id}`} style={actionButtonStyle('#4caf50')} title="Edit">
                                            ✏️
                                        </Link>
                                        <button onClick={() => handleDelete(testimonial._id)} style={actionButtonStyle('#f44336')} title="Delete">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
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
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
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
};

export default TestimonialPage;
