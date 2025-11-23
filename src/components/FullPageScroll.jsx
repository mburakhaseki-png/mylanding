import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Hero from '../sections/Hero';
import Contact from '../sections/Contact';
import { ServiceItem, servicesData } from '../sections/Services';
import { ProjectCard, projectsData } from '../sections/Showcase';
import SymbiosisHero from './portfolio/SymbiosisHero';
import CryptoHero from './portfolio/CryptoHero';
import EngineHero from './portfolio/EngineHero';
import RealEstateHero from './portfolio/RealEstateHero';
import HowItWorks from '../sections/HowItWorks';

const FullPageScroll = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [horizontalIndex, setHorizontalIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Refs for state access in event listeners without re-binding
    const activeSectionRef = useRef(0);
    const horizontalIndexRef = useRef(0);
    const isScrolling = useRef(false);
    const touchStartY = useRef(0);

    // Detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync refs with state
    useEffect(() => {
        activeSectionRef.current = activeSection;
    }, [activeSection]);

    useEffect(() => {
        horizontalIndexRef.current = horizontalIndex;
    }, [horizontalIndex]);

    // Construct slides
    const slides = [
        { type: 'vertical', content: <Hero key="hero" /> },
        ...servicesData.map((data, i) => ({
            type: 'vertical',
            content: <ServiceItem key={`service-${i}`} data={data} index={i} />
        })),
        {
            type: 'horizontal',
            items: [
                <SymbiosisHero key="symbiosis" />,
                <CryptoHero key="crypto" />,
                <EngineHero key="engine" />,
                <RealEstateHero key="realestate" />
            ]
        },
        { type: 'vertical', content: <HowItWorks key="howitworks" /> },
        { type: 'vertical', content: <Contact key="contact" /> }
    ];

    const totalSections = slides.length;

    const handleScroll = (direction) => {
        if (isScrolling.current) return;
        isScrolling.current = true;

        const currentSectionIndex = activeSectionRef.current;
        const currentSlide = slides[currentSectionIndex];

        if (currentSlide.type === 'horizontal') {
            const currentHIndex = horizontalIndexRef.current;
            const totalHorizontal = currentSlide.items.length;

            if (direction === 'down') {
                if (currentHIndex < totalHorizontal - 1) {
                    setHorizontalIndex(prev => prev + 1);
                } else {
                    if (currentSectionIndex < totalSections - 1) {
                        setActiveSection(prev => prev + 1);
                    }
                }
            } else {
                if (currentHIndex > 0) {
                    setHorizontalIndex(prev => prev - 1);
                } else {
                    if (currentSectionIndex > 0) {
                        setActiveSection(prev => prev - 1);
                    }
                }
            }
        } else {
            if (direction === 'down') {
                if (currentSectionIndex < totalSections - 1) {
                    const nextSection = currentSectionIndex + 1;
                    setActiveSection(nextSection);
                    if (slides[nextSection].type === 'horizontal') {
                        setHorizontalIndex(0);
                    }
                }
            } else {
                if (currentSectionIndex > 0) {
                    const prevSection = currentSectionIndex - 1;
                    setActiveSection(prevSection);
                    if (slides[prevSection].type === 'horizontal') {
                        setHorizontalIndex(slides[prevSection].items.length - 1);
                    }
                }
            }
        }

        setTimeout(() => {
            isScrolling.current = false;
        }, 1000);
    };

    useEffect(() => {
        // Only enable snap-scroll on desktop
        if (isMobile) {
            // On mobile, just handle navigation events
            const onNavigate = (e) => {
                const targetSection = e.detail.section;
                const element = document.getElementById(`section-${targetSection}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            };

            window.addEventListener('navigateToSection', onNavigate);
            return () => {
                window.removeEventListener('navigateToSection', onNavigate);
            };
        }

        // Desktop: snap-scroll behavior
        const onWheel = (e) => {
            if (Math.abs(e.deltaY) > 30) {
                handleScroll(e.deltaY > 0 ? 'down' : 'up');
            }
        };

        const onTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY.current - touchEndY;
            if (Math.abs(diff) > 50) {
                handleScroll(diff > 0 ? 'down' : 'up');
            }
        };

        const onNavigate = (e) => {
            const targetSection = e.detail.section;
            setActiveSection(targetSection);
            if (slides[targetSection].type === 'horizontal') {
                setHorizontalIndex(0);
            }
        };

        window.addEventListener('wheel', onWheel);
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('navigateToSection', onNavigate);

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('navigateToSection', onNavigate);
        };
    }, [isMobile]);

    return (
        <div style={{
            height: '100vh',
            overflow: isMobile ? 'auto' : 'hidden',
            background: '#050a08',
            scrollSnapType: isMobile ? 'none' : 'y mandatory'
        }}>
            {/* Conditionally render Navbar */}
            {!isMobile && slides[activeSection].type !== 'horizontal' && <Navbar />}
            {isMobile && <Navbar />}

            {isMobile ? (
                // Mobile: Normal scroll
                <div>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            id={`section-${index}`}
                            style={{
                                minHeight: '100vh',
                                width: '100%',
                                position: 'relative'
                            }}
                        >
                            {slide.type === 'vertical' ? (
                                slide.content
                            ) : (
                                // Horizontal slides on mobile: show all vertically
                                <div>
                                    {slide.items.map((item, i) => (
                                        <div key={i} style={{ minHeight: '100vh', width: '100%' }}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                // Desktop: Snap scroll
                <motion.div
                    animate={{ y: `-${activeSection * 100}vh` }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    style={{ height: '100%' }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} style={{ height: '100vh', width: '100%', position: 'relative' }}>
                            {slide.type === 'vertical' ? (
                                slide.content
                            ) : (
                                <div style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                    <motion.div
                                        animate={{ x: `-${horizontalIndex * 100}vw` }}
                                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                                        style={{
                                            display: 'flex',
                                            height: '100%'
                                        }}
                                    >
                                        {slide.items.map((item, i) => (
                                            <div key={i} style={{ width: '100vw', height: '100%', flexShrink: 0 }}>
                                                {item}
                                            </div>
                                        ))}
                                    </motion.div>

                                    <div style={{
                                        position: 'absolute',
                                        bottom: '2rem',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        display: 'flex',
                                        gap: '1rem',
                                        zIndex: 10
                                    }}>
                                        {slide.items.map((_, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: '40px',
                                                    height: '4px',
                                                    background: horizontalIndex === i ? '#fff' : 'rgba(255,255,255,0.2)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Desktop navigation dots */}
            {!isMobile && (
                <div style={{
                    position: 'fixed',
                    right: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    zIndex: 100
                }}>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                if (!isScrolling.current) {
                                    setActiveSection(index);
                                    if (slide.type === 'horizontal') setHorizontalIndex(0);
                                }
                            }}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: activeSection === index ? '#00ff9d' : 'rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                transform: activeSection === index ? 'scale(1.5)' : 'scale(1)'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Scroll to Top Button - Desktop Only */}
            {!isMobile && activeSection > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveSection(0)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 100,
                        color: '#fff'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </motion.div>
            )}
        </div>
    );
};

export default FullPageScroll;
