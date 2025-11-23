import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Brain, ChevronDown } from 'lucide-react';

export const servicesData = [
    {
        id: 'web',
        title: 'Web Sitesi',
        subtitle: 'Sanat Eseri',
        description: 'Marka kimliğinizi ve vizyonunuzu anlayarak, baştan aşağı web sitesi yaratıyoruz. Sıradanlığı reddeden felsefemiz dahilinde websitenizi birer sanatçı edasıyla inşaa ediyoruz.',
        icon: <Globe size={120} />,
        color: '#00ff9d', // Green
        gradient: 'radial-gradient(circle at 30% 50%, #00ff9d44, #000000 70%)',
        align: 'flex-start'
    },
    {
        id: 'ai',
        title: 'Yapay Zeka Otomasyon Çözümleri',
        description: 'Saatlerinizi alan sıkıcı işleri yapay zeka ile otomasyon haline getirerek web-sitenize entegre ediyor, size hem zamandan hem de maddiyattan tasarruf ettiriyoruz.',
        icon: <Brain size={120} />,
        color: '#ff0055', // Pink
        gradient: 'radial-gradient(circle at 70% 50%, #ff005544, #000000 70%)',
        align: 'flex-end'
    }
];

export const ServiceItem = ({ data, index }) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050a08',
                overflow: 'hidden'
            }}
        >
            {/* Background Gradient - Simplified on mobile */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: isMobile ? data.color + '15' : data.gradient,
                opacity: isMobile ? 0.3 : 0.6,
                filter: isMobile ? 'none' : 'blur(50px)',
                zIndex: 0
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '1400px',
                width: '100%',
                padding: isMobile ? '2rem' : '4rem',
                display: 'flex',
                flexDirection: isMobile
                    ? 'column' // Always column on mobile (Symbol top, Text bottom)
                    : (index % 2 === 0 ? 'row' : 'row-reverse'),
                alignItems: 'center',
                gap: isMobile ? '2rem' : '4rem',
                textAlign: isMobile ? 'center' : 'left'
            }}>
                {/* Icon / Visual */}
                {isMobile ? (
                    <div style={{
                        flex: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        color: data.color
                    }}>
                        {data.icon}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            color: data.color,
                            filter: `drop-shadow(0 0 30px ${data.color})`
                        }}
                    >
                        {data.icon}
                    </motion.div>
                )}

                {/* Text */}
                {isMobile ? (
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            fontSize: 'clamp(3rem, 6vw, 6rem)',
                            lineHeight: 1,
                            marginBottom: data.subtitle ? '1rem' : '2rem',
                            color: '#fff',
                            textShadow: `0 0 20px ${data.color}44`,
                            textDecoration: data.subtitle ? 'line-through' : 'none',
                            textDecorationColor: data.color,
                            textDecorationThickness: '5px'
                        }}>
                            {data.title}
                        </h2>
                        {data.subtitle && (
                            <h3 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                                lineHeight: 1,
                                marginBottom: '2rem',
                                color: data.color,
                                textShadow: `0 0 20px ${data.color}44`
                            }}>
                                {data.subtitle}
                            </h3>
                        )}
                        <p style={{
                            fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.6,
                            maxWidth: '600px'
                        }}>
                            {data.description}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ flex: 1 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(3rem, 6vw, 6rem)',
                            lineHeight: 1,
                            marginBottom: data.subtitle ? '1rem' : '2rem',
                            color: '#fff',
                            textShadow: `0 0 20px ${data.color}44`,
                            textDecoration: data.subtitle ? 'line-through' : 'none',
                            textDecorationColor: data.color,
                            textDecorationThickness: '5px'
                        }}>
                            {data.title}
                        </h2>
                        {data.subtitle && (
                            <h3 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                                lineHeight: 1,
                                marginBottom: '2rem',
                                color: data.color,
                                textShadow: `0 0 20px ${data.color}44`
                            }}>
                                {data.subtitle}
                            </h3>
                        )}
                        <p style={{
                            fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.6,
                            maxWidth: '600px'
                        }}>
                            {data.description}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Portfolio Arrow - Only on AI Automation (index 1) */}
            {index === 1 && (
                isMobile ? (
                    <div style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        zIndex: 2,
                        cursor: 'pointer'
                    }}>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase'
                        }}>
                            Portfolyo
                        </span>
                        <ChevronDown size={32} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        style={{
                            position: 'absolute',
                            bottom: '3rem',
                            left: '50%',
                            x: '-50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            zIndex: 2,
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.6)',
                            textTransform: 'uppercase'
                        }}>
                            Portfolyo
                        </span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ChevronDown size={32} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                        </motion.div>
                    </motion.div>
                )
            )}
        </div>
    );
};
