import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Leaf, Box, Layers, Wind, Droplets, Sun, Menu } from 'lucide-react';
import bgImage from '../../assets/symbiosis_background.png';

// --- 3D Tilt Card Component ---
const TiltCard = ({ icon, title, delay }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, type: "spring" }}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: useSpring(rotateX, { stiffness: 300, damping: 30 }),
                    rotateY: useSpring(rotateY, { stiffness: 300, damping: 30 }),
                    width: '200px',
                    height: '280px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                whileHover={{ scale: 1.05 }}
            >
                {/* Glossy Reflection */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(125deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }} />

                <motion.div
                    style={{
                        color: '#bfff00',
                        marginBottom: '1.5rem',
                        filter: 'drop-shadow(0 0 15px rgba(191, 255, 0, 0.6))',
                        transform: 'translateZ(50px)' // Pop out effect
                    }}
                >
                    {icon}
                </motion.div>
                <motion.h4
                    style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        transform: 'translateZ(30px)'
                    }}
                >
                    {title}
                </motion.h4>
                <motion.div
                    style={{
                        marginTop: '1rem',
                        width: '40px',
                        height: '2px',
                        background: '#bfff00',
                        transform: 'translateZ(20px)'
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

// --- Magnetic Nav Item ---
const MagneticNav = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.3);
        y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.li
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: useSpring(x), y: useSpring(y), cursor: 'pointer' }}
        >
            {children}
        </motion.li>
    );
};

