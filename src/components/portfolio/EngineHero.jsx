import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Settings, Activity, Zap, Thermometer, Gauge, Wind } from 'lucide-react';

// --- 3D Components ---

const Piston = ({ position, offset, speed }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Piston motion: Up/Down sine wave
        meshRef.current.position.y = position[1] + Math.sin(t * speed * 10 + offset) * 0.5;
    });

    return (
        <group position={[position[0], 0, position[2]]}>
            {/* Piston Head */}
            <mesh ref={meshRef} castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />
                <meshStandardMaterial color="#silver" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Connecting Rod (Visual only, simplified) */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.5} />
            </mesh>
        </group>
    );
};

const EngineBlock = ({ speed }) => {
    const fanRef = useRef();
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Fan rotation
        if (fanRef.current) {
            fanRef.current.rotation.z -= speed * 0.1;
        }
        // Subtle engine vibration
        if (groupRef.current) {
            groupRef.current.position.x = (Math.random() - 0.5) * 0.02 * (speed / 5);
            groupRef.current.position.y = (Math.random() - 0.5) * 0.02 * (speed / 5);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main Block */}
            <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[4, 2, 2]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.7} />
            </mesh>

            {/* Cylinders Housing */}
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.8, 1, 1.8]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} />
            </mesh>

            {/* Pistons (V8 Layout - 4 per side, simplified to inline for visual clarity or staggered) */}
            {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                <React.Fragment key={i}>
                    <Piston position={[x, 0.5, 0.4]} offset={i} speed={speed} />
                    <Piston position={[x, 0.5, -0.4]} offset={i + Math.PI} speed={speed} />
                </React.Fragment>
            ))}

            {/* Front Fan */}
            <group position={[2.2, -1, 0]} rotation={[0, 0, Math.PI / 2]} ref={fanRef}>
                <mesh>
                    <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <mesh key={i} rotation={[0, i * (Math.PI / 3), 0]} position={[0, 0, 0]}>
                        <boxGeometry args={[0.1, 1.8, 0.05]} />
                        <meshStandardMaterial color="#444" metalness={0.8} />
                    </mesh>
                ))}
            </group>

            {/* Exhaust Pipes (Glowing) */}
            <mesh position={[0, -1, 1.2]} rotation={[Math.PI / 4, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 3.5, 16]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial
                    color={speed > 5 ? "#ff4400" : "#555"}
                    emissive={speed > 5 ? "#ff2200" : "#000"}
                    emissiveIntensity={speed > 5 ? (speed / 10) * 2 : 0}
                    metalness={0.8}
                />
            </mesh>
            <mesh position={[0, -1, -1.2]} rotation={[-Math.PI / 4, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 3.5, 16]} />
                <meshStandardMaterial
                    color={speed > 5 ? "#ff4400" : "#555"}
                    emissive={speed > 5 ? "#ff2200" : "#000"}
                    emissiveIntensity={speed > 5 ? (speed / 10) * 2 : 0}
                    metalness={0.8}
                />
            </mesh>
        </group>
    );
};

const Scene = ({ speed }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[7, 4, 9]} fov={45} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={speed * 0.5} target={[0, 0, 0]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4444ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4400" />

            {/* Dynamic Light based on speed (Heat) */}
            <pointLight
                position={[0, 0, 0]}
                intensity={speed * 0.5}
                color="#ffaa00"
                distance={5}
            />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <EngineBlock speed={speed} />
            </Float>

            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </>
    );
};

// --- UI Components ---

const StatCard = ({ icon, label, value, unit, color = "#00aaff" }) => (
    <div style={{
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${color}`,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '180px',
        backdropFilter: 'blur(5px)',
        clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)'
    }}>
        <div style={{ color: color }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.1em' }}>{label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: "'Rajdhani', sans-serif" }}>
                {value} <span style={{ fontSize: '0.8rem' }}>{unit}</span>
            </div>
        </div>
    </div>
);

const EngineHero = () => {
    const [speed, setSpeed] = useState(1); // 1 to 10
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- MOBILE DESIGN ---
    if (isMobile) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle at center, #0f0f1a 0%, #000000 100%)',
                color: '#fff',
                fontFamily: "'Space Grotesk', sans-serif",
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Radial Grid Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                        radial-gradient(circle at 50% 50%, transparent 0%, transparent 49%, rgba(100, 255, 218, 0.05) 50%, transparent 51%),
                        radial-gradient(circle at 50% 50%, transparent 0%, transparent 69%, rgba(100, 255, 218, 0.05) 70%, transparent 71%),
                        radial-gradient(circle at 50% 50%, transparent 0%, transparent 89%, rgba(100, 255, 218, 0.05) 90%, transparent 91%)
                    `,
                    zIndex: 0
                }} />

                {/* Animated Energy Waves */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 2.5, 1],
                            opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1.3,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '200px',
                            height: '200px',
                            border: '2px solid #64ffda',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2
                        }}
                    />
                ))}

                {/* Orbiting Energy Nodes */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '300px',
                            height: '300px',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 3
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: '8px',
                            height: '8px',
                            background: '#64ffda',
                            borderRadius: '50%',
                            boxShadow: '0 0 20px #64ffda',
                            transform: 'translateX(-50%)'
                        }} />
                    </motion.div>
                ))}

                {/* Header */}
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
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: '6px',
                                height: '6px',
                                background: '#64ffda',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #64ffda'
                            }}
                        />
                        <span style={{
                            fontSize: '0.75rem',
                            letterSpacing: '0.3em',
                            fontWeight: '600',
                            color: '#64ffda'
                        }}>QUANTUM CORE</span>
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.1em',
                        fontFamily: "'Space Mono', monospace"
                    }}>
                        ONLINE
                    </div>
                </div>

                {/* Central Quantum Core */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5
                }}>
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                '0 0 40px rgba(100, 255, 218, 0.5)',
                                '0 0 80px rgba(100, 255, 218, 0.8)',
                                '0 0 40px rgba(100, 255, 218, 0.5)'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '120px',
                            height: '120px',
                            background: 'radial-gradient(circle, #64ffda 0%, rgba(100, 255, 218, 0.2) 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #64ffda'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: '80px',
                                height: '80px',
                                border: '2px dashed rgba(255,255,255,0.5)',
                                borderRadius: '50%'
                            }}
                        />
                    </motion.div>
                </div>

                {/* Main Title */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '2rem',
                    right: '2rem',
                    zIndex: 10
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{
                            fontSize: '0.7rem',
                            color: '#64ffda',
                            letterSpacing: '0.2em',
                            marginBottom: '0.5rem',
                            fontWeight: '600'
                        }}>
                            AUTONOMOUS SYSTEM
                        </div>
                        <h1 style={{
                            fontSize: '11vw',
                            fontWeight: '700',
                            lineHeight: 1,
                            margin: 0,
                            letterSpacing: '-0.02em',
                            color: '#fff',
                            textShadow: '0 0 40px rgba(100, 255, 218, 0.3)'
                        }}>
                            QUANTUM<br />
                            <span style={{
                                color: '#64ffda',
                                fontWeight: '300'
                            }}>Engine</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Floating Data Streams */}
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '2rem',
                    right: '2rem',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {[
                        { label: 'CORE TEMP', value: '2.7K', unit: 'KELVIN', color: '#64ffda' },
                        { label: 'ENERGY OUTPUT', value: '847', unit: 'PW', color: '#64ffda' },
                        { label: 'EFFICIENCY', value: '99.97', unit: '%', color: '#64ffda' }
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(100, 255, 218, 0.03)',
                                border: '1px solid rgba(100, 255, 218, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <div>
                                <div style={{
                                    fontSize: '0.65rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.3rem'
                                }}>
                                    {metric.label}
                                </div>
                                <div style={{
                                    fontSize: '1.8rem',
                                    fontWeight: '700',
                                    color: metric.color,
                                    fontFamily: "'Space Mono', monospace",
                                    lineHeight: 1
                                }}>
                                    {metric.value}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '0.7rem',
                                color: 'rgba(255,255,255,0.4)',
                                letterSpacing: '0.1em'
                            }}>
                                {metric.unit}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Status Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem 1.5rem',
                        background: 'rgba(10, 10, 15, 0.8)',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <motion.div
                        animate={{
                            opacity: [1, 0.3, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '8px',
                            height: '8px',
                            background: '#64ffda',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px #64ffda'
                        }}
                    />
                    <span style={{
                        fontSize: '0.7rem',
                        color: '#64ffda',
                        letterSpacing: '0.2em',
                        fontWeight: '600'
                    }}>
                        SYSTEM OPERATIONAL
                    </span>
                </motion.div>

                {/* Corner Brackets */}
                {[
                    { top: '1.5rem', left: '1.5rem', borderTop: '2px solid rgba(100, 255, 218, 0.3)', borderLeft: '2px solid rgba(100, 255, 218, 0.3)' },
                    { top: '1.5rem', right: '1.5rem', borderTop: '2px solid rgba(100, 255, 218, 0.3)', borderRight: '2px solid rgba(100, 255, 218, 0.3)' },
                    { bottom: '1.5rem', left: '1.5rem', borderBottom: '2px solid rgba(100, 255, 218, 0.3)', borderLeft: '2px solid rgba(100, 255, 218, 0.3)' },
                    { bottom: '1.5rem', right: '1.5rem', borderBottom: '2px solid rgba(100, 255, 218, 0.3)', borderRight: '2px solid rgba(100, 255, 218, 0.3)' }
                ].map((style, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            zIndex: 5,
                            ...style
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: '#050505',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* 3D Scene */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <Canvas shadows dpr={[1, 2]}>
                    <Scene speed={speed} />
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

                {/* Header */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    padding: '2rem 4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                    zIndex: 20
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {/* Logo Icon */}
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255, 68, 0, 0.1)',
                            border: '1px solid #ff4400',
                            display: 'grid',
                            placeItems: 'center',
                            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
                        }}>
                            <div style={{ width: '20px', height: '20px', background: '#ff4400', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                        </div>
                        {/* Brand Name */}
                        <div style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.2em',
                            textTransform: 'lowercase',
                            color: '#fff'
                        }}>
                            meshation
                        </div>
                    </div>

                    {/* Minimal Nav */}
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {['products', 'technology', 'about'].map(item => (
                            <a key={item} href="#" style={{
                                color: 'rgba(255,255,255,0.6)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'color 0.3s'
                            }}
                                onMouseEnter={e => e.target.style.color = '#ff4400'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Title - Moved to Bottom Left */}
                <div style={{
                    position: 'absolute',
                    bottom: '10vh',
                    left: '5%',
                    textAlign: 'left',
                    pointerEvents: 'none'
                }}>
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                            fontWeight: '900',
                            lineHeight: 0.9,
                            marginBottom: '0.5rem',
                            fontFamily: "'Rajdhani', sans-serif",
                            color: '#fff',
                            textShadow: '0 0 30px rgba(0,0,0,0.5)'
                        }}>
                            HYPER<br />
                            <span style={{ color: '#ff4400' }}>ENGINE</span> V12
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            opacity: 0.7,
                            maxWidth: '300px',
                            lineHeight: 1.4,
                            borderLeft: '2px solid #ff4400',
                            paddingLeft: '1rem'
                        }}>
                            Quantum-assisted combustion.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Right Slider */}
                <div style={{
                    position: 'absolute',
                    bottom: '10vh',
                    right: '5%',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    pointerEvents: 'auto'
                }}>
                    <div style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        color: '#ff4400',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}>
                        SPEED CONTROL
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        style={{
                            width: '100%',
                            height: '6px',
                            appearance: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}
                    />
                    <style>{`
                        input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            background: #ff4400;
                            cursor: pointer;
                            box-shadow: 0 0 15px rgba(255, 68, 0, 0.8);
                            border: 3px solid #fff;
                            margin-top: -12px;
                        }
                    `}</style>
                </div>

                {/* Stats Panel - Top Right (Added RPM) */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    right: '5%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    alignItems: 'flex-end'
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>TORQUE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: "'Rajdhani', sans-serif" }}>
                            {(850 + speed * 50).toFixed(0)} <span style={{ fontSize: '0.8rem', color: '#ff4400' }}>NM</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>TEMP</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: "'Rajdhani', sans-serif", color: speed > 7 ? '#ff0000' : '#fff' }}>
                            {(85 + speed * 12).toFixed(0)} <span style={{ fontSize: '0.8rem', color: '#ff4400' }}>°C</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>RPM</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: "'Rajdhani', sans-serif", color: '#ff4400' }}>
                            {(speed * 1000).toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EngineHero;
