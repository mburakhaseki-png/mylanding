import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Sky, ContactShadows, Float, Text, useTexture, Cloud, Stars } from '@react-three/drei';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import * as THREE from 'three';
import { ArrowRight, Home, Star, Sun } from 'lucide-react';

// --- 3D Components ---

const Doorway = () => {
    return (
        <group position={[0, 0, 5]}>
            {/* Frame */}
            <mesh position={[-3, 3, 0]} receiveShadow>
                <boxGeometry args={[1, 8, 1]} />
                <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[3, 3, 0]} receiveShadow>
                <boxGeometry args={[1, 8, 1]} />
                <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[0, 7.5, 0]} receiveShadow>
                <boxGeometry args={[7, 1, 1]} />
                <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
            </mesh>

            {/* Glowing Threshold - Metallic/White */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 2]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} opacity={0.3} transparent />
            </mesh>
        </group>
    );
};

const ModernInterior = () => {
    return (
        <group position={[0, 0, -5]}>
            {/* Floating Glass Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 40]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.6}
                    opacity={0.8}
                    transparent
                    roughness={0.2}
                    metalness={0.1}
                    ior={1.5}
                />
            </mesh>

            {/* No Walls - Open Sky Concept */}

            {/* Abstract Centerpiece - Floating Chrome Sphere */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh position={[0, 3, -5]}>
                    <sphereGeometry args={[2, 64, 64]} />
                    {/* Chrome Metal Material */}
                    <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} envMapIntensity={2} />
                </mesh>
            </Float>
        </group>
    );
};

const CameraRig = ({ entered }) => {
    useFrame((state) => {
        // Camera starts outside (z=25) and moves inside (z=-2)
        const targetZ = entered ? -2 : 25;

        // Smooth interpolation for position
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.01);

        // Calculate lookAt Y based on Z position for smoothness
        const progress = THREE.MathUtils.clamp((25 - state.camera.position.z) / (25 - -2), 0, 1);
        const lookAtY = THREE.MathUtils.lerp(4, 2, progress);
        state.camera.lookAt(0, lookAtY, -20);

        // Parallax Intensity Ramp
        // Starts at 0 when z >= 4, ramps to 1 at z = 0
        // This prevents sudden jumps when crossing the threshold
        const parallaxIntensity = THREE.MathUtils.clamp((4 - state.camera.position.z) / 4, 0, 1);

        // Mouse parallax
        const targetX = state.mouse.x * 3 * parallaxIntensity;
        const targetY = 3 + state.mouse.y * 2 * parallaxIntensity;

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    });
    return null;
};

const Scene = ({ entered }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={50} />
            <CameraRig entered={entered} />

            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, 5, -10]} intensity={1} color="#ffffff" />

            {/* Neutral Sky */}
            <Sky
                sunPosition={[100, 20, -100]}
                turbidity={5}
                rayleigh={2}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
            />

            {/* Clouds - White */}
            <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 10, -20]} color="#ffffff" />
            <Cloud opacity={0.3} speed={0.3} width={15} depth={2} segments={20} position={[-15, 5, -15]} color="#ffffff" />
            <Cloud opacity={0.3} speed={0.3} width={15} depth={2} segments={20} position={[15, 5, -15]} color="#ffffff" />

            {/* City Environment for Skyscraper Reflections */}
            <Environment preset="city" />
            <fog attach="fog" args={['#eef0f5', 5, 40]} />

            <Doorway />
            <ModernInterior />

            <ContactShadows position={[0, 0.1, 0]} opacity={0.4} scale={30} blur={2} far={4} color="#000000" />
        </>
    );
};

