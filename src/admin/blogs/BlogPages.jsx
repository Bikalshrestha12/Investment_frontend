import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidbar from '../Sidbar';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';

const BlogPages = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await AxiosWithAuth().get("/api/v1/blogs");
                setBlogs(res.data.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            await AxiosWithAuth().delete(`/api/v1/blogs/${id}`);
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Sidbar />
            <div style={{ padding: "20px", width: "100%" }}>
                <h2 className='font-semibold text-4xl text-center my-4'>Blog Management</h2>

                <Link
                    to="/dashboard/blogform"
                    style={{
                        display: "inline-block",
                        marginBottom: "20px",
                        padding: "10px 15px",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "4px",
                    }}
                >
                    ➕ Add New Blog
                </Link>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Author</th>
                                <th style={thStyle}>Image</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td style={tdStyle}>{blog.title}</td>
                                    <td style={tdStyle}>{blog.category}</td>
                                    <td style={tdStyle}>{blog.author}</td>

                                    {/* ✅ Show blog image */}
                                    <td style={tdStyle}>
                                        {blog.image ? (
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                                            />
                                        ) : (
                                            <span style={{ color: "gray" }}>No image</span>
                                        )}
                                    </td>

                                    <td style={tdStyle}>
                                        {new Date(blog.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: "right" }}>
                                        <Link
                                            to={`/dashboard/blogformedit/${blog._id}`}
                                            style={actionButtonStyle("#4caf50")}
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            style={actionButtonStyle("#f44336")}
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
            </div>
        </div>
    );
};

// Basic styles
const thStyle = {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ccc",
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
};

const actionButtonStyle = (bgColor) => ({
    marginRight: "8px",
    padding: "5px 10px",
    backgroundColor: bgColor,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
});

export default BlogPages;
