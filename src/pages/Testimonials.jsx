import React, { useEffect, useState } from 'react'
// import Testimonial from '../components/Testimonial'
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import AxiosWithAuth, { imageUpload } from '../contexts/AxiosWithAuth';
import Loading from '../components/Loading';

const Testimonials = () => {

  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonialsData = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/v1/testimonials');
        const response = await AxiosWithAuth().get('/api/v1/testimonials');

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

  if (loading) return <div className="text-center py-20 text-xl text-gray-500"> <Loading /></div>;

  return (
    <div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
        <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
        <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
          <h4
            className="text-white text-4xl md:text-5xl mb-4 animate-fadeInDown"
            style={{ animationDelay: '0.1s' }}
          >
            Testimonial
          </h4>
          <ol
            className="flex justify-center list-none p-0 m-0 animate-fadeInDown"
            style={{ animationDelay: '0.3s' }}
          >
            <li className="text-white">
              <a href="/" className="text-white hover:text-blue-300">Home</a>
            </li>
            <li className="text-white mx-2">/</li>
            <li className="text-white">
              <a href="#" className="text-white hover:text-blue-300">Pages</a>
            </li>
            <li className="text-white mx-2">/</li>
            <li className="text-blue-400">Testimonial</li>
          </ol>
        </div>
      </div>

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
              <h1 className="text-4xl font-bold mb-4">What Our Clients Are Saying</h1>
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
                {testimonialsData.map((testimonial, index) => (
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


    </div>
  )
}

export default Testimonials