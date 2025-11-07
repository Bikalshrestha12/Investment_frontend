import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagramSquare, FaLinkedin, FaShareAlt, FaTwitter } from "react-icons/fa";
import AxiosWithAuth, { imageUpload } from "../contexts/AxiosWithAuth";
import Loading from "../components/Loading";

const Tems = () => {
    const [membersData, setMembersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                // const response = await axios.get("http://localhost:5000/api/v1/team");
                const response = await AxiosWithAuth().get("/api/v1/team");

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setMembersData(data);
            } catch (err) {
                console.error("Axios error:", err);
                setError("Failed to fetch team members.");
            } finally {
                setLoading(false);
            }
        };

        fetchMemberData();
    }, []);

    return (
        <div>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
                    <h4 className="text-white text-4xl md:text-5xl mb-4">Our Team</h4>
                    <ol className="flex justify-center text-white gap-2">
                        <li><a href="/" className="hover:text-blue-300">Home</a></li>
                        <li>/</li>
                        <li><a href="#" className="hover:text-blue-300">Pages</a></li>
                        <li>/</li>
                        <li className="text-blue-300">Team</li>
                    </ol>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h4 className="text-blue-900 text-2xl font-bold">Our Team</h4>
                        <h1 className="text-4xl font-bold">Our Investa Company Dedicated Team Members</h1>
                    </motion.div>

                    {loading ? (
                        <div className="text-center"> < Loading /> </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {membersData.map((member, index) => (
                                <motion.div
                                    key={member._id || index}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    className="bg-white shadow-md rounded-lg overflow-hidden group relative"
                                >
                                    {/* Image Section */}
                                    <div className="relative">
                                        <img
                                            // src={member.image}
                                            src={
                                                member?.image
                                                    ? `${imageUpload}/uploads/images/${encodeURIComponent(member.image.split('/').pop())}`
                                                    : assets.projectdefaul0
                                            }
                                            alt={member.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Share Button */}
                                        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 group-hover:space-y-2">
                                            <div className="bg-blue-600 text-white rounded-full p-2">
                                                <FaShareAlt />
                                            </div>

                                            <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {member.facebook && (
                                                    <a
                                                        href={member.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                                                    >
                                                        <FaFacebook />
                                                    </a>
                                                )}
                                                {member.twitter && (
                                                    <a
                                                        href={member.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full"
                                                    >
                                                        <FaTwitter />
                                                    </a>
                                                )}
                                                {member.instagram && (
                                                    <a
                                                        href={member.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full"
                                                    >
                                                        <FaInstagramSquare />
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a
                                                        href={member.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-full"
                                                    >
                                                        <FaLinkedin />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="bg-blue-950 text-white text-center p-4">
                                        <h4 className="text-lg font-semibold">{member.name}</h4>
                                        <p className="text-sm opacity-80">{member.role}</p>
                                        <p className="text-xs mt-2 opacity-60">{member.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tems;
