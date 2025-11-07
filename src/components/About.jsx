import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { InvestmentContext } from '../contexts/InvestmentContext';
import { assets } from '../assets/public';
// import { publice } from '../assets/public';

const About = () => {
    const { projectData } = useContext(InvestmentContext);
    const totalProjects = projectData?.length || 0;
    const totalCustomers = '5m+';
    // const totalProjects = 32;
    const totalTeamMembers = 97;

    const startDate = new Date('2024-04-25');
    const today = new Date();
    const experienceYears = today.getFullYear() - startDate.getFullYear();

    return (
        <div className="bg-light py-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <img src={assets.about1} className="w-full rounded-t-lg" alt="About" />
                        <img src={assets.about2} className="w-full rounded-b-lg" alt="About" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative"
                    >
                        <h4 className="text-blue-900 text-2xl text-center font-medium mb-2">About Us</h4>
                        <h1 className="text-4xl font-bold mb-4">The most Profitable Investments company in worldwide.</h1>
                        <p className="mb-4 pl-4 border-l-4 border-primary">
                            Nexas Global Investment is one of the world’s most trusted and profitable investment companies, delivering innovative financial solutions across global markets. With a strong focus on growth, security, and transparency, we are committed to helping individuals and businesses build lasting wealth.

                            We combine expert strategy, streamlined business processes, and cutting-edge marketing with powerful partnerships to deliver consistent returns for our clients.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 leading-8">
                            <div>
                                <p className="flex items-center"><i className="fas fa-check-circle text-primary mr-2 font-bold text-2xl"></i> Strategy & Consulting</p>
                                <p className="flex items-center"><i className="fas fa-check-circle text-primary mr-2 font-bold text-2xl"></i> Business Process</p>
                            </div>
                            <div>
                                <p className="flex items-center"><i className="fas fa-check-circle text-primary mr-2 font-bold text-2xl"></i> Marketing Rules</p>
                                <p className="flex items-center"><i className="fas fa-check-circle text-primary mr-2 font-bold text-2xl"></i> Partnerships</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-5 items-center">
                            <a href="project" className="text-white rounded-full py-3 px-5 bg-blue-600 hover:bg-blue-950 hover:scale-110 duration-200 transition-transform text-center">
                                Discover More
                            </a>
                            <div className="flex items-center">
                                <div className="flex -space-x-4">
                                    <img src="https://imgs.search.brave.com/QyVvU4v2b9mVQ5sxufNsYeeko3c5xk0NrAZBOT_vUqc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/d2hhdHMtdGhlLWFp/LWJlaW5nLXVzZWQt/dG8tY3JlYXRlLXRo/ZXNlLWFuaW1lLWlt/YWdlcy10aGF0dmUt/djAtZXA3b21ibmNm/ZmtlMS5qcGc_d2lk/dGg9NjQwJmNyb3A9/c21hcnQmYXV0bz13/ZWJwJnM9NGU3ZDcz/Y2MwZDRhZWM5N2Rk/MTRkNjBlY2IxZDUx/ZjIzZDA1Yjc1Yw" className="w-16 h-16 rounded-full border-2 border-white" alt="Customer" />
                                    <img src="https://imgs.search.brave.com/kPwx_hzWzWSm8LBBN95tBTH-DRtXfWKIOLQbp7ifqOU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ub3Zl/bGFpLm5ldC9pbWFn/ZXMvbGFuZGluZy9l/eGFtcGxlc2V0cy8x/MDEvbm92ZWxhaS1h/bmltZS1idXR0ZXJm/bGllcy1naXJsLTYw/MHcud2VicA" className="w-16 h-16 rounded-full border-2 border-white" alt="Customer" />
                                    <img src="https://imgs.search.brave.com/X6EYyjT2eQ1xCGX49ngdDul9Z43b8JjCq43_cce_9e8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yc3py/LmdldGltZy5haS9y/ZXNpemU_dXJsPWh0/dHBzOi8vaW1nLmdl/dGltZy5haS9nZW5l/cmF0ZWQvaW1nLWx3/ZUlwc0ZQb0J5SDFk/cnFsajRnVi5qcGVn/JnR5cGU9d2VicCZ3/aWR0aD0xMDgwJnNw/ZWVkPTU.jpeg" className="w-16 h-16 rounded-full border-2 border-white" alt="Customer" />
                                    <img src="https://imgs.search.brave.com/uOWaiy3O7V5dm3kdcoNHruoi9ZoXDfOhgRCIlpmYlN0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yc3py/LmdldGltZy5haS9y/ZXNpemU_dXJsPWh0/dHBzOi8vaW1nLmdl/dGltZy5haS9nZW5l/cmF0ZWQvaW1nLW1H/dFNrOW1vZFRudnNE/VnN4YVhaQy5qcGVn/JnR5cGU9d2VicCZ3/aWR0aD02NDAmc3Bl/ZWQ9NQ.jpeg" className="w-16 h-16 rounded-full border-2 border-white" alt="Customer" />
                                </div>
                                <p className="ml-4">{totalCustomers} Trusted Global Customers</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center items-center">
                            <div className="bg-primary rounded-lg p-4 text-white bg-blue-700">
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold">{totalProjects}</span>
                                    <h4 className="text-2xl ml-2">k+</h4>
                                </div>
                                <p>Project Complete</p>
                            </div>
                            <div className="bg-dark rounded-lg p-4 text-white bg-blue-950">
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold">{experienceYears}</span>
                                    <h4 className="text-2xl ml-2">+</h4>
                                </div>
                                <p>Years Of Experience</p>
                            </div>
                            <div className="bg-primary rounded-lg p-4 text-white bg-blue-700">
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold">{totalTeamMembers}</span>
                                    <h4 className="text-2xl ml-2">+</h4>
                                </div>
                                <p>Team Members</p>
                            </div>
                        </div>
                        <div className='my-5'>
                            <h4 className='text-2xl font-bold'>Let's Grow Together</h4>
                            <p className='text-neutral-800'>Explore smarter investment opportunities with Nexas Global Investment. Your future starts here.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
