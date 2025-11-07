import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from './sortcomponent/Dropdown';

const Sidbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const toggleDropdown = (section) => {
        setOpenDropdown(prev => (prev === section ? null : section));
    };

    const sidebarVariants = {
        open: {
            x: '0%',
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
        closed: {
            x: '-100%',
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
    };

    const menuItemHover = {
        hover: {
            scale: 1.05,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: {
                scale: { repeat: Infinity, repeatType: 'reverse', duration: 0.5 },
                boxShadow: { repeat: Infinity, repeatType: 'reverse', duration: 0.5 },
            },
        },
    };

    const menuItems = [
        { name: 'Services', path: 'services' },
        { name: 'Blog', path: 'blogs' },
        { name: 'Project', path: 'projects' },
        { name: 'FAQ', path: 'faqs' },
        { name: 'Team', path: 'teams' },
        { name: 'Testimonial', path: 'testimonials' },
        // { name: 'TotalUser ', path: 'totalUser ' },
    ];

    return (
        <div className="relative z-50">

            <motion.button
                onClick={toggleSidebar}
                className="fixed top-14 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
                whileHover={{ scale: 1.1, backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.95 }}
            >
                {isSidebarOpen ? (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Menu
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className="fixed top-14 left-0 h-[90vh] w-64 bg-gray-800 text-white shadow-lg overflow-y-auto z-40"
                initial="closed"
                animate={isSidebarOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
            >
                <div className="px-6 py-8">
                    <Link to="/dashboard">
                        <h2 className="text-2xl font-bold mb-8">Investment Dashboard</h2>
                    </Link>

                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <motion.button
                                    onClick={() => toggleDropdown(item.name)}
                                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-700 flex justify-between items-center"
                                    variants={menuItemHover}
                                    whileHover="hover"
                                >
                                    {item.name}
                                    <motion.svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </motion.button>

                                <Dropdown isOpen={openDropdown === item.name}>
                                    <li className="py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out">
                                        <NavLink to={`/dashboard/${item.path}`} className="block">View</NavLink>
                                    </li>
                                    <li className="py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out">
                                        <NavLink to={`/dashboard/${item.path}form`} className="block">Add</NavLink>
                                    </li>
                                </Dropdown>
                            </li>
                        ))}
                        <li className="py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out">
                            <NavLink to="/dashboard/totalUser" className="block">Total User</NavLink>
                        </li>
                    </ul>
                </div>
            </motion.div>
            {/* /dashboard/totalUser */}
        </div>
    );
};

export default Sidbar;