const RealEstateHero = () => {
    const [entered, setEntered] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.5 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Trigger entry animation when visible, reset when out of view
    useEffect(() => {
        if (isInView) {
            if (!entered) {
                const timer = setTimeout(() => setEntered(true), 800);
                return () => clearTimeout(timer);
            }
        } else {
            setEntered(false);
        }
    }, [isInView, entered]);

    // --- MOBILE DESIGN ---
    if (isMobile) {
        return (
            <div ref={containerRef} style={{
                width: '100vw',
                height: '100vh',
                background: '#0a0a0a',
                position: 'relative',
                overflow: 'hidden',
                color: '#fff',
                fontFamily: "'Outfit', sans-serif"
            }}>
                {/* 1. Background Grid (Blueprint Effect) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    zIndex: 0
                }} />

                {/* 2. Animated Blueprint Lines */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    opacity: 0.5
                }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M10,90 L10,20 L90,20 L90,90"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M20,90 L20,30 L80,30 L80,90"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.1"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                        />
                        <motion.line
                            x1="10" y1="20" x2="50" y2="5"
                            stroke="white"
                            strokeWidth="0.2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 2 }}
                        />
                        <motion.line
                            x1="90" y1="20" x2="50" y2="5"
                            stroke="white"
                            strokeWidth="0.2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 2 }}
                        />
                    </svg>
                </div>

                {/* 3. Header */}
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
                        <div style={{ width: '8px', height: '8px', background: '#fff', transform: 'rotate(45deg)' }} />
                        <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '600' }}>ESTATE</span>
                    </div>
                    {/* Menu removed */}
                </div>

                {/* 4. Main Title */}
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
                            fontSize: '12vw',
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: '300',
                            letterSpacing: '0.1em',
                            margin: 0,
                            color: '#fff'
                        }}
                    >
                        EVER<br />NEST
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.7 }}
                        transition={{ delay: 1.5 }}
                        style={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.3em',
                            marginTop: '1rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        Elevated Living
                    </motion.p>
                </div>

                {/* 5. Bottom Content */}
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
                            fontSize: '1.2rem',
                            fontWeight: '300',
                            marginBottom: '0.5rem',
                            fontFamily: "'Playfair Display', serif"
                        }}>
                            Modern Architecture
                        </h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, maxWidth: '90%', lineHeight: 1.5 }}>
                            Curating exceptional properties for those who seek the extraordinary.
                        </p>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <span style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.1em' }}>RESIDENTIAL</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.1em' }}>COMMERCIAL</span>
                        </div>

                        <button style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.5)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '0',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            letterSpacing: '0.1em'
                        }}>
                            VIEW <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{
            width: '100vw',
            height: '100vh',
            background: '#000',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <Canvas shadows dpr={[1, 2]}>
                <Scene entered={entered} />
            </Canvas>

            {/* UI Overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

                {/* Header - Always Visible */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    padding: '2.5rem 4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                    zIndex: 100
                }}>
                    {/* Elegant Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(45deg)'
                        }}>
                            <div style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: '300', letterSpacing: '0.2em', color: '#fff', lineHeight: 1 }}>EVERNEST</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', gap: '3rem' }}>
                        {['About', 'Consulting', 'Projects', 'Contact'].map((item) => (
                            <a key={item} href="#" style={{
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'color 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <button style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.8rem 2rem',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        backdropFilter: 'blur(10px)'
                    }}>
                        Inquire
                    </button>
                </div>

                {/* Welcome Text (Fades out) */}
                <AnimatePresence>
                    {!entered && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                            transition={{ duration: 1.5 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#000',
                                zIndex: 20
                            }}
                        >
                            <h1 style={{ color: '#fff', fontSize: '2rem', letterSpacing: '0.8em', fontWeight: 200, textTransform: 'uppercase' }}>
                                Evernest
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content (Reveals after entry) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
                    transition={{ duration: 1.5, delay: 2.5 }}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Hero Text */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10%',
                        transform: 'translateY(-50%)',
                        color: '#333'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: '300',
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            color: '#1a1a1a',
                            letterSpacing: '-0.02em'
                        }}>
                            ELEVATED<br />
                            <span style={{ fontWeight: '600' }}>LIVING</span>
                        </h1>
                        <p style={{
                            maxWidth: '350px',
                            fontSize: '0.9rem',
                            lineHeight: 1.8,
                            color: '#666',
                            marginBottom: '2rem',
                            fontWeight: 300
                        }}>
                            Curating exceptional properties for those who seek the extraordinary.
                            Where architecture meets ambition.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', pointerEvents: 'auto' }}>
                            <button style={{
                                background: 'transparent',
                                color: '#1a1a1a',
                                border: '1px solid #1a1a1a',
                                padding: '0.8rem 2rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                View Collection <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default RealEstateHero;
