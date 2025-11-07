import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FAQ from '../components/FAQ';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from '../components/Loading';

const Project = () => {
    const [projectData, setProjectData] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Smooth scroll motion effect
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/projects');
                const response = await AxiosWithAuth().get('/api/v1/projects');
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];
                setProjectData(data);
                setFilteredProjects(data); // Initialize filtered projects
                // console.log('Fetched Project data:', data);
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

        fetchProjectData();
    }, []);

    const extractFilename = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.pathname.split('/').pop();
        } catch {
            return url;
        }
    };



    // Search functionality
    useEffect(() => {
        const filtered = projectData.filter(
            (project) =>
                project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchTerm, projectData]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.div
                className="bg-gradient-to-r from-gray-800 to-gray-900 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-16 max-w-4xl relative z-10">
                    <motion.h4
                        className="text-white text-4xl md:text-5xl mb-4"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Projects
                    </motion.h4>
                    <motion.ol
                        className="flex justify-center list-none p-0 m-0 text-white"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <li>
                            <Link to="/" className="text-white hover:text-blue-300 transition-colors duration-300">
                                Home
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li>
                            <Link to="#" className="text-white hover:text-blue-300 transition-colors duration-300">
                                Pages
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li className="text-blue-400">Projects</li>
                    </motion.ol>
                </div>
            </motion.div>



            {/* Projects Section */}
            <div className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        style={{ y }}
                        className="max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-blue-900 text-2xl font-medium">Our Projects</h4>
                        <h1 className="text-4xl font-bold mt-2">Explore Our Latest Projects</h1>
                        <p className="text-gray-800 my-8 mb-10">
                            At Nexas Global Investment, our projects reflect our commitment to excellence, innovation, and sustainable growth. From global investment ventures to strategic financial partnerships, we continue to deliver high-impact results across various sectors and markets.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        className="container mx-auto px-4 py-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="max-w-md mx-auto mb-8">
                            <input
                                type="text"
                                placeholder="Search projects by title, category, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            />
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="text-center text-gray-500"> <Loading /> </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : filteredProjects.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={30}
                            loop={true}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 4 },
                            }}
                            className="project-carousel"
                        >
                            {filteredProjects.map((project, index) => (


                                <SwiperSlide key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="relative group"
                                    >
                                        {/* Image with fixed height */}
                                        <div className="relative overflow-hidden rounded-lg h-[250px] shadow-lg">
                                            <img
                                                // src={`http://localhost:5000/uploads/images/${encodeURIComponent(extractFilename(project.image))}`}
                                                // src={`https://nexas-backend.onrender.com/uploads/images/${encodeURIComponent(extractFilename(project.image))}`}
                                                src={
                                                    project?.image
                                                        ? `${imageUpload}/uploads/images/${encodeURIComponent(project.image.split('/').pop())}`
                                                        : assets.projectdefaul0
                                                }
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                                alt={project?.category || "Project Image"}
                                            />
                                            <div className="absolute inset-0 bg-blue-600 bg-opacity-25 opacity-1 group-hover:opacity-50 transition-opacity duration-500 ease-in-out"></div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="bg-white rounded-lg p-6 shadow-xl transform -translate-y-1/2 w-11/12 mx-auto min-h-[240px] flex flex-col justify-between text-center transition-all duration-300 group-hover:shadow-2xl">
                                            <div>
                                                <i className={`${project.icon} text-4xl text-blue-600 mb-3`}></i>
                                                <p className="text-gray-800 text-lg font-semibold">{project.category}</p>
                                                <Link
                                                    to={`project_detail_page/${project._id}`}
                                                    className="text-gray-900 hover:text-blue-600 transition-colors duration-300 block truncate text-xl font-bold"
                                                >
                                                    {project.title}
                                                </Link>
                                                <p className="text-gray-600 text-sm mt-2 line-clamp-3">{project.description}</p>
                                            </div>
                                            <div>
                                                <Link
                                                    to={`project_detail_page/${project._id}`}
                                                    className="bg-blue-500 text-white rounded-full py-2 px-6 hover:bg-blue-700 transition-colors duration-300 mt-4 inline-block"
                                                >
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p className="text-center text-gray-500">No projects match your search.</p>
                    )}
                </div>
            </div>

            <FAQ />
        </div>
    );
};

export default Project;