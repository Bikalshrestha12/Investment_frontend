import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from './Loading';

const Blog = () => {
    // const blogs = [
    //     {
    //         img: 'https://imgs.search.brave.com/fjvsKASacIAPI5MHdqrPaDe0Le0B_VSdzvdUayTrsZ8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdDMu/ZGVwb3NpdHBob3Rv/cy5jb20vMTI5ODU3/OTAvMTc4OTYvaS80/NTAvZGVwb3NpdHBo/b3Rvc18xNzg5NjEw/OTYtc3RvY2stcGhv/dG8tYnVzaW5lc3Mt/dGVhbS5qcGc',
    //         category: 'Investment',
    //         title: 'Revisiting Your Investment & Distribution Goals',
    //         date: 'Mar 14, 2024',
    //         author: 'Mark D. Brock',
    //     },
    //     {
    //         img: 'https://imgs.search.brave.com/ZuteynpMIgov1-dVmZboSnlXKU_pYJs3LLn3TY3lOuY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/MDUyMTIwOS9waG90/by9idXNpbmVzc21h/bi11c2luZy1hLWNv/bXB1dGVyLXRvLWNv/bmNlcHQtb2YtZnVu/ZC1maW5hbmNpYWwt/aW52ZXN0bWVudC1t/YW5hZ2VtZW50LXBv/cnRmb2xpby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9em1C/VGI1cXFvY09sM3pJ/b0YzM3NPb1NzVkVa/WmVueFVXOFpxaHNP/UVNVcz0',
    //         category: 'Business',
    //         title: 'Dimensional Fund Advisors Interview with Director',
    //         date: 'Mar 14, 2024',
    //         author: 'Mark D. Brock',
    //     },
    //     {
    //         img: 'https://imgs.search.brave.com/FJXYAXucdHcGRUsQtWRIMKGyDCI_yapwxbBgFNRO7-k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTUw/OTg2NjU2L3Bob3Rv/L2J1c2luZXNzLWZp/bmFuY2UtYWNjb3Vu/dGluZy1jb250cmFj/dC1hZHZpc29yLWlu/dmVzdG1lbnQtY29u/c3VsdGluZy1tYXJr/ZXRpbmctcGxhbi1m/b3ItdGhlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1VLXk2/Y0FEQ2J5NFF3RU5G/cHRQclZjS19NcGxl/c3FabW5EeFVNTWtK/WnZNPQ',
    //         category: 'Consulting',
    //         title: 'Interested in Giving Back this year? Here are some tips',
    //         date: 'Mar 14, 2024',
    //         author: 'Mark D. Brock',
    //     },
    // ];

    const [blogData, setBlogData] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/blogs');
                const response = await AxiosWithAuth().get('/api/v1/blogs')

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];
                // console.log("blog data", data)
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

    useEffect(() => {
        setBlogs(blogData.slice(0, 3))
    }, [blogData])

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div className="py-12">
            <div className="container mx-auto">
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
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                            className="bg-light rounded-lg p-4 shadow-lg relative overflow-hidden"
                            style={{ backgroundImage: `url(img/bg.png)` }}
                        >
                            <div className="mb-4">
                                <h4 className="text-blue-500 font-bold text-2xl mb-2">{blog.category}</h4>
                                <div className="flex justify-between">
                                    <p><span className="font-bold">On</span> <span className='text-gray-700 text-sm font-medium'>{blog.date}</span></p>
                                    <p><span className="font-bold text-gray-950">By</span> <span className='text-gray-700 text-sm font-medium'>{blog.author}</span></p>
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
                                    className="w-full transform hover:scale-110 transition-transform duration-500" alt={blog.title} />
                                <div className="absolute inset-0 bg-primary bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <a href={blog.image} className="bg-primary text-white rounded-full p-2">
                                        <i className="fas fa-plus"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="my-4">
                                <a href="#" className="text-dark hover:text-primary transition-colors text-lg font-semibold">{blog.title}</a>
                            </div>
                            <a href="#" className="bg-blue-600 text-white rounded-full py-2 px-4 hover:bg-dark transition-colors mb-12">Explore More</a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;