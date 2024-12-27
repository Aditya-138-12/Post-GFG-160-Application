import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const CodeSphere = () => {
    const meshRef = useRef();
    const { size } = useThree();

    // Generate code-like geometry
    const geometry = useMemo(() => {
        // Create an icosahedron geometry with interesting subdivisions
        const geo = new THREE.IcosahedronGeometry(3, 3);

        // Modify vertex positions to create a more organic, code-like structure
        const positions = geo.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const noise = Math.sin(positions[i] * 2) * 0.2 +
                Math.cos(positions[i + 1] * 2) * 0.2 +
                Math.tan(positions[i + 2] * 2) * 0.1;
            positions[i] += noise;
            positions[i + 1] += noise;
            positions[i + 2] += noise;
        }
        geo.attributes.position.needsUpdate = true;

        return geo;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Rotation and pulsing animation
        const time = state.clock.elapsedTime;
        meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
        meshRef.current.rotation.y = Math.cos(time * 0.4) * 0.2;

        // Pulsing effect
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
    });

    return (
        <group>
            <mesh ref={meshRef} geometry={geometry}>
                <meshStandardMaterial
                    wireframe={true}
                    color="#3B82F6"
                    opacity={0.2}
                    transparent
                    roughness={0.5}
                    metalness={0.5}
                />
            </mesh>

            {/* Code-like text particles */}
            <CodeParticles />
        </group>
    );
};

const CodeParticles = () => {
    const particlesRef = useRef();

    // Generate code-like particle positions
    const particleData = useMemo(() => {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const codeColors = [
            new THREE.Color(0x3B82F6),   // Bright Blue
            new THREE.Color(0x10B981),   // Emerald Green
            new THREE.Color(0x6366F1),   // Indigo
            new THREE.Color(0xF43F5E),   // Rose
            new THREE.Color(0xF97316)    // Orange
        ];

        for (let i = 0; i < count; i++) {
            // Distribute particles around a sphere
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(2 * Math.random() - 1);
            const radius = 4 + Math.random() * 1;

            positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(theta);

            // Random color from code-themed palette
            const randomColor = codeColors[Math.floor(Math.random() * codeColors.length)];
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;
        }

        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (!particlesRef.current) return;

        // Subtle particle movement
        const time = state.clock.elapsedTime;
        const positions = particlesRef.current.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.01;
            positions[i + 1] += Math.cos(time + i) * 0.01;
            positions[i + 2] += Math.tan(time + i) * 0.01;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={particleData.positions}
                    count={200}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    array={particleData.colors}
                    count={200}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.7}
                borderRadius={100}
            />
        </points>
    );
};

const CoolCodeVisualizer = () => {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                marginTop: '0%',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '-1'
            }}
        >
            <Canvas
                camera={{
                    position: [0, 0, 10],
                    fov: 45
                }}
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    zIndex: '-1'
                }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <CodeSphere />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI * 3 / 4}
                />
            </Canvas>
        </div>
    );
};

export default CoolCodeVisualizer;