import React, { useEffect, useState } from 'react'
import { assets } from '../assets/public';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        {
            backgroundImage: assets.hero1,
            heading: "Trust in investment, prestige in results.",
            description: "Our philosophy is simple: trust in investment, prestige in results. We build long-lasting relationships with our clients by delivering transparent, reliable, and high-performing investment strategies that create real value.",
        },
        {
            backgroundImage: assets.hero2,
            heading: "World-class investment solutions for Nepali investors",
            description: "At Nexas Global Investment, we offer world-class investment solutions tailored specifically for Nepali investors seeking to expand their financial horizons. With a deep understanding of local markets and global trends, we bridge the gap between Nepal’s growing economy and international opportunities.",
        },
        {
            backgroundImage: assets.hero3,
            heading: "Global growth with Nepali confidence.",
            description: "Empowered by innovation and guided by experience, we enable global growth with Nepali confidence—helping individuals and businesses in Nepal confidently step into the global financial arena, grow their wealth, and secure a prosperous future.",
        },
    ];

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    //     }, 4000);

    //     return () => clearInterval(interval);
    // }, [slides.length]);

    // const goToPrevious = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    // };

    // const goToNext = () => {
    //     setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    // };

    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    if (slides.length === 0) return <div>No slides</div>;

    return (
        <div id="carouselExample" className="relative">
            <div className="relative overflow-hidden">

                <div className="relative w-full h-[80vh] overflow-hidden">

                    {/* Background Image with opacity */}
                    <img
                        src={slides[currentIndex].backgroundImage}
                        alt="Slide"
                        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-95"
                    />

                    {/* Solid Black Overlay with opacity */}
                    <div className="absolute inset-0 bg-black opacity-40 z-10 flex items-center justify-center px-4">
                        <div className="max-w-2xl text-center text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                                {slides[currentIndex].heading}
                            </h1>
                            <p className="mb-6 text-lg md:text-xl drop-shadow-md">
                                {slides[currentIndex].description}
                            </p>

                            <div className="flex justify-center gap-4">
                                <button className="bg-blue-600 hover:bg-blue-800 transition-all text-white px-6 py-3 rounded-full shadow-lg">
                                    {/* <Link to={slides[currentIndex].Link}>{slides[currentIndex].buttonText}</Link> */}
                                    <Link to="/project">Discover More</Link>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-800 transition-all text-white px-6 py-3 rounded-full shadow-lg">
                                    {/* <Link to={slides[currentIndex].Linked}>{slides[currentIndex].buttonTexts}</Link> */}
                                    <Link to="/contact">Contact Us</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Left Button */}
            {/* <button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                onClick={goToPrevious}
            >
                <span className="text-2xl">&lt;</span>
            </button> */}

            {/* Right Button */}
            {/* <button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                onClick={goToNext}
            >
                <span className="text-2xl">&gt;</span>
            </button> */}

        </div>
    )
}

export default Hero