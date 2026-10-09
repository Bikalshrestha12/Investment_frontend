import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import FAQ from '../components/FAQ';
import Features from '../components/Features';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from '../components/Loading';
import RichText from '../components/common/RichText';

const Service_Detail_page = () => {
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const res = await axios.get(`http://localhost:5000/api/v1/services/${id}/`);
                const res = await AxiosWithAuth().get(`/api/v1/services/${id}/`);
                const data = res.data?.data;

                if (data) {
                    setService(data);
                    setImage(`https://meek-starburst-377ab6.netlify.app${data.image}`);
                }
            } catch (err) {
                setError('Failed to load Servicea data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, []);

    // const handleGoBack = () => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //     navigate(-1);
    // };

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 relative text-white">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="relative z-10 text-center py-12 max-w-4xl mx-auto px-4">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Service Details
                    </motion.h1>
                    <nav className="text-sm flex justify-center gap-2">
                        <Link to="/" className="hover:text-blue-300">Home</Link>
                        <span>/</span>
                        <Link to="/aboutas" className="hover:text-blue-300">About Us</Link>
                        <span>/</span>
                        <span className="text-blue-300">Detail</span>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-10">
                <motion.section
                    className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Image */}
                    <div className="rounded-lg overflow-hidden">
                        {service.image && (
                            <img
                                // src={service.image}
                                src={
                                    service?.image
                                        ? `${imageUpload}/uploads/images/${encodeURIComponent(service.image.split('/').pop())}`
                                        : assets.projectdefaul0
                                }
                                alt={service.category}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold text-gray-800">{service.title}</h2>

                        {service.icon && (
                            <img
                                src={service.icon}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                alt={service.category}
                                className="w-10 h-10 object-cover rounded-md"
                            />
                        )}

                        <RichText html={service.description} />

                        <div className="text-sm text-gray-600 space-y-1 mt-4">
                            <p><FaCheckCircle className="inline text-green-500 mr-2" /> 100% Trust Guarantee</p>
                            <p><FaCheckCircle className="inline text-green-500 mr-2" /> Fast & Secure Transactions</p>
                            <p><FaCheckCircle className="inline text-green-500 mr-2" /> Expert Investment Support</p>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/project')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                            >
                                Start Investing Now
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <section className="bg-white mt-10 p-6 rounded-lg shadow-sm">
                    <Features />
                </section>

                {/* FAQ Section */}
                <section className="bg-white mt-10 p-6 rounded-lg shadow-sm">
                    <div className="space-y-4 text-gray-700">
                        <FAQ />
                    </div>
                </section>

                {/* Back Button */}
                <div className="mt-12 text-center" popovertarget='_top'>
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

export default Service_Detail_page;
