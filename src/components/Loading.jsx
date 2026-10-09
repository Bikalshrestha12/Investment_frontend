import React from 'react'

// Inline loader by default so each section shows its own spinner without
// covering the page. Pass `fullScreen` for a page-blocking overlay.
const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
    const spinner = (
        <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            {text && <span className="text-base text-gray-500">{text}</span>}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
                {spinner}
            </div>
        )
    }

    return <div className="flex items-center justify-center py-10">{spinner}</div>
}

export default Loading;