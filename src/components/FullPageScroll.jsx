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

    // Refs for state access in event listeners without re-binding
    const activeSectionRef = useRef(0);
    const horizontalIndexRef = useRef(0);
    const isScrolling = useRef(false);
    const touchStartY = useRef(0);

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
    }, []);

    return (
        <div style={{ height: '100vh', overflow: 'hidden', background: '#050a08' }}>
            {/* Conditionally render Navbar */}
            {slides[activeSection].type !== 'horizontal' && <Navbar />}

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
        </div>
    );
};

export default FullPageScroll;
