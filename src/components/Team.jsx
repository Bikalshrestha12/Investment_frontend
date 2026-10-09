import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagramSquare, FaShareAlt, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from './Loading';
import { assets } from '../assets/public';

const Team = () => {
    const [membersData, setMembersData] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/team');
                const response = await AxiosWithAuth().get("/api/v1/team");

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setMembersData(data);
                // console.log('Fetched testimonials data:', data);
            } catch (err) {
                if (err.response) {
                    setError(`Error: ${err.response.data.message || 'Failed to fetch member data'}`);
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

        fetchMemberData();
    }, []);

    useEffect(() => {
        setTeamMembers(membersData.slice(0, 4))
    }, [membersData])
    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div className="py-12">
            <div className="container mx-auto my-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <h4 className="text-blue-900 text-2xl font-bold">Our Team</h4>
                    <h1 className="text-4xl font-bold">Our Investa Company Dedicated Team Member</h1>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.2 }}
                            className="relative rounded-lg border border-none hover:border-none transition-all duration-500 group"
                        >
                            <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                    // src={member.image}
                                    src={
                                        member?.image
                                            ? `${imageUpload}/uploads/images/${encodeURIComponent(member.image.split('/').pop())}`
                                            : assets.projectdefaul
                                    }
                                    className="w-full transform group-hover:scale-110 transition-transform duration-500"
                                    alt={member.name}
                                />
                                {/* Semi-transparent hover overlay */}
                                <div className="absolute inset-0 bg-primary bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Share Icons */}
                                <div className="absolute top-4 right-4">
                                    {/* Main Share Button */}
                                    <a
                                        href="#"
                                        className="bg-blue-500 text-white rounded-full p-3 flex items-center justify-center w-10 h-10 group-hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        <FaShareAlt />
                                    </a>

                                    {/* Hidden Share Options */}
                                    <div className="flex flex-col space-y-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {[FaFacebook, FaTwitter, FaInstagramSquare].map((Icon, i) => (
                                            <a
                                                key={i}
                                                href="#"
                                                className="bg-blue-500 text-white rounded-full p-3 flex items-center justify-center w-10 h-10 hover:bg-blue-700 transition-colors duration-300"
                                            >
                                                <Icon />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="bg-blue-950 text-center rounded-b-lg p-4 text-white group-hover:bg-blue-900 transition-colors duration-300">
                                <h4 className="text-lg font-semibold">{member.name}</h4>
                                <p className="text-muted">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;