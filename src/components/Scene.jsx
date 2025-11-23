import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AICore = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            meshRef.current.rotation.x = time * 0.2;
            meshRef.current.rotation.y = time * 0.3;

            // Pulse effect
            const scale = 1 + Math.sin(time * 1.5) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
            <MeshDistortMaterial
                color="#000000"
                attach="material"
                distort={0.6} // Strength, 0 disables the effect (default=1)
                speed={2} // Speed (default=1)
                roughness={0.2}
                metalness={0.9}
                bumpScale={0.005}
                clearcoat={1}
                clearcoatRoughness={0.1}
                radius={1}
                emissive="#00ff9d"
                emissiveIntensity={0.2}
            />
        </Sphere>
    );
};

const Scene = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#9d00ff" />
                <spotLight position={[0, 5, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />
                <AICore />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene;
