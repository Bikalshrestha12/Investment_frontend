import React from 'react'
import Blog from '../components/Blog'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';

const Blogs = () => {

    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/blogs');
                const response = await AxiosWithAuth().get("/api/v1/blogs")

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setBlogData(data);
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

        fetchBlogData();
    }, []);

    return (
        <div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
                    <h4
                        className="text-white text-4xl md:text-5xl mb-4 animate-fadeInDown"
                        style={{ animationDelay: '0.1s' }}
                    >
                        Our Blogs
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
                        <li className="text-blue-400">blog</li>
                    </ol>
                </div>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h4 className="text-blue-900 text-2xl text-center font-medium">Our Blogs</h4>
                        <h1 className="text-4xl font-bold">Latest Articles & News from the Blogs</h1>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-12">
                        {blogData.map((blog, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                                className="bg-light rounded-lg p-4 shadow-lg relative overflow-hidden"
                                style={{ backgroundImage: `url(img/bg.png)` }}
                            >
                                <div className="mb-4">
                                    <h4 className="text-blue-700 font-bold text-2xl mb-2">{blog.category}</h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-700 text-sm font-medium">
                                            <span className="font-bold">On</span> {blog.date}
                                        </p>
                                        <p className="text-gray-700 text-sm font-medium">
                                            <span className="font-bold text-gray-950">By</span> {blog.author}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-lg">
                                    <img
                                        // src={blog.image}
                                        src={
                                            blog?.image
                                                ? `${imageUpload}/uploads/images/${encodeURIComponent(blog.image.split('/').pop())}`
                                                : assets.projectdefaul0
                                        }
                                        className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                                        alt={blog.title}
                                    />
                                    <div className="absolute inset-0 bg-primary bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <a href={blog.image} className="bg-primary text-white rounded-full p-2">
                                            <i className="fas fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="my-4">
                                    <p className="text-dark hover:text-primary transition-colors text-md font-semibold line-clamp-3">{blog.description}</p>
                                </div>
                                <a
                                    href="#"
                                    className="inline-block bg-blue-600 text-white rounded-full py-2 px-4 hover:bg-dark transition-colors"
                                >
                                    Explore More
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Blogs