import React, { useEffect, useState } from 'react'
// import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        {
            backgroundImage: `https://imgs.search.brave.com/M5BT6eyDC56z_TO1CGOpQv6C6GtCDZh9FngthOJsI-o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9taWRzZWN0aW9u/LW1hbi13b21hbi1i/eS1idWlsZGluZy1u/aWdodF8xMDQ4OTQ0/LTE3NzQ5NTYwLmpw/Zz9zZW10PWFpc19o/eWJyaWQ`,
            heading: "Trust in investment, prestige in results.",
            description: "Our philosophy is simple: trust in investment, prestige in results. We build long-lasting relationships with our clients by delivering transparent, reliable, and high-performing investment strategies that create real value.",
            buttonText: "Apply Now",
            Link: 'project',
            buttonTexts: "Read More",
            Linked: 'services'
        },
        {
            backgroundImage: "https://imgs.search.brave.com/eDTrQWnO9Kt5FO0roYlInD2gxNNdjaCw68ucIww-25c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9uZXBh/bG5ld3MuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI1LzAy/L3N0b2NrLW1hcmtl/dC5qcGc",
            heading: "World-class investment solutions for Nepali investors",
            description: "At Nexas Global Investment, we offer world-class investment solutions tailored specifically for Nepali investors seeking to expand their financial horizons. With a deep understanding of local markets and global trends, we bridge the gap between Nepal’s growing economy and international opportunities.",
            buttonText: "Apply Now",
            Link: 'project',
            buttonTexts: "Read More",
            Linked: 'services'
        },
        {
            backgroundImage: "https://imgs.search.brave.com/zyV399sGFQb5b2IHt1_PboM5CR4ybdAK5_ccK6U7YI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kYXRh/LnRpYmV0dHJhdmVs/Lm9yZy9hc3NldHMv/aW1hZ2VzL21hcHMv/bmVwYWwtbWFwL25l/cGFsLWluLWFzaWEt/bWFwLXNtYWxsLmpw/Zw",
            heading: "Global growth with Nepali confidence.",
            description: "Empowered by innovation and guided by experience, we enable global growth with Nepali confidence—helping individuals and businesses in Nepal confidently step into the global financial arena, grow their wealth, and secure a prosperous future.",
            buttonText: "Apply Now",
            Link: 'project',
            buttonTexts: "Read More",
            Linked: 'services'
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
                                    <Link to={slides[currentIndex].Link}>{slides[currentIndex].buttonText}</Link>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-800 transition-all text-white px-6 py-3 rounded-full shadow-lg">
                                    <Link to={slides[currentIndex].Linked}>{slides[currentIndex].buttonTexts}</Link>
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