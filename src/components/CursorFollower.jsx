import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorFollower = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="cursor-follower"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                position: 'fixed',
                left: 0,
                top: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid var(--color-primary)',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                backgroundColor: isClicking ? 'var(--color-primary)' : 'transparent',
            }}
            animate={{
                scale: isClicking ? 0.8 : 1,
            }}
        />
    );
};

export default CursorFollower;
