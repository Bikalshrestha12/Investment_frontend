import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import Most_Investment_Projects from '../components/Most_Investment_Projects';
import { InvestmentContext } from '../contexts/InvestmentContext';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import { assets } from '../assets/public';
import Loading from '../components/Loading';
import RichText from '../components/common/RichText';

const Project_Detail_Page = () => {
    const { addToCart } = useContext(InvestmentContext);
    const [project, setProject] = useState(null);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const { id } = useParams();
    const navigate = useNavigate();

    const reviews = [
        { name: 'Alice', date: '2024-01-12', comment: 'Great experience investing!' },
        { name: 'John', date: '2024-02-02', comment: 'Smooth process, will invest again.' }
    ];

    const description = [
        'This is a high-quality investment opportunity with strong potential for returns.',
        'Designed with care and delivered with trust, this project helps users grow financially.'
    ];

    const tabContentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };


    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const res = await axios.get(`http://localhost:5000/api/v1/projects/${id}/`);
                const res = await AxiosWithAuth().get(`/api/v1/projects/${id}/`);
                const data = res.data?.data;

                if (data) {
                    setProject(data);
                    setImage(`http://localhost:5000${data.image}`);
                }
            } catch (err) {
                setError('Failed to load project data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // const addToCart = (id) => {
    //     console.log(`Added to cart: ${id}`);
    // };

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 relative text-white">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="relative z-10 text-center py-10 max-w-4xl mx-auto px-4">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Project Details
                    </motion.h1>
                    <nav className="text-sm flex justify-center gap-2">
                        <Link to="/" className="hover:text-blue-300">Home</Link>
                        <span>/</span>
                        <Link to="/project" className="hover:text-blue-300">Projects</Link>
                        <span>/</span>
                        <span className="text-blue-300">Detail</span>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-10">
                <div className='w-7xl items-center justify-center mx-auto'>
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-8 items-start"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Image */}
                        <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                            <img
                                // src={project.image}
                                src={
                                    project?.image
                                        ? `${imageUpload}/uploads/images/${encodeURIComponent(project.image.split('/').pop())}`
                                        : assets.projectdefaul
                                }
                                alt={project.title}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>

                            <div className="flex items-center gap-3 mb-2">
                                {project.icon && (
                                    <img
                                        src={project.icon}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        alt={project.category}
                                        className="w-10 h-10 object-cover rounded-md"
                                    />
                                )}
                                <span className="text-2xl text-blue-600 font-medium">{project.category}</span>
                            </div>

                            <RichText html={project.description} className="text-gray-700 leading-relaxed" />

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {/* <button
                                    onClick={() => addToCart(project._id)}
                                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
                                >
                                    Add to Cart
                                </button> */}
                                {/* <button
                                    onClick={() => navigate('/investment_start')}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                                >
                                    Invest Now
                                </button> */}
                            </div>

                            <div className="text-sm text-gray-500 mt-4 space-y-1">
                                <p>✔ 100% Trust Guarantee</p>
                                <p>✔ Easy to Invest</p>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Tabs */}
                <motion.section
                    className="bg-white shadow-md mt-12 rounded-md p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex gap-6 border-b pb-3 mb-4 text-sm font-semibold relative">
                        {['description', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-2 transition-all duration-300 ${activeTab === tab
                                    ? 'text-black'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab === 'description'
                                    ? 'Description'
                                    : `Reviews (${reviews.length})`}
                                {activeTab === tab && (
                                    <motion.div
                                        className="absolute left-0 right-0 h-[2px] bg-black bottom-0"
                                        layoutId="underline"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[100px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div
                                    key="desc"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-600 space-y-4 text-sm leading-relaxed"
                                >
                                    {description.map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-600 space-y-4 text-sm leading-relaxed"
                                >
                                    {reviews.length > 0 ? (
                                        reviews.map((review, i) => (
                                            <div
                                                key={i}
                                                className="border p-3 rounded-md bg-gray-50 shadow-sm hover:shadow transition"
                                            >
                                                <p className="font-semibold">{review.name}</p>
                                                <p className="text-xs text-gray-400">{review.date}</p>
                                                <p className="mt-1">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews yet.</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                < Most_Investment_Projects />

                {/* Go Back */}
                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 flex items-center justify-center gap-2 hover:underline"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Project_Detail_Page;
