import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestmentContext } from '../contexts/InvestmentContext';
import { Link, NavLink } from 'react-router-dom';


const Most_Investment_Projects = ({ investment, type }) => {
    const { projectData } = useContext(InvestmentContext);
    const [mostInvest, setMostInvest] = useState([]);

    useEffect(() => {
        if (Array.isArray(projectData) && projectData.length > 0) {
            let productCopy = projectData.slice();

            if (investment) {
                productCopy = productCopy.filter((item) => investment === item.investment);
            }
            if (type) {
                productCopy = productCopy.filter((item) => type === item.type);
            }

            setMostInvest(productCopy.slice(0, 3));
        }
    }, [projectData, investment, type]);

    // console.log(mostInvest);

    return (
        <div>

            <div className='my-24'>
                <div className='text-center text-3xl py-2'>
                    <div className='inline-flex gap-2 items-center mb-3'>
                        <p className='text-gray-500'> Most Investment <span className='text-gray-700 font-medium'>Project</span> </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {mostInvest.map((project, index) => (
                        <div key={index} className="p-2 bg-gray-400 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:scale-105">
                            <img
                                src={project.image || 'https://readymadeui.com/Imagination.webp'}
                                alt={project.title || 'Project Image'}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <h2 className="text-white text-xl font-semibold text-center transition-colors duration-300 hover:text-neutral-800">
                                {project.title}
                            </h2>
                            <p className="text-white text-lg font-bold text-center mt-1 transition-colors duration-300 hover:text-neutral-800">
                                {project.category}
                            </p>

                            <Link to={`/project/project_detail_page/${project._id}`} target='_top'>
                                <button className="mt-2 w-full bg-blue-500 text-white font-semibold py-1 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 hover:shadow-xl">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default Most_Investment_Projects