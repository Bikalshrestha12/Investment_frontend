


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../hooks/useSeo';
import { FaAngleRight, FaArrowRight, FaArrowUp, FaEnvelope, FaFacebook, FaInstagramSquare, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from 'react-icons/fa';

const Footer = () => {

    const [isVisible, setIsVisible] = useState(false);

    // Contact details and social links can be changed in Dashboard > Site Settings;
    // until they are, the original values are shown.
    const settings = useSiteSettings();
    const email = settings.contactEmail || 'info.softechfundation@gmail.com';
    const phone = settings.contactPhone || '+977-9764399565';
    const address = settings.address || 'M8WP+4JJ, Sahabhagita Marga, काठमाडौँ 44600';

    const exploreLinks = [
        { label: 'Home', to: '/' },
        { label: 'Services', to: '/services' },
        { label: 'About Us', to: '/aboutas' },
        { label: 'Latest Projects', to: '/project' },
        { label: 'Testimonial', to: '/testimonial' },
        { label: 'Our Team', to: '/team' },
        { label: 'Gallery', to: '/gallery' },
        { label: 'Notices', to: '/notices' },
        { label: 'News', to: '/news' },
        { label: 'Contact Us', to: '/contact' },
    ];

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight / 3;
        if (scrollPosition > viewportHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="bg-blue-950 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col"
                        >
                            <h4 className="text-white mb-4">Newsletter</h4>
                            <p className="text-gray-400 mb-3">Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
                            <div className="relative bg-stone-100 rounded-full hover:bg-blue-200 hover:text-neutral-700 hover:scale-105 transition-all duration-200">
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-full border-none"
                                    placeholder="Enter your email"
                                />
                                <button className="absolute bg-blue-400 cursor-pointer top-1 right-1 bg-primary text-white rounded-full py-2 px-4 hover:scale-122 transition-all duration-400">
                                    SignUp
                                </button>
                            </div>
                        </motion.div>
                        <div className="flex flex-col">
                            <h4 className="text-white mb-4">Explore</h4>
                            {exploreLinks.map((item) => (
                                <Link key={item.to} to={item.to} className="text-gray-400 flex items-center hover:text-white transition-colors mb-2">
                                    <FaAngleRight className='mx-3' /> {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-white mb-4">Contact Info</h4>
                            <a href="https://maps.app.goo.gl/tmbskf3mfNVxW1K8A" className="text-gray-400 flex hover:text-primary transition-colors mb-2">
                                <FaMapMarkerAlt className='mx-3 mt-1 shrink-0' /> {address}
                            </a>
                            <a href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 flex hover:text-primary transition-colors mb-2">

                                <FaEnvelope className='mx-3 mt-1 shrink-0' /> <span className="break-all">{email}</span>
                            </a>
                            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="text-gray-400 flex hover:text-primary transition-colors mb-2">
                                <FaPhoneAlt className='mx-3 mt-1 shrink-0' /> {phone}
                            </a>
                            <div className="flex space-x-2 mt-3">
                                {[
                                    { label: 'Facebook', href: settings.facebook, icon: FaFacebook },
                                    { label: 'Twitter', href: settings.twitter, icon: FaTwitter },
                                    { label: 'Instagram', href: settings.instagram, icon: FaInstagramSquare },
                                    { label: 'LinkedIn', href: settings.linkedin, icon: FaLinkedin },
                                ].map(({ label, href, icon: Icon }) => (
                                    <a
                                        key={label}
                                        href={href || '#'}
                                        aria-label={label}
                                        {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        className="bg-stone-100 text-dark rounded-full p-2 hover:rotate-360 transition-all duration-500 ease-in-out"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-white mb-4">Popular Post</h4>
                            <div className="mb-3">
                                <p className="text-neutral-300 mb-2">Investment</p>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Revisiting Your Investment & Distribution Goals</a>
                            </div>
                            <div className="mb-3">
                                <p className="text-neutral-300 mb-2">Business</p>
                                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Dimensional Fund Advisors Interview with Director</a>
                            </div>
                            <a href="#" className="bg-stone-100 text-dark rounded-full py-2 px-4 inline-flex items-center  hover:scale-105 transition-all duration-300">
                                View All Post <FaArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-950 py-4 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <span className="text-gray-400">
                            <a href="#" className="text-neutral-200 border-b">Nexas Global Investment</a>, All right reserved.
                        </span>
                        <span className="text-gray-400">
                            Designed By <a href="https://htmlcodex.com" target="_blank" className="text-primary border-b">Bikal Shrestha</a>
                        </span>
                    </div>
                </div>
            </div>
            <div className="font-sans">
                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToTop();
                    }}
                    className={`fixed bottom-4 right-4 bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <FaArrowUp />
                </a>
            </div>
        </>
    );
};

export default Footer;



// To convert the provided HTML, jQuery, and CSS code into a React application using Tailwind CSS, we'll need to break it down into reusable React components, replace the jQuery functionality with React hooks or libraries, and convert the CSS styles to Tailwind CSS classes for a smoother and modern development experience. Below, I’ll outline the steps and provide a complete solution that maintains the same functionality and smooth animations.

// all same animation add smoothness
// and this code convert the react code tailwind css, js, css and react only