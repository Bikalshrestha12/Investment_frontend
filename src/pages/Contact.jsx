import React, { useEffect, useState } from 'react'
import { FaFacebook, FaLinkedin, FaPhoneAlt, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdOutlineEmail } from 'react-icons/md'
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import Loading from '../components/Loading';

const Contact = ({ icon, title, details, index }) => {
    const [loading, setLoading] = useState()

    const handleSubmit = (e) => {
        e.preventDefault();
        const comment = e.target.elements.name.value;
        alert(`Your message was sent successfully: ${comment}`);
        e.target.elements.comment.value = '';
    };

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2 * index
            }
        },
        hover: {
            scale: 1.03,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    // Animation variants for social icons
    const socialIconVariants = {
        hover: {
            scale: 1.2,
            rotate: 360,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;
    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500 opacity-50 transition-opacity duration-500"></div>
                <div className="container mx-auto text-center py-12 md:py-16 max-w-4xl relative z-10">
                    <motion.h4
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                    >
                        Contact Us
                    </motion.h4>
                    <motion.ol
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-wrap justify-center items-center list-none p-0 m-0 text-sm sm:text-base"
                    >
                        <li className="text-white hover:text-blue-300 transition-colors duration-300">
                            <a href="/">Home</a>
                        </li>
                        <li className="text-white mx-2">/</li>
                        <li className="text-white hover:text-blue-300 transition-colors duration-300">
                            <a href="#">Pages</a>
                        </li>
                        <li className="text-white mx-2">/</li>
                        <li className="text-blue-400">Contact Us</li>
                    </motion.ol>
                </div>
            </div>

            {/* Get in Touch Section */}
            <div className="text-center p-4 sm:p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-neutral-900 text-2xl sm:text-3xl md:text-4xl font-bold"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="text-neutral-700 mt-3 text-sm sm:text-base md:text-lg"
                    >
                        We're here to help! At Nexas Global Investment, we pride ourselves on exceptional customer service and expertise.
                    </motion.p>
                    <ul className="flex flex-wrap gap-4 justify-center mt-4">
                        {[
                            { icon: FaFacebook, href: "#" },
                            { icon: FaTwitter, href: "#" },
                            { icon: FaYoutube, href: "#" },
                            { icon: FaLinkedin, href: "#" }
                        ].map((social, idx) => (
                            <motion.li
                                key={idx}
                                variants={socialIconVariants}
                                whileHover="hover"
                                className="text-white bg-blue-700 p-2 rounded-full cursor-pointer"
                            >
                                <a href={social.href} target="_blank" rel="noopener noreferrer">
                                    <social.icon size={24} />
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8">
                {[
                    {
                        icon: FaLocationDot,
                        title: "Our Location",
                        content: (
                            <a href="https://maps.app.goo.gl/tmbskf3mfNVxW1K8A" target="_blank" rel="noopener noreferrer">
                                M8WP+4JJ, Sahabhagita Marga, Mid Baneshwor, Kathmandu, Nepal 44600
                            </a>
                        ),
                        delay: 0.1
                    },
                    {
                        icon: FaPhoneAlt,
                        title: "Call Us On",
                        content: (
                            <>
                                <a href="https://wa.me/9779764399565" target="_blank" rel="noopener noreferrer">+977-9764399565</a>
                                <br />
                                <a href="tel:+97798934958239">+977-98934958239</a>
                            </>
                        ),
                        delay: 0.2
                    },
                    {
                        icon: MdOutlineEmail,
                        title: "Email Us",
                        content: (
                            <>
                                <a href="https://mail.google.com/mail/?view=cm&to=info.softechfoundation@gmail.com" target="_blank" rel="noopener noreferrer">
                                    info.softechfoundation@gmail.com
                                </a>
                                <br />
                                <a href="https://mail.google.com/mail/?view=cm&to=hr.info.softechfoundation@gmail.com&su=problem&body=What is your problem?" target="_blank" rel="noopener noreferrer">
                                    hr.info.softechfoundation@gmail.com
                                </a>
                            </>
                        ),
                        delay: 0.3
                    }
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ duration: 0.6, delay: card.delay }}
                        className="m-3 w-full sm:w-[45%] md:w-[30%] min-h-[200px]"
                    >
                        <div className="bg-neutral-100 p-6 rounded-xl shadow-md flex flex-col justify-between min-h-full transition-all duration-300">
                            <card.icon size={40} className="bg-blue-600 text-white rounded-full p-2 mb-4" />
                            <h3 className="text-neutral-900 text-xl sm:text-2xl font-bold mb-2">{card.title}</h3>
                            <p className="text-neutral-700 text-sm sm:text-base">{card.content}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 bg-gray-100">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                >
                    Send us a Message
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg"
                >
                    We would love to hear from you!
                </motion.p>
                <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-md">
                    {[
                        { label: "Your Name", name: "name", type: "text", placeholder: "Your Name" },
                        { label: "Your Email", name: "email", type: "email", placeholder: "Your Email" },
                        { label: "Subject", name: "subject", type: "text", placeholder: "Subject" }
                    ].map((field, idx) => (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                            className="mb-4"
                        >
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.name}>
                                {field.label}
                            </label>
                            <input
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                name={field.name}
                                type={field.type}
                                id={field.name}
                                placeholder={field.placeholder}
                            />
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-6"
                    >
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            Your Message
                        </label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            id="message"
                            rows="4"
                            placeholder="Your Message"
                        ></textarea>
                    </motion.div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="w-full font-semibold bg-blue-700 text-gray-200 rounded-full py-3 px-5 flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
                    >
                        <FiSend className="mr-2" /> Send
                    </motion.button>
                </form>
            </div>
        </div>
    )
}

export default Contact