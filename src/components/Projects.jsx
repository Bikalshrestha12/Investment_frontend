

import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { motion } from 'framer-motion';
import { InvestmentContext } from '../contexts/InvestmentContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from './Loading';
import { htmlToText } from './common/RichText';


const Projects = () => {


    const [projectData, setProjectData] = useState([]);
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const MotionLink = motion.create(Link);
    const maxSlidesPerView = 2;
    const canLoop = project.length >= maxSlidesPerView;


    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/projects');
                const response = await AxiosWithAuth().get("/api/v1/projects")

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setProjectData(data);
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

        fetchProjectData();
    }, []);

    useEffect(() => {
        setProject(projectData.slice(0, 4));
    }, [projectData]);

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div className="py-12">
            <div className="container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <h4 className="text-blue-900 text-2xl text-center font-medium">Our Projects</h4>
                    <h1 className="text-4xl font-bold">Explore Our Latest Projects</h1>
                </motion.div>

                {Array.isArray(projectData) && projectData.length >= 2 ? (
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 3000 }}
                        spaceBetween={25}
                        loop={canLoop}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 2 },
                        }}
                        className="project-carousel"
                    >
                        {project.map((project, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    {/* Image with fixed height */}
                                    <div className="relative overflow-hidden rounded-lg h-[250px]">
                                        <img
                                            // src={project.image}
                                            src={
                                                project?.image
                                                    ? `${imageUpload}/uploads/images/${encodeURIComponent(project.image.split('/').pop())}`
                                                    : assets.projectdefaul0
                                            }
                                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                            alt={project.category}
                                        />
                                        <div className="absolute inset-0 bg-blue-600 bg-opacity-40 opacity-0 hover:opacity-40 transition-opacity duration-500"></div>
                                    </div>

                                    {/* Info Box with fixed height to align button */}
                                    <div className="bg-gray-100 rounded-lg p-4 shadow-lg transform -translate-y-1/2 w-3/4 mx-auto h-[220px] flex flex-col justify-between text-center">
                                        <div>
                                            <i className={`${project.icon} text-4xl text-blue-600 mb-3`}></i>
                                            <p className="text-dark text-lg">{project.category}</p>
                                            <a href="#" className="text-dark hover:text-blue-600 transition-colors block truncate">{project.title}</a>
                                            <p className="text-dark text-lg">{htmlToText(project.description)}</p>
                                        </div>
                                        {/* <div>
                                            <a href="#" className="bg-blue-400 text-gray-900 rounded-full py-3 px-5 hover:bg-blue-700 transition-colors mt-4">Read More</a>
                                        </div> */}
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-500">No projects available to display.</p>
                )}

                <MotionLink
                    to="/project"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-5 inline-block bg-primary text-center text-gray-200 rounded-full border-x-2 py-3 px-5 bg-blue-700 hover:bg-gray-200 hover:text-blue-700 duration-500"
                >
                    Projects More
                </MotionLink>
            </div>

        </div>
    );
};

export default Projects;
