import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Scene from '../components/Scene';

const Hero = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    const springConfig = { damping: 50, stiffness: 400 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Only enable mouse tracking on desktop
        if (isMobile) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            mouseX.set(clientX - centerX);
            mouseY.set(clientY - centerY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, isMobile]);

    // Parallax transforms for blobs
    const x1 = useTransform(x, (value) => value * 0.2);
    const y1 = useTransform(y, (value) => value * 0.2);
    const x2 = useTransform(x, (value) => value * -0.15);
    const y2 = useTransform(y, (value) => value * -0.15);
    const x3 = useTransform(x, (value) => value * 0.1);
    const y3 = useTransform(y, (value) => value * 0.1);

    return (
        <section style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            background: '#050a08',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
        }}>
            {/* Noise Overlay */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.4,
                mixBlendMode: 'overlay'
            }} />

            {/* Gradient Blobs */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                filter: 'blur(100px)',
                zIndex: 0,
                opacity: 0.6
            }}>
                <motion.div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '40vw',
                    height: '40vw',
                    background: 'radial-gradient(circle, #00ff9d 0%, transparent 70%)',
                    borderRadius: '50%',
                    x: isMobile ? 0 : x1,
                    y: isMobile ? 0 : y1,
                }} animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4]
                }} transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }} />

                <motion.div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '50vw',
                    height: '50vw',
                    background: 'radial-gradient(circle, #9d00ff 0%, transparent 70%)',
                    borderRadius: '50%',
                    x: isMobile ? 0 : x2,
                    y: isMobile ? 0 : y2,
                }} animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3]
                }} transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }} />

                <motion.div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '35vw',
                    height: '35vw',
                    background: 'radial-gradient(circle, #ff0055 0%, transparent 70%)',
                    borderRadius: '50%',
                    x: isMobile ? 0 : x3,
                    y: isMobile ? 0 : y3,
                }} animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.2, 0.4, 0.2]
                }} transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }} />
            </div>

            {/* 3D Scene - Touch handling wrapper */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    touchAction: isMobile ? 'auto' : 'none', // Allow scrolling on mobile
                    pointerEvents: isMobile ? 'none' : 'auto' // Disable interaction on mobile
                }}
                onTouchMove={isMobile ? undefined : (e) => e.stopPropagation()}
            >
                <Scene />
            </div>

            {/* Content */}
            {isMobile ? (
                <>
                    {/* HASEKUI - Center */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        mixBlendMode: 'difference',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            style={{
                                fontSize: '15vw',
                                color: '#ffffff',
                                textAlign: 'center',
                                letterSpacing: '-0.05em',
                                lineHeight: 0.8,
                                fontWeight: 'bold'
                            }}
                        >
                            HASEKUI
                        </motion.h1>
                    </div>

                    {/* Artificial Genesis - Bottom */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 2,
                        pointerEvents: 'none',
                        mixBlendMode: 'difference',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            style={{
                                fontSize: '1rem',
                                color: '#00ff9d',
                                letterSpacing: '0.5em',
                                textTransform: 'uppercase',
                                background: 'rgba(0,0,0,0.5)',
                                padding: '0.5rem 1rem',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            Artificial Genesis
                        </motion.p>
                    </div>
                </>
            ) : (
                // Desktop - Grouped Center
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    mixBlendMode: 'difference',
                    width: '100%'
                }}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        style={{
                            fontSize: 'clamp(4rem, 15vw, 15rem)',
                            color: '#ffffff',
                            textAlign: 'center',
                            letterSpacing: '-0.05em',
                            lineHeight: 0.8,
                            fontWeight: 'bold'
                        }}
                    >
                        HASEKUI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                            color: '#00ff9d',
                            letterSpacing: '0.5em',
                            textTransform: 'uppercase',
                            marginTop: '2rem',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '0.5rem 1rem',
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        Artificial Genesis
                    </motion.p>
                </div>
            )}
        </section>
    );
};

export default Hero;
