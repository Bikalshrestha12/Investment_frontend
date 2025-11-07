import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const featureList = [
    "Flexible investment options",
    "Real-time performance tracking",
    "Dedicated support team",
    "ROI assurance based on metrics",
    "Secure payment gateway",
    "Customizable investment plans",
    "Detailed analytics dashboard",
    "24/7 customer support"
];

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            type: 'spring',
            stiffness: 80
        }
    }),
    whileHover: {
        scale: 1.02,
        backgroundColor: '#f0f9ff',
        transition: { duration: 0.3 }
    }
};

const Features = () => {
    return (
        <motion.section
            className="bg-white mt-10 p-6 md:p-10 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featureList.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-md transition duration-300"
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="whileHover"
                    >
                        <FaCheckCircle className="text-blue-500 mt-1" />
                        <p className="text-gray-700 text-sm">{feature}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default Features;
