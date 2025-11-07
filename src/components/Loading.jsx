import React from 'react'
import AtomicSpinner from 'atomic-spinner'

const Loading = () => {
    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <AtomicSpinner />
                </div>
            </div>
        </div>
    )
}

export default Loading