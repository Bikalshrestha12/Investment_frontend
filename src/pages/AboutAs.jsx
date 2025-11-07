import React from 'react'
import About from '../components/About'
import Team from '../components/Team'

const AboutAs = () => {

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
                    <h4
                        className="text-white text-4xl md:text-5xl mb-4 animate-fadeInDown"
                        style={{ animationDelay: '0.1s' }}
                    >
                        About Us
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
                        <li className="text-blue-400">About</li>
                    </ol>
                </div>
            </div>
            <About />
            <Team />
        </div>
    )
}

export default AboutAs