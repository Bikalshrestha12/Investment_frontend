import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dropdown = ({ isOpen, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight);
        }
    }, [children]);

    return (
        <div>
            <motion.ul
                className="ml-4 mt-2 space-y-1 overflow-hidden"
                initial={{ maxHeight: 0, opacity: 0 }}
                animate={{
                    maxHeight: isOpen ? height : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
            >
                <div ref={ref}>
                    {children}
                </div>
            </motion.ul>
        </div>
    )
}

export default Dropdown