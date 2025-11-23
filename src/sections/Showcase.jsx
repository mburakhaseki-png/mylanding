import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const projectsData = [
    {
        id: 1,
        title: 'Neon Horizon',
        category: 'Cyberpunk UI',
        description: 'A futuristic interface for next-gen operating systems.',
        color: '#ff0055',
        image: 'linear-gradient(45deg, #ff005511, #000000)'
    },
    {
        id: 2,
        title: 'Eco Sphere',
        category: 'Sustainable Tech',
        description: 'Data visualization platform for global climate monitoring.',
        color: '#00ff9d',
        image: 'linear-gradient(45deg, #00ff9d11, #000000)'
    },
    {
        id: 3,
        title: 'Void Walker',
        category: 'Immersive Gaming',
        description: 'VR experience exploring the depths of digital space.',
        color: '#9d00ff',
        image: 'linear-gradient(45deg, #9d00ff11, #000000)'
    },
    {
        id: 4,
        title: 'Quantum Leap',
        category: 'Fintech Core',
        description: 'High-frequency trading algorithms visualized in real-time.',
        color: '#00f0ff',
        image: 'linear-gradient(45deg, #00f0ff11, #000000)'
    },
];

export const ProjectCard = ({ project, index }) => {
    // Note: useScroll hooks inside here might behave differently in a custom scroll container.
    // For now, we'll keep simple animations or rely on whileInView.

    return (
        <div
            style={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: '#050a08',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background: `radial-gradient(circle, ${project.color}22 0%, transparent 70%)`,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center'
                }}
            >
                <h3 style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    color: project.color,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    {project.category}
                </h3>

                <h2 style={{
                    fontSize: 'clamp(3rem, 8vw, 8rem)',
                    color: '#fff',
                    lineHeight: 0.9,
                    marginBottom: '2rem',
                    textShadow: `0 0 30px ${project.color}44`
                }}>
                    {project.title}
                </h2>

                <p style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: '600px',
                    margin: '0 auto 3rem auto',
                    lineHeight: 1.6
                }}>
                    {project.description}
                </p>

                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: project.color, color: '#000' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'transparent',
                        border: `1px solid ${project.color}`,
                        color: project.color,
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        borderRadius: '2rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s ease'
                    }}
                >
                    View Case <ArrowUpRight size={20} />
                </motion.button>
            </motion.div>

            {/* Number Watermark */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                fontSize: 'clamp(5rem, 15vw, 15rem)',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.03)',
                lineHeight: 1,
                pointerEvents: 'none'
            }}>
                0{project.id}
            </div>
        </div>
    );
};
