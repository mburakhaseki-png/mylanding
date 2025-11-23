import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Hexagon, Zap, Activity, Globe, Lock, Cpu, Database, Wifi, DollarSign, BarChart3, Coins } from 'lucide-react';

// --- Chromatic Text Component ---
const ChromaticText = ({ text, className, style }) => {
    return (
        <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
            <span style={{ position: 'absolute', top: -2, left: -2, color: '#ff00ff', opacity: 0.7, mixBlendMode: 'screen' }}>{text}</span>
            <span style={{ position: 'absolute', top: 2, left: 2, color: '#00ffff', opacity: 0.7, mixBlendMode: 'screen' }}>{text}</span>
            <span style={{ position: 'relative', color: '#fff', mixBlendMode: 'normal' }}>{text}</span>
        </div>
    );
};

// --- StarField Component ---
const StarField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let stars = [];

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((width * height) / 4000);
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    speed: Math.random() * 0.05
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'white';

            stars.forEach(star => {
                ctx.globalAlpha = star.alpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();

                // Twinkle effect
                star.alpha += (Math.random() - 0.5) * 0.05;
                if (star.alpha < 0) star.alpha = 0;
                if (star.alpha > 1) star.alpha = 1;
            });

            requestAnimationFrame(animate);
        };

        initStars();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

