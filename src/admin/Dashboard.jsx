import React, { useContext, useEffect, useState } from 'react'
import BlogForm from './blogs/BlogForm';
import BlogPages from './blogs/BlogPages';
import { NavLink, useNavigate } from 'react-router-dom';
import BarChart from './chart/barchart';
import Sidbar from './Sidbar';
import { InvestmentContext } from '../contexts/InvestmentContext';

const Dashboard = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isBlogOpen, setIsBlogOpen] = useState(false);
    const [isProjectOpen, setIsProjectOPen] = useState(false);
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
    const { projectData } = useContext(InvestmentContext);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleServices = () => setIsServicesOpen(!isServicesOpen);
    const toggleBlog = () => setIsBlogOpen(!isBlogOpen);
    const toggleProject = () => setIsProjectOPen(!isProjectOpen)
    const toggleFAQ = () => setIsFAQOpen(!isFAQOpen);
    const toggleTeam = () => setIsTeamOpen(!isTeamOpen);
    const toggleTestimonial = () => setIsTestimonialOpen(!isTestimonialOpen);
    const navigate = useNavigate()

    const token = localStorage.getItem("token");
    // console.log(token)


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            navigate("/login");
        }
    }, [token, navigate]);

    // admin Editor viewer 

    return (

        <>
            <div className='m-1'>
                <div>
                    {/* Sidebar */}
                    <Sidbar />



                    <div>
                        <div className='flex'>
                            <div className="flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out">
                                <h1 className="text-3xl font-bold mb-12 text-center">Investment Management Dashboard</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-blue-500 p-4 rounded-lg shadow hover:scale-105 transition-all duration-300 ease-in-out">
                                        <h2 className="text-xl font-semibold mb-2 text-gray-100">Project Overview</h2>
                                        <p className="text-gray-300">Total Value: $250,000</p>
                                        <p className="text-gray-300">Monthly Gain: +2.5%</p>
                                    </div>
                                    <div className="bg-pink-400 p-4 rounded-lg shadow hover:scale-105 transition-all duration-300 ease-in-out">
                                        <h2 className="text-xl font-semibold mb-2 text-gray-100">Recent Transactions</h2>
                                        <p className="text-gray-300">Bought: 100 shares AAPL</p>
                                        <p className="text-gray-300">Sold: 50 shares TSLA</p>
                                    </div>
                                    <div className="bg-yellow-600 p-4 rounded-lg shadow hover:scale-105 transition-all duration-300 ease-in-out">
                                        <h2 className="text-xl font-semibold mb-2 text-gray-100">Market Trends</h2>
                                        <p className="text-gray-300">S&P 500: +1.2%</p>
                                        <p className="text-gray-300">NASDAQ: +0.8%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <BarChart />

                    </div>
                </div>



            </div>
        </>

    )
}

export default Dashboard