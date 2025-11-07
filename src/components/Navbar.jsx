import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBars,
    FaSearch,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaDonate,
    FaTimes,
    FaAngleDown,
    FaShoppingCart,
} from 'react-icons/fa';
import { BiLogIn } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';
import { InvestmentContext } from '../contexts/InvestmentContext';
import { IoLogOut } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import { CgProfile } from 'react-icons/cg';

const Navbar = () => {
    const { cartItems } = useContext(InvestmentContext);
    const [isSticky, setIsSticky] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 45);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString && userString !== 'undefined') {
            try {
                const userData = JSON.parse(userString);
                if (userData?.image) {
                    setUserImage(userData.image);
                }
            } catch (err) {
                console.error('Failed to parse user data from localStorage', err);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout Successful!');
        window.location.reload();
        setIsLoggedIn(false);
    };

    const handleNavItemClick = () => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location.pathname]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const profileImageStyle = 'w-6 h-6 rounded-full object-cover';

    const mobileMenuVariants = {
        hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
        visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeOut' } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    };

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/aboutas', label: 'About' },
        { path: '/services', label: 'Services' },
        { path: '/project', label: 'Projects' },
        { path: '/contact', label: 'Contact' },
    ];

    const dropdownItems = [
        { path: '/blog', label: 'Our Blog' },
        { path: '/team', label: 'Our Team' },
        { path: '/testimonial', label: 'Testimonial' },
        { path: '/oursfaqs', label: 'FAQs' },
        { path: '/404', label: '404 Page' },
    ];

    return (
        <>
            {/* Topbar */}
            <div className="bg-gray-900 text-white py-2 px-4 sm:px-10">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex flex-wrap justify-center sm:justify-start space-x-4 text-sm mb-2 sm:mb-0">
                        <a href="https://maps.app.goo.gl/tmbskf3mfNVxW1K8A" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
                            <FaMapMarkerAlt /> Find A Location
                        </a>
                        <a href="tel:+9779764399565" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
                            <FaPhoneAlt /> +977-9764399565
                        </a>
                        <a href="https://mail.google.com/mail/?view=cm&to=info.softechfoundation@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200">
                            <FaEnvelope /> info.softechfoundation@gmail.com
                        </a>
                    </div>
                    <div className="flex space-x-3">
                        <Link to="#" className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200"><FaFacebookF /></Link>
                        <Link to="#" className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200"><FaTwitter /></Link>
                        <Link to="#" className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200"><FaInstagram /></Link>
                        <Link to="#" className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200"><FaLinkedinIn /></Link>
                        {isLoggedIn ? (
                            <div className="flex flex-wrap gap-1">
                                <Link to="/carts" className="relative flex items-center">
                                    <div className="relative group inline-block cursor-pointer">
                                        <button className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
                                            <FaShoppingCart className="text-xl" />
                                            {Array.isArray(cartItems) && cartItems.length > 0 && (
                                                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-2">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </button>
                                        <span className="absolute bottom-7 left-1/2 -translate-x-1/2 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Cart
                                        </span>
                                    </div>
                                </Link>
                                <Link to="/profile" className="relative flex items-center">
                                    <div className="relative group inline-block cursor-pointer">
                                        {userImage ? (
                                            <img src={userImage} alt="User Profile" className={profileImageStyle} />
                                        ) : (
                                            <button className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
                                                <CgProfile className="text-2xl" />
                                            </button>
                                        )}
                                        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Profile
                                        </span>
                                    </div>
                                </Link>
                                <div className="relative group inline-block cursor-pointer">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <IoLogOut className="text-2xl" />
                                    </button>
                                    <span className="absolute bottom-7 left-1/2 -translate-x-1/2 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Logout
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary text-white rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
                                <div className="relative group inline-block cursor-pointer">
                                    <span className="flex items-center space-x-1">
                                        <BiLogIn className="text-2xl" />
                                    </span>
                                    <span className="absolute bottom-7 left-1/2 -translate-x-1/2 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        Login / Register
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <div className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isSticky ? 'shadow-md' : ''}`}>
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="text-primary sm:text-xs md:text-2xl xl:text-3xl  font-bold flex items-center hover:text-blue-700 transition-colors duration-200">
                        <FaDonate className="mr-2" /> <span> Nexas Global Investment</span>
                    </Link>

                    <button
                        className="lg:hidden text-dark text-2xl hover:text-blue-600 transition-colors duration-200 absolute left-8/9 transform -translate-x-1/2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Main Menu - Large Devices */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative text-dark hover:text-blue-600 transition-colors duration-200 pb-1 ${location.pathname === item.path || (item.path === '/' && location.pathname === '')
                                    ? 'text-blue-600'
                                    : ''
                                    }`}
                                onClick={handleNavItemClick}
                            >
                                {item.label}
                                {(location.pathname === item.path || (item.path === '/' && location.pathname === '')) && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                                )}
                            </Link>
                        ))}
                        <div className="relative group" ref={dropdownRef}>
                            <button
                                className={`flex items-center text-dark hover:text-blue-600 transition-colors duration-200 pb-1 ${dropdownItems.some((item) => item.path === location.pathname) ? 'text-blue-600' : ''
                                    }`}
                                onClick={toggleDropdown}
                            >
                                Pages <FaAngleDown className="ml-1" />
                                {dropdownItems.some((item) => item.path === location.pathname) && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="absolute left-0 top-full bg-white shadow-md mt-2 rounded-md w-48 z-50"
                                    >
                                        {dropdownItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={handleNavItemClick}
                                                className={`block px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors duration-200 ${location.pathname === item.path ? 'bg-blue-600 text-white' : ''
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* <button onClick={() => setIsSearchOpen(true)} className="text-dark text-lg hover:text-blue-600 transition-colors duration-200">
                            <FaSearch />
                        </button> */}
                        <Link to="/project" className="bg-blue-950 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200">
                            Start Invest
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="lg:hidden bg-white shadow-md px-4 py-5 space-y-3 overflow-hidden"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block text-dark hover:text-blue-600 transition-colors duration-200 relative pb-1 ${location.pathname === item.path || (item.path === '/' && location.pathname === '')
                                    ? 'text-blue-600'
                                    : ''
                                    }`}
                                onClick={handleNavItemClick}
                            >
                                {item.label}
                                {(location.pathname === item.path || (item.path === '/' && location.pathname === '')) && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                                )}
                            </Link>
                        ))}
                        {dropdownItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block text-dark hover:text-blue-600 transition-colors duration-200 relative pb-1 ${location.pathname === item.path ? 'text-blue-600' : ''
                                    }`}
                                onClick={handleNavItemClick}
                            >
                                {item.label}
                                {location.pathname === item.path && (
                                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                                )}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsSearchOpen(true);
                                handleNavItemClick();
                            }}
                            className="text-dark flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                        >
                            <FaSearch /> Search
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
                        >
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="absolute top-3 right-3 text-dark hover:text-blue-600 transition-colors duration-200"
                            >
                                <FaTimes />
                            </button>
                            <h4 className="mb-4 text-lg font-semibold">Search by keyword</h4>
                            <div className="flex">
                                <input
                                    type="search"
                                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="keywords"
                                />
                                <span className="bg-primary text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors duration-200">
                                    <FaSearch />
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Navbar;