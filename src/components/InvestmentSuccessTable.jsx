import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvestmentSuccessTable = ({ investedProjects }) => {
    if (!investedProjects || investedProjects.length === 0) return null;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-6 transition-all duration-300 ease-in-out hover:shadow-xl">
            {investedProjects.length > 0 && (
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
                    <h2 className="text-center text-xl font-bold text-green-600 mb-5">Your Investment Projects</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b text-left">Title</th>
                                    <th className="px-4 py-2 border-b text-left">Category</th>
                                    <th className="px-4 py-2 border-b text-left">Description</th>
                                    <th className="px-4 py-2 border-b text-left">Image</th>
                                    <th className="px-4 py-2 border-b text-left">Icon</th>
                                    <th className="px-4 py-2 border-b text-right">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investedProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{project.title}</td>
                                        <td className="px-4 py-2 border-b">{project.category}</td>
                                        <td className="px-4 py-2 border-b">{project.description?.slice(0, 50)}...</td>
                                        <td className="px-4 py-2 border-b">
                                            <img src={project.image} alt={project.title} className="w-12 rounded" />
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            <img src={project.icon} alt={project.title} className="w-8 rounded" />
                                        </td>
                                        {/* <td className="px-4 py-2 border-b text-right">
                                            <Link to={`/dashboard/projectdetailpage/${project._id}`} className="text-blue-600">👁️</Link>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentSuccessTable;
