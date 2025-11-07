import React, { useEffect, useState, useCallback } from 'react';
import AxiosWithAuth from '../../contexts/AxiosWithAuth';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Sidbar from '../Sidbar';
import { useNavigate } from 'react-router-dom';

const TotalUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate()

    const token = localStorage.getItem("token");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AxiosWithAuth().get("/api/v1/auth/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error("Unexpected user data format");
                    setUsers([]);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        return (
            user._id.toLowerCase().includes(search) ||
            (user.fullName && user.fullName.toLowerCase().includes(search)) ||
            (user.email && user.email.toLowerCase().includes(search)) ||
            (user.role && user.role.toLowerCase().includes(search))
        );
    });

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch {
            return 'Invalid date';
        }
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/fallback-image.jpg';
    };

    // Close modal on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setSelectedUser(null);
        }
    }, []);

    // Add keydown listener for Escape
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Close modal on click outside
    const handleOverlayClick = (e) => {
        if (e.target.id === 'overlay') {
            setSelectedUser(null);
        }
    };



    return (
        <div className="container mx-auto p-5">
            <Sidbar />
            <h2 className="text-2xl font-bold mb-4 text-center">All Users ({users.length})</h2>
            <div className="mb-4 flex justify-end me-10">
                <input
                    type="text"
                    placeholder="Search by ID, Name, Email, or Role"
                    className="border border-gray-300 rounded px-4 py-2 max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search users"
                />
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user._id || user.email || index}
                                    className="border-b border-gray-200"
                                    whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900">{user._id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedUser && (
                <div
                    id="overlay"
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="user-details-title"
                >
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 sm:p-8">
                            <h3 id="user-details-title" className="text-2xl font-bold text-gray-900 mb-6">User Details</h3>

                            <div className="space-y-4">
                                <DetailRow label="ID" value={selectedUser._id} />
                                <DetailRow label="Name" value={selectedUser.fullName || 'N/A'} />
                                <DetailRow label="Email" value={selectedUser.email || 'N/A'} />
                                <DetailRow label="Role" value={selectedUser.role || 'N/A'} />
                                <DetailRow label="Phone" value={selectedUser.phone || 'N/A'} />
                                <DetailRow label="Address" value={selectedUser.address || 'N/A'} />
                                <DetailRow label="Created" value={formatDate(selectedUser.createdAt)} />
                                {selectedUser.image && (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-700 w-24">Image:</span>
                                        <img
                                            src={selectedUser.image}
                                            alt="User profile"
                                            className="w-16 h-16 object-cover rounded-full border border-gray-200"
                                            onError={handleImageError}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    aria-label="Close user details modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable row component for modal details
const DetailRow = ({ label, value }) => (
    <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-700 w-24">{label}:</span>
        <span className="text-gray-900">{value}</span>
    </div>
);

export default TotalUser;
