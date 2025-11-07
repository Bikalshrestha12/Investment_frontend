import React, { useContext, useEffect, useState } from 'react'
import { InvestmentContext } from '../contexts/InvestmentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartPage = () => {
    const { cartItems, handleConfirmUpdate, removeFromCart } = useContext(InvestmentContext);
    const [fullName, setFullName] = useState(null);
    const [editQuantities, setEditQuantities] = useState({});
    const [editingProjectId, setEditingProjectId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString && userString !== "undefined") {
            try {
                const userData = JSON.parse(userString);
                if (userData?.fullName) {
                    setFullName(userData.fullName);
                }
            } catch (err) {
                console.error("Failed to parse user data from localStorage", err);
            }
        }
    }, []);

    const groupedItems = cartItems.reduce((acc, item) => {
        const id = item.project?._id;
        if (!id) return acc;
        if (!acc[id]) {
            acc[id] = {
                ...item,
                quantity: 1,
                cartIds: [item._id],
            };
        } else {
            acc[id].quantity += 1;
            acc[id].cartIds.push(item._id);
        }
        return acc;
    }, {});
    const uniqueItems = Object.values(groupedItems);

    const startEditing = (projectId, currentQty) => {
        setEditingProjectId(projectId);
        setEditQuantities({ ...editQuantities, [projectId]: currentQty });
    };

    const cancelEditing = () => {
        setEditingProjectId(null);
    };

    const saveQuantity = (projectId, cartIds) => {
        const newQty = parseInt(editQuantities[projectId]);
        handleConfirmUpdate(projectId, cartIds, newQty);
        setEditingProjectId(null);
    };


    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        hover: {
            scale: 1.02,
            backgroundColor: '#f9fafb',
            transition: { duration: 0.2 }
        }
    };

    // Animation variants for buttons
    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95
        }
    };


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800"
            >
                {fullName ? `${fullName}, your ` : 'Your '}Cart
            </motion.h2>

            {uniqueItems.length === 0 ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-gray-600 text-lg"
                >
                    Your cart is empty.
                </motion.p>
            ) : (
                <div className="overflow-x-auto">
                    <motion.table
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="min-w-full border text-left bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 sm:px-6 border-b text-sm sm:text-base font-semibold text-gray-700">Title</th>
                                <th className="py-3 px-4 sm:px-6 border-b text-sm sm:text-base font-semibold text-gray-700">Category</th>
                                <th className="py-3 px-4 sm:px-6 border-b text-sm sm:text-base font-semibold text-gray-700">Quantity</th>
                                <th className="py-3 px-4 sm:px-6 border-b text-sm sm:text-base font-semibold text-gray-700">Image</th>
                                <th className="py-3 px-4 sm:px-6 border-b text-sm sm:text-base font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueItems.map((item, index) => {
                                const isEditing = editingProjectId === item.project?._id;
                                const qty = editQuantities[item.project?._id] ?? item.quantity;

                                return (
                                    <motion.tr
                                        key={item.project?._id || index}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="border-b"
                                    >
                                        <td className="py-3 px-4 sm:px-6 text-sm sm:text-base text-gray-800">
                                            {item.project?.title || 'No Title'}
                                        </td>
                                        <td className="py-3 px-4 sm:px-6 text-sm sm:text-base text-gray-800">
                                            {item.project?.category || 'No Category'}
                                        </td>
                                        <td className="py-3 px-4 sm:px-6 text-sm sm:text-base">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-20 border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={qty}
                                                    onChange={(e) =>
                                                        setEditQuantities((prev) => ({
                                                            ...prev,
                                                            [item.project._id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                item.quantity
                                            )}
                                        </td>
                                        <td className="py-3 px-4 sm:px-6">
                                            {item.project?.image ? (
                                                <motion.img
                                                    src={item.project.image}
                                                    alt={item.project.title}
                                                    className="w-20 h-12 object-cover rounded-md"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            ) : (
                                                'No Image'
                                            )}
                                        </td>
                                        <td className="py-3 px-4 sm:px-6 space-x-2">
                                            {isEditing ? (
                                                <>
                                                    <motion.button
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        onClick={() => saveQuantity(item.project._id, item.cartIds)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors duration-200"
                                                    >
                                                        Save
                                                    </motion.button>
                                                    <motion.button
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        onClick={cancelEditing}
                                                        className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </>
                                            ) : (
                                                <>
                                                    <motion.button
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        onClick={() => startEditing(item.project._id, item.quantity)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                                                    >
                                                        Update
                                                    </motion.button>
                                                    <motion.button
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        onClick={() => removeFromCart(item.cartIds)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </motion.button>
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </motion.table>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex justify-end mt-8 sm:mt-12 lg:mt-20"
            >
                <div className="w-full sm:w-[450px] text-end">
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/investment_start')}
                        className="bg-black text-white text-sm px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-900 transition-colors duration-200"
                    >
                        PROCEED TO CHECKOUT
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default CartPage