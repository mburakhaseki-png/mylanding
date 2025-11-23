import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const steps = [
    {
        id: 1,
        title: "Bize fikrini anlat",
        day: "1. Gün",
        description: "Vizyonunuzu dinliyor, hedeflerinizi anlıyor ve projenizin temellerini birlikte atıyoruz."
    },
    {
        id: 2,
        title: "Sizin için bir deneyim yaratalım",
        day: "2 - 4. Gün",
        description: "Sıradanlığın ötesine geçiyoruz. Tasarım ve teknolojiyi birleştirerek markanız için eşsiz bir dijital atmosfer kurguluyoruz."
    },
    {
        id: 3,
        title: "Deneyiminizi çalışır halde teslim edelim",
        day: "4. Gün",
        description: "Kusursuz çalışan, performansı yüksek ve etkileyici projenizi yayına hazır halde sunuyoruz."
    }
];

const HowItWorks = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const containerRef = useRef(null);

    // Mouse position state for 3D effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const springConfig = { damping: 20, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize mouse position from -0.5 to 0.5
            mouseX.set((clientX / innerWidth) - 0.5);
            mouseY.set((clientY / innerHeight) - 0.5);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    // Card specific transforms
    // Left card: angled right + mouse influence
    const leftCardRotateY = useTransform(rotateY, (val) => val + 15);
    const rightCardRotateY = useTransform(rotateY, (val) => val - 15);

    return (
        <section
            ref={containerRef}
            style={{
                height: '100vh',
                width: '100%',
                background: '#050a08',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'Inter', sans-serif",
                color: '#ffffff',
                perspective: '2000px' // Deep perspective for 3D effect
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    zIndex: 10,
                    textAlign: 'center',
                    marginTop: isMobile ? '0' : '5rem',
                    marginBottom: isMobile ? '2rem' : '5rem',
                    padding: '0 1rem'
                }}
            >
                <h2 style={{
                    fontSize: isMobile ? '2.5rem' : '4rem',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                    marginBottom: '1rem',
                    color: '#ffffff',
                    fontFamily: "'Playfair Display', serif"
                }}>
                    Süreç Nasıl İşliyor?
                </h2>
                <p style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 300,
                    letterSpacing: '0.05em'
                }}>
                    Fikirden gerçeğe, sadece 4 günde.
                </p>
            </motion.div>

            <div style={{
                zIndex: 10,
                width: '100%',
                maxWidth: '1400px',
                padding: isMobile ? '0 1.5rem' : '0 2rem',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '3.5rem' : '2rem',
                perspective: '2000px',
                position: 'relative'
            }}>

                {/* Mobile Connecting Line */}
                {isMobile && (
                    <div style={{
                        position: 'absolute',
                        left: '1.5rem', // Align with the left edge of cards
                        top: '2rem',
                        bottom: '2rem',
                        width: '2px',
                        background: 'rgba(255,255,255,0.2)',
                        zIndex: 0
                    }}></div>
                )}

                {steps.map((step, index) => {
                    // Determine rotation based on index
                    let rotationStyle = {};
                    let zIndex = 1;

                    if (!isMobile) {
                        if (index === 0) { // Left
                            rotationStyle = { rotateY: leftCardRotateY, rotateX: rotateX, z: 0 };
                            zIndex = 1;
                        } else if (index === 1) { // Center
                            rotationStyle = { rotateY: rotateY, rotateX: rotateX, z: 50 };
                            zIndex = 10;
                        } else if (index === 2) { // Right
                            rotationStyle = { rotateY: rightCardRotateY, rotateX: rotateX, z: 0 };
                            zIndex = 1;
                        }
                    }

                    return (
                        <motion.div
                            key={step.id}
                            style={{
                                flex: isMobile ? 'none' : '0 0 350px',
                                width: '100%',
                                height: isMobile ? 'auto' : '450px',
                                position: 'relative',
                                zIndex: zIndex,
                                transformStyle: 'preserve-3d',
                                ...rotationStyle
                            }}
                        >
                            {/* Mobile: Day Title Outside Box */}
                            {isMobile && (
                                <div style={{
                                    marginBottom: '0.5rem',
                                    paddingLeft: '2rem', // Indent for line
                                    position: 'relative'
                                }}>
                                    {/* Dot on line */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-5px', // Center on line (line is at 0 relative to this container if we adjust)
                                        // Actually line is absolute to parent. Let's adjust dot relative to this item.
                                        // Better: Line is absolute to parent. 
                                        // Let's put dot absolute to this item.
                                        left: '0',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '10px',
                                        height: '10px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        zIndex: 2
                                    }}></div>

                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>
                                        {step.day}
                                    </span>
                                </div>
                            )}

                            <div
                                style={{
                                    width: isMobile ? 'auto' : '100%',
                                    height: '100%',
                                    padding: isMobile ? '1.5rem' : '2.5rem',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    transition: 'border-color 0.3s ease, background 0.3s ease',
                                    boxShadow: isMobile ? 'none' : '0 20px 50px rgba(0,0,0,0.5)',
                                    borderRadius: isMobile ? '12px' : '0',
                                    marginLeft: isMobile ? '2rem' : '0' // Indent box from line
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMobile) {
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMobile) {
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                    }
                                }}
                            >
                                {/* Mobile Layout: Content Only (Day is outside) */}
                                {isMobile ? (
                                    <>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 500,
                                            color: '#ffffff',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {step.title}
                                        </h3>
                                        <p style={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5,
                                            fontWeight: 300,
                                            margin: 0
                                        }}>
                                            {step.description}
                                        </p>
                                    </>
                                ) : (
                                    // Desktop Layout (Original)
                                    <>
                                        <div>
                                            <div style={{
                                                fontSize: '4rem',
                                                fontWeight: '100',
                                                color: 'rgba(255, 255, 255, 0.1)',
                                                marginBottom: '1rem',
                                                fontFamily: "'Playfair Display', serif",
                                                lineHeight: 1
                                            }}>
                                                0{step.id}
                                            </div>
                                            <h3 style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 400,
                                                color: '#ffffff',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {step.title}
                                            </h3>
                                            <div style={{
                                                width: '40px',
                                                height: '1px',
                                                background: '#ffffff',
                                                marginBottom: '1.5rem',
                                                opacity: 0.5
                                            }}></div>
                                        </div>

                                        <div>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                fontSize: '0.95rem',
                                                lineHeight: 1.6,
                                                fontWeight: 300,
                                                marginBottom: '2rem'
                                            }}>
                                                {step.description}
                                            </p>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 1rem',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                fontSize: '0.8rem',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: '#ffffff'
                                            }}>
                                                {step.day}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default HowItWorks;
