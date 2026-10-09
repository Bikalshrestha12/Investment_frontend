import React, { useEffect, useState } from 'react'
import Services from '../components/Services'
import Testimonial from '../components/Testimonial'
import FAQ from '../components/FAQ'
import { motion } from 'framer-motion';
import axios from 'axios';

import { FaDonate } from "react-icons/fa";
import { FcDonate } from "react-icons/fc";
import { Link } from 'react-router-dom';
import AxiosWithAuth, { imageUpload } from "../contexts/AxiosWithAuth.jsx"
import Loading from '../components/Loading.jsx';
import { htmlToText } from '../components/common/RichText';



const Service = () => {

    const [serviceing, setServiceing] = useState([]);

    // useEffect(() => {
    //     const filtered = servicesitems.filter((item) => item.img);
    //     setServiceing(filtered.slice(0, 4));
    // }, []);

    const [serviceaData, setServiceaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServicesData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/services');
                const response = await AxiosWithAuth().get("/api/v1/services")

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setServiceaData(data);
                // console.log('Fetched Services data:', data);
            } catch (err) {
                if (err.response) {
                    setError(`Error: ${err.response.data.message || 'Failed to fetch project data'}`);
                } else if (err.request) {
                    setError('No response from server. Please check your backend.');
                } else {
                    setError(`Error: ${err.message}`);
                }
                console.error('Axios error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServicesData();
    }, []);

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div>
            {/* <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
                    <h4
                        className="text-white text-4xl md:text-5xl mb-4 animate-fadeInDown"
                        style={{ animationDelay: '0.1s' }}
                    >
                        Services
                    </h4>
                    <ol
                        className="flex justify-center list-none p-0 m-0 animate-fadeInDown"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <li className="text-white">
                            <a href="/" className="text-white hover:text-blue-300">Home</a>
                        </li>
                        <li className="text-white mx-2">/</li>
                        <li className="text-white">
                            <a href="#" className="text-white hover:text-blue-300">Pages</a>
                        </li>
                        <li className="text-white mx-2">/</li>
                        <li className="text-blue-400">Services</li>
                    </ol>
                </div>
            </div> */}
            {/* <Services /> */}
            <div className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl mx-auto mb-12"
                    >
                        <h4 className="text-blue-900 text-2xl text-center font-medium">Our Services</h4>
                        <h1 className="text-4xl font-bold">Offering the Best Consulting & Investa Services</h1>
                        <p className='my-8 text-gray-800'>At Nexas Global Investment, we provide a wide range of services designed to help individuals, entrepreneurs, and businesses grow their wealth and achieve financial security. Our team of experts brings deep market knowledge, innovative tools, and strategic insight to every partnership.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {serviceaData.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                                className="group bg-light rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-105 flex flex-col h-full"
                            >
                                {/* Image with Zoom and Overlay */}
                                <div className="relative overflow-hidden">
                                    <img
                                        // src={service.image}
                                        src={
                                            service?.image
                                                ? `${imageUpload}/uploads/images/${encodeURIComponent(service.image.split('/').pop())}`
                                                : assets.projectdefaul0
                                        }
                                        alt={service.title}
                                        className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-blue-600 bg-opacity-40 opacity-0 group-hover:opacity-50 transition-opacity duration-500 flex justify-center items-center">
                                        <span className="text-white text-lg font-semibold">Explore</span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 text-center flex flex-col flex-grow">
                                    <h5 className="flex items-center justify-center text-dark hover:text-gray-600 transition-colors mb-2">
                                        <img src={service.icon} onError={(e) => { e.currentTarget.style.display = 'none'; }} alt="icon" width={24} height={24} className="mr-2" />
                                        <span className="text-xl font-semibold">{service.title}</span>
                                    </h5>
                                    <p className="text-sm text-gray-700 mb-4 flex-grow">{htmlToText(service.description)}</p>

                                    <Link
                                        to={`service_detail_page/${service._id}`}
                                        className="inline-block bg-blue-400 text-white rounded-full py-2 px-4 transform transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-dark mt-auto"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* <motion.a
                        href="services"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-8 inline-block bg-primary text-gray-200 rounded-full border-x-2 py-3 px-5 bg-blue-700 hover:bg-gray-200 hover:text-blue-700 duration-500"
                    >
                        Services More
                    </motion.a> */}
                </div>
            </div>

            {/* <Testimonial />
            <FAQ /> */}
        </div>
    )
}

export default Service