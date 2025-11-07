import React from 'react'

const Notfound = () => {
    return (
        <div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative my-8">
                <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
                <div className="container mx-auto text-center py-10 max-w-3xl relative z-10">
                    <h4
                        className="text-white text-4xl md:text-5xl mb-4 animate-fadeInDown"
                        style={{ animationDelay: '0.1s' }}
                    >
                        404
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
                        <li className="text-blue-400">404</li>
                    </ol>
                </div>
            </div>

            <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl w-full">
                    <div className="text-blue-500 mb-6 animate-bounce">
                        <svg
                            className="mx-auto h-20 w-20 sm:h-24 sm:w-24"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01M5.06 21h13.88c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 18c-.77 1.33.19 3 1.72 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 transition-all duration-300">404</h1>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mt-3">Page Not Found</h2>
                    <p className="text-gray-500 mt-4 text-base sm:text-lg">
                        Sorry, the page you're looking for doesn't exist. Try going back home or using the search option.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300"
                        >
                            Go Back To Home
                        </button>
                        <button
                            className="bg-white text-blue-500 border border-blue-500 px-6 py-3 rounded-full hover:bg-blue-50 transition duration-300"
                        >
                            <svg
                                className="w-5 h-5 inline-block mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Notfound