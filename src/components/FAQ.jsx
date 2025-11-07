import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AxiosWithAuth from '../contexts/AxiosWithAuth';
import Loading from './Loading';
import { assets } from '../assets/public';
import { Link } from 'react-router-dom';

const FAQ = () => {
    // const faqs = [
    //     {
    //         question: 'What Does a Financial Advisor Do?',
    //         answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nemo impedit, sapiente quis illo quia nulla atque maxime fuga minima ipsa quae cum consequatur, sit, delectus exercitationem odit officiis maiores!',
    //     },
    //     {
    //         question: 'What industries do you specialize in?',
    //         answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nemo impedit, sapiente quis illo quia nulla atque maxime fuga minima ipsa quae cum consequatur, sit, delectus exercitationem odit officiis maiores!',
    //     },
    //     {
    //         question: 'Can you guarantee for growth?',
    //         answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nemo impedit, sapiente quis illo quia nulla atque maxime fuga minima ipsa quae cum consequatur, sit, delectus exercitationem odit officiis maiores!',
    //     },
    //     {
    //         question: 'What makes your business plans so special?',
    //         answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nemo impedit, sapiente quis illo quia nulla atque maxime fuga minima ipsa quae cum consequatur, sit, delectus exercitationem odit officiis maiores!',
    //     },
    // ];


    const [activeIndex, setActiveIndex] = useState(0);

    const [faqsData, setFaqsData] = useState([]);
    const [fqas, setFQAS] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFaqsData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/faqs');
                const response = await AxiosWithAuth().get("/api/v1/faqs")

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setFQAS(data);
                // console.log('Fetched Faqs data:', data);
            } catch (err) {
                if (err.response) {
                    setError(`Error: ${err.response.data.message || 'Failed to fetch Faqs data'}`);
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

        fetchFaqsData();
    }, []);

    useEffect(() => {
        setFaqsData(fqas.slice(1, 8));
    }, [fqas]);


    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div className="py-12 relative" style={{ backgroundImage: `url(img/bg.png)` }}>
            <div className="container mx-auto ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="mb-12">
                            <h4 className="text-blue-950 text-center text-2xl font-medium">FAQs</h4>
                            <h1 className="text-4xl font-bold">Get the Answers to Common Questions</h1>
                        </div>
                        <div className="bg-light rounded-lg p-4 max-h-[250px] overflow-y-auto overflow-visible">
                            {faqsData.map((faq, index) => (
                                <div key={index} className="mb-4">
                                    <h2>
                                        <button
                                            className="w-full text-left text-dark text-lg font-bold py-2 px-4 rounded-t-lg"
                                            onClick={() => setActiveIndex(index === activeIndex ? -1 : index)}
                                        >
                                            {faq.question}
                                        </button>
                                    </h2>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="p-4"
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative mt-9"
                    >
                        <img
                            src={assets.faqs}
                            className="w-full rounded-2xl object-cover"
                            alt="FAQ"
                        />
                        <Link
                            to="/oursfaqs"
                            className="absolute bottom-5 right-5 bg-primary text-white rounded-full pb-3 pt-1 px-5"
                        >
                            Read more Q & A <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;