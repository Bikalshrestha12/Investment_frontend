// import React from 'react';
// import { motion } from 'framer-motion';

// const Testimonial = () => {
//     const testimonials = [
//         {
//             img: 'img/testimonial-1.jpg',
//             name: 'Person Name',
//             profession: 'Profession',
//             text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
//         },
//         {
//             img: 'img/testimonial-2.jpg',
//             name: 'Person Name',
//             profession: 'Profession',
//             text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
//         },
//         {
//             img: 'img/testimonial-3.jpg',
//             name: 'Person Name',
//             profession: 'Profession',
//             text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
//         },
//     ];

//     return (
//         <div className="bg-light py-12">
//             <div className="container mx-auto px-4">
//                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//                     <motion.div
//                         initial={{ opacity: 0, x: -50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5, delay: 0.1 }}
//                         className="flex flex-col justify-center"
//                     >
//                         <h4 className="text-primary">Our Feedbacks</h4>
//                         <h1 className="text-4xl font-bold mb-4">Clients are Talking</h1>
//                         <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum atque soluta unde itaque.</p>
//                         <a href="#" className="bg-primary text-white rounded-full py-3 px-5 inline-flex items-center">
//                             Read All Reviews <i className="fas fa-arrow-right ml-2"></i>
//                         </a>
//                     </motion.div>
//                     <div className="col-span-2">
//                         <OwlCarousel
//                             className="testimonial-carousel"
//                             autoplay
//                             smartSpeed={1500}
//                             loop
//                             dots
//                             margin={25}
//                             responsive={{
//                                 0: { items: 1 },
//                                 768: { items: 2 },
//                                 1200: { items: 2 },
//                             }}
//                         >
//                             {testimonials.map((testimonial, index) => (
//                                 <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, y: 50 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
//                                     className="bg-white rounded-lg p-4 shadow-lg"
//                                 >
//                                     <div className="flex">
//                                         <i className="fas fa-quote-left text-3xl text-dark mr-3"></i>
//                                         <p>{testimonial.text}</p>
//                                     </div>
//                                     <div className="flex justify-end items-center mt-4">
//                                         <div className="text-right">
//                                             <h5>{testimonial.name}</h5>
//                                             <p>{testimonial.profession}</p>
//                                         </div>
//                                         <img src={testimonial.img} className="w-20 h-20 rounded-full border-2 border-primary ml-3" alt={testimonial.name} />
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </OwlCarousel>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Testimonial;


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from './Loading';

const Testimonial = () => {
    // const testimonials = [
    //     {
    //         img: 'https://imgs.search.brave.com/MQd-xKZN29q9sGct5eLjwmjS_LlqeHl8Uyl1waCPk_o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9oYXBweS1t/aWRkbGUtYWdlZC1i/dXNpbmVzcy1tYW4t/MjYwbnctMjMwNjE4/Njg5Ny5qcGc',
    //         name: 'Person Name',
    //         profession: 'Profession',
    //         text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
    //     },
    //     {
    //         img: 'https://imgs.search.brave.com/SriD_gFZNLCzepn6tHXCtorgl-uSY2Fo9HA8l-BbIIY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9zaHV0dGVy/c3RvY2svcGhvdG9z/LzIxNzkzODA2ODkv/ZGlzcGxheV8xNTAw/L3N0b2NrLXBob3Rv/LWhhcHB5LXlvdW5n/LWFzaWFuLXNhbGVz/d29tYW4tbG9va2lu/Zy1hdC1jYW1lcmEt/d2VsY29taW5nLWNs/aWVudC1zbWlsaW5n/LXdvbWFuLWV4ZWN1/dGl2ZS1tYW5hZ2Vy/LTIxNzkzODA2ODku/anBn',
    //         name: 'Person Name',
    //         profession: 'Profession',
    //         text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
    //     },
    //     {
    //         img: 'https://imgs.search.brave.com/lZuMdNg10j9Vm01BZ0033atXvkOQFSSye51xXbCqDjE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA5LzE3Lzg5Lzc2/LzM2MF9GXzkxNzg5/NzY4OV9ZMVZBTEQw/UnRZcDhjQ2Uxb0Rw/aENTU2M0T0h3clgz/bC5qcGc',
    //         name: 'Person Name',
    //         profession: 'Profession',
    //         text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam eos impedit eveniet dolorem culpa ullam.',
    //     },
    // ];

    const [testimonialsData, setTestimonialsData] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonialsData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/api/v1/testimonials');
                const response = await AxiosWithAuth().get("/api/v1/testimonials")

                // SAFELY extract array
                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setTestimonialsData(data);
                // console.log('Fetched testimonials data:', data);
            } catch (err) {
                if (err.response) {
                    setError(`Error: ${err.response.data.message || 'Failed to fetch testimonials data'}`);
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

        fetchTestimonialsData();
    }, []);

    useEffect(() => {
        setTestimonials(testimonialsData.slice(0, 3))
    }, [testimonialsData])

    if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

    return (
        <div className="bg-light py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col justify-center"
                    >
                        <h4 className="text-blue-950 font-medium text-2xl text-center">Our Feedbacks</h4>
                        <h1 className="text-4xl font-bold mb-4">Clients are Talking</h1>
                        <p className="mb-4">At Nexas Global Investment, our clients are at the heart of everything we do. Their success stories and positive experiences drive us to keep delivering world-class service, innovative solutions, and trusted investment results.</p>
                        <a href="#" className="bg-primary text-white rounded-full py-3 px-5 inline-flex items-center">
                            Read All Reviews <i className="fas fa-arrow-right ml-2"></i>
                        </a>
                    </motion.div>

                    {/* Swiper Carousel */}
                    <div className="col-span-2">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={25}
                            autoplay={{ delay: 3000 }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                                        className="bg-white rounded-lg p-4 shadow-lg"
                                    >
                                        <div className="flex">
                                            <i className="fas fa-quote-left text-3xl text-dark mr-3"></i>
                                            <p>{testimonial.text}</p>
                                        </div>
                                        <div className="flex justify-end items-center mt-4">
                                            <div className="text-right">
                                                <h5>{testimonial.name}</h5>
                                                <p>{testimonial.profession}</p>
                                            </div>
                                            <img
                                                // src={testimonial.image}
                                                src={
                                                    testimonial?.image
                                                        ? `${imageUpload}/uploads/images/${encodeURIComponent(testimonial.image.split('/').pop())}`
                                                        : assets.projectdefaul0
                                                }
                                                className="w-20 h-20 rounded-full border-2 border-primary ml-3"
                                                alt={testimonial.name}
                                            />
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