const SymbiosisHero = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX / innerWidth - 0.5);
        mouseY.set(clientY / innerHeight - 0.5);
    };

    // Parallax transforms
    const bgX = useTransform(mouseX, [-0.5, 0.5], ['5%', '-5%']);
    const bgY = useTransform(mouseY, [-0.5, 0.5], ['5%', '-5%']);
    const textX = useTransform(mouseX, [-0.5, 0.5], ['-2%', '2%']);
    const textY = useTransform(mouseY, [-0.5, 0.5], ['-2%', '2%']);

    // Hoist springs to top level to avoid "Rendered fewer hooks" error
    const springBgX = useSpring(bgX, { stiffness: 50, damping: 20 });
    const springBgY = useSpring(bgY, { stiffness: 50, damping: 20 });

    // --- MOBILE DESIGN ---
    if (isMobile) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                color: '#fff',
                fontFamily: "'Inter', sans-serif"
            }}>
                {/* 1. Background Image (Full Screen) */}
                <motion.div
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.6)',
                        zIndex: 0
                    }}
                />

                {/* 2. Topographic Overlay (Animated SVG) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    opacity: 0.3,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none'
                }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M0,50 Q25,30 50,50 T100,50"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.2"
                            animate={{ d: ["M0,50 Q25,30 50,50 T100,50", "M0,50 Q25,70 50,50 T100,50", "M0,50 Q25,30 50,50 T100,50"] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M0,60 Q25,40 50,60 T100,60"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.2"
                            animate={{ d: ["M0,60 Q25,40 50,60 T100,60", "M0,60 Q25,80 50,60 T100,60", "M0,60 Q25,40 50,60 T100,60"] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                        <motion.path
                            d="M0,40 Q25,20 50,40 T100,40"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.2"
                            animate={{ d: ["M0,40 Q25,20 50,40 T100,40", "M0,40 Q25,60 50,40 T100,40", "M0,40 Q25,20 50,40 T100,40"] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        />
                    </svg>
                </div>

                {/* 3. Top Header */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    right: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', background: '#bfff00', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '600' }}>SYMBIOSIS</span>
                    </div>
                    <Menu color="white" size={24} />
                </div>

                {/* 4. Main Title (Vertical / Stacked) */}
                <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                            fontSize: '15vw',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: '400',
                            lineHeight: 0.9,
                            letterSpacing: '-0.05em',
                            margin: 0,
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        SYM<br />
                        <span style={{ fontStyle: 'italic', color: '#bfff00' }}>BIO</span><br />
                        SIS
                    </motion.h1>
                </div>

                {/* 5. Bottom Content (Clean Text) */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '2rem',
                        right: '2rem',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}
                >
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '300',
                            marginBottom: '0.5rem',
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic'
                        }}>
                            Landscape Architecture
                        </h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '90%', lineHeight: 1.5 }}>
                            Weaving nature into the built environment through biomimicry.
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.3)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                                <Leaf size={16} color="#bfff00" /> Sustainable
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
                                <Layers size={16} color="#bfff00" /> Digital Twin
                            </div>
                        </div>

                        <button style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.5)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '100px',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Explore <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>

                {/* 6. Interactive Fireflies */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [Math.random() * 100, Math.random() * -100],
                            y: [Math.random() * 100, Math.random() * -100],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: '3px',
                            height: '3px',
                            background: '#bfff00',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px #bfff00',
                            zIndex: 5
                        }}
                    />
                ))}
            </div>
        );
    }

    // --- DESKTOP DESIGN (UNCHANGED) ---
    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                fontFamily: "'Inter', sans-serif",
                background: '#000'
            }}
        >
            {/* Dynamic Background */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '120%',
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.7) contrast(1.1)',
                    x: springBgX,
                    y: springBgY,
                    zIndex: 0
                }}
            />

            {/* Atmospheric Particles (CSS Animation) */}
            <div className="particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 0.5, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            width: '4px',
                            height: '4px',
                            background: '#bfff00',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px #bfff00'
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <nav style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '3rem 5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '0.2em', fontFamily: "'Playfair Display', serif" }}>SYMBIOSIS</h3>
                    <p style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Future Landscapes</p>
                </motion.div>
                <ul style={{ display: 'flex', gap: '3rem', listStyle: 'none', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.1em' }}>
                    {['PROJECTS', 'STUDIO', 'LAB', 'JOURNAL', 'CONTACT'].map((item, i) => (
                        <MagneticNav key={item}>
                            <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                style={{ display: 'block', position: 'relative' }}
                                whileHover={{ color: '#bfff00' }}
                            >
                                {item}
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        bottom: -5,
                                        left: 0,
                                        width: '100%',
                                        height: '1px',
                                        background: '#bfff00',
                                        scaleX: 0
                                    }}
                                    whileHover={{ scaleX: 1 }}
                                />
                            </motion.span>
                        </MagneticNav>
                    ))}
                </ul>
            </nav>

            {/* Hero Content */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%',
                zIndex: 10,
                pointerEvents: 'none' // Allow clicking through to background if needed
            }}>
                <motion.div style={{ x: textX, y: textY }}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            fontSize: 'clamp(4rem, 8vw, 9rem)',
                            fontWeight: '800',
                            lineHeight: 0.9,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '2rem',
                            fontFamily: "'Playfair Display', serif" // Mixing serif for that "vogue" look
                        }}
                    >
                        Designing <br />
                        <span style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: '300',
                            fontStyle: 'italic',
                            color: '#bfff00',
                            WebkitTextFillColor: '#bfff00'
                        }}>The Future</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.5)' }} />
                        <p style={{
                            fontSize: '1.1rem',
                            opacity: 0.9,
                            maxWidth: '500px',
                            fontWeight: '300',
                            letterSpacing: '0.05em'
                        }}>
                            We weave nature into the built environment through biomimicry and digital craft.
                        </p>
                        <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.5)' }} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Award Badge - Elegant Redesign */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{
                    position: 'absolute',
                    bottom: '5vh',
                    left: '5vw',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    zIndex: 20
                }}
            >
                <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            inset: -4,
                            border: '1px solid rgba(191, 255, 0, 0.3)',
                            borderRadius: '50%',
                            borderTopColor: 'transparent',
                            borderLeftColor: 'transparent'
                        }}
                    />
                    <Leaf size={24} color="#bfff00" strokeWidth={1.5} />
                </div>
                <div>
                    <h5 style={{
                        fontSize: '0.9rem',
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: '0.05em',
                        color: '#fff',
                        marginBottom: '0.2rem'
                    }}>
                        Award Winning Design
                    </h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '20px', height: '1px', background: '#bfff00' }} />
                        <p style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.1em', fontFamily: "'Inter', sans-serif" }}>
                            2025 SUSTAINABILITY
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    x: '-50%',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.5
                }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}>EXPLORE</span>
                <div style={{ width: '1px', height: '40px', background: 'white' }} />
            </motion.div>
        </div>
    );
};

export default SymbiosisHero;