const CryptoHero = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();
        if (width > 0 && height > 0) {
            mouseX.set((clientX / width) - 0.5);
            mouseY.set((clientY / height) - 0.5);
        }
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    const springConfig = { damping: 25, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    // --- MOBILE DESIGN ---
    if (isMobile) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at center, #0a0a12 0%, #000000 100%)',
                color: '#fff',
                fontFamily: "'Rajdhani', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>
                <StarField />

                {/* 1. Header */}
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
                        <Hexagon size={20} color="#00ffcc" fill="rgba(0, 255, 204, 0.2)" />
                        <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em', fontWeight: 'bold', color: '#00ffcc' }}>CRYPTO</span>
                    </div>
                    {/* Menu removed */}
                </div>

                {/* 2. Main Title (Glitch Effect) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 style={{
                            fontSize: '15vw',
                            fontWeight: '900',
                            lineHeight: 0.9,
                            margin: 0,
                            letterSpacing: '-0.05em',
                            color: '#fff',
                            textShadow: '2px 2px 0px #ff00ff, -2px -2px 0px #00ffff'
                        }}>
                            XC-07
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            letterSpacing: '0.5em',
                            color: '#00ffcc',
                            marginTop: '0.5rem',
                            textTransform: 'uppercase',
                            opacity: 0.8
                        }}>
                            Hyper Finance
                        </p>
                    </motion.div>
                </div>

                {/* 3. Rotating Core Animation */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                    pointerEvents: 'none'
                }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: '80vw',
                            height: '80vw',
                            border: '1px dashed rgba(0, 255, 204, 0.2)',
                            borderRadius: '50%'
                        }}
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: '80%',
                            height: '80%',
                            border: '1px solid rgba(255, 0, 255, 0.2)',
                            borderRadius: '50%',
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent'
                        }}
                    />
                </div>

                {/* 4. Bottom Stats */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>PRICE</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>$0.42</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>MKT CAP</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>$842M</div>
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                    <button style={{
                        background: 'rgba(0, 255, 204, 0.1)',
                        border: '1px solid #00ffcc',
                        color: '#00ffcc',
                        padding: '1rem',
                        width: '100%',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        clipPath: 'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)'
                    }}>
                        Connect Wallet
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at center, #0a0a12 0%, #000000 100%)',
                color: '#fff',
                fontFamily: "'Rajdhani', sans-serif",
                overflow: 'hidden',
                perspective: '2000px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <StarField />

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    padding: '2rem 4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 50,
                    pointerEvents: 'auto'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Hexagon size={32} color="#00ffcc" fill="rgba(0, 255, 204, 0.2)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>XC-07</span>
                </div>

                <div style={{ display: 'flex', gap: '3rem' }}>
                    {['ECOSYSTEM', 'GOVERNANCE', 'BRIDGE', 'DOCS'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#00ffcc'}
                            onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <button style={{
                    background: 'rgba(0, 255, 204, 0.1)',
                    border: '1px solid #00ffcc',
                    color: '#00ffcc',
                    padding: '0.8rem 2rem',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
                    transition: 'all 0.3s'
                }}>
                    CONNECT WALLET
                </button>
            </motion.header>

            {/* Background Grid */}
            <div style={{
                position: 'absolute',
                inset: '-50%',
                width: '200%',
                height: '200%',
                backgroundImage: `
          linear-gradient(rgba(0, 255, 204, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 204, 0.05) 1px, transparent 1px)
        `,
                backgroundSize: '100px 100px',
                transform: 'perspective(500px) rotateX(60deg)',
                animation: 'gridMove 20s linear infinite',
                pointerEvents: 'none',
                opacity: 0.2,
                zIndex: 1
            }} />
            <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(100px); }
        }
      `}</style>

            {/* Main 3D Container */}
            <motion.div
                style={{
                    width: '90%',
                    height: '85%',
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {/* Floating HUD Elements */}
                {[
                    { top: '18%', left: '5%', icon: <DollarSign size={18} />, text: "PRICE: $0.42" },
                    { top: '18%', right: '5%', icon: <BarChart3 size={18} />, text: "MKT CAP: $842M" },
                    { bottom: '10%', left: '5%', icon: <Activity size={18} />, text: "24H VOL: $125M" },
                    { bottom: '10%', right: '5%', icon: <Coins size={18} />, text: "SUPPLY: 2.1B XC" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: item.top,
                            left: item.left,
                            right: item.right,
                            bottom: item.bottom,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#00ffcc',
                            fontSize: '0.8rem',
                            letterSpacing: '0.1em',
                            transform: 'translateZ(50px)',
                            border: '1px solid rgba(0, 255, 204, 0.3)',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 20, 20, 0.5)',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        {item.icon}
                        {item.text}
                    </motion.div>
                ))}

                {/* Central Content */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) translateZ(100px)',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div style={{
                            display: 'inline-block',
                            border: '1px solid #00ffcc',
                            padding: '0.2rem 1rem',
                            marginBottom: '1rem',
                            fontSize: '0.8rem',
                            letterSpacing: '0.3em',
                            color: '#00ffcc',
                            boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)'
                        }}>
                            PROTOCOL V.7.0
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(4rem, 10vw, 12rem)',
                            fontWeight: '900',
                            lineHeight: 0.8,
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.05em',
                            color: 'transparent',
                            WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                            position: 'relative'
                        }}>
                            XC-07
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                color: '#fff',
                                opacity: 0.1,
                                filter: 'blur(10px)',
                                pointerEvents: 'none'
                            }}>XC-07</span>
                        </h1>

                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 4rem)',
                            fontWeight: '300',
                            letterSpacing: '0.5em',
                            color: '#fff',
                            marginTop: '1rem',
                            textShadow: '0 0 20px rgba(255,255,255,0.5)'
                        }}>
                            <ChromaticText text="HYPER_FINANCE" />
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            style={{
                                marginTop: '2rem',
                                fontSize: '0.9rem',
                                maxWidth: '500px',
                                margin: '2rem auto',
                                lineHeight: '1.6',
                                color: 'rgba(255, 255, 255, 0.7)',
                                letterSpacing: '0.05em',
                                fontFamily: "'Inter', sans-serif",
                                borderLeft: '2px solid #00ffcc',
                                paddingLeft: '1rem',
                                textAlign: 'left'
                            }}
                        >
                            A decentralized financial protocol built on hyper-dimensional lattice cryptography. Redefining value transfer across the quantum grid.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Central Reactor Ring */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '600px',
                        height: '600px',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%) translateZ(-50px)'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '400px',
                        height: '400px',
                        border: '2px solid rgba(0, 255, 204, 0.1)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%) translateZ(-20px)',
                        borderLeftColor: '#00ffcc',
                        borderRightColor: '#00ffcc'
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

            </motion.div>
        </div>
    );
};

export default CryptoHero;
