import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CodeParticleSystem = () => {
    const particlesRef = useRef();
    const linesRef = useRef();

    const particleCount = 300;
    const boundarySize = 25;
    const connectionDistance = 5;

    // Advanced particle data generation
    const particlesData = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const data = [];

        const codeColors = [
            // Coding-themed color palette
            new THREE.Color(0x3B82F6),   // Bright Blue
            new THREE.Color(0x10B981),   // Emerald Green
            new THREE.Color(0x6366F1),   // Indigo
            new THREE.Color(0xF43F5E),   // Rose
            new THREE.Color(0xF97316)    // Orange
        ];

        for (let i = 0; i < particleCount; i++) {
            // More interesting 3D distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.pow(Math.random(), 1 / 3) * boundarySize;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // More nuanced velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

            // Assign random coding-themed colors
            const randomColor = codeColors[Math.floor(Math.random() * codeColors.length)];
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;

            data.push({
                velocity: new THREE.Vector3(
                    velocities[i * 3],
                    velocities[i * 3 + 1],
                    velocities[i * 3 + 2]
                ),
                color: randomColor
            });
        }

        return { positions, colors, data };
    }, [particleCount]);

    useFrame((state) => {
        if (!particlesRef.current || !linesRef.current) return;

        const time = state.clock.elapsedTime;
        const positions = particlesRef.current.geometry.attributes.position.array;
        const linesArray = new Float32Array(particleCount * particleCount * 6);
        let lineIndex = 0;

        for (let i = 0; i < particleCount; i++) {
            // Organic movement with trigonometric functions
            const curl = new THREE.Vector3(
                Math.sin(time * 0.5 + positions[i * 3 + 1]) * 0.02,
                Math.cos(time * 0.5 + positions[i * 3 + 2]) * 0.02,
                Math.tan(time * 0.5 + positions[i * 3]) * 0.02
            );

            particlesData.data[i].velocity.add(curl);

            // Update positions
            positions[i * 3] += particlesData.data[i].velocity.x;
            positions[i * 3 + 1] += particlesData.data[i].velocity.y;
            positions[i * 3 + 2] += particlesData.data[i].velocity.z;

            // Spherical boundary with elastic bounce
            const distFromCenter = Math.sqrt(
                positions[i * 3] ** 2 +
                positions[i * 3 + 1] ** 2 +
                positions[i * 3 + 2] ** 2
            );

            if (distFromCenter > boundarySize / 2) {
                const normalizedPos = new THREE.Vector3(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2]
                ).normalize();

                positions[i * 3] -= normalizedPos.x * 0.1;
                positions[i * 3 + 1] -= normalizedPos.y * 0.1;
                positions[i * 3 + 2] -= normalizedPos.z * 0.1;

                particlesData.data[i].velocity.reflect(normalizedPos).multiplyScalar(0.01);
            }

            // Connection logic
            for (let j = i + 1; j < particleCount; j++) {
                const dist = Math.sqrt(
                    Math.pow(positions[i * 3] - positions[j * 3], 2) +
                    Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
                    Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
                );

                if (dist < connectionDistance) {
                    linesArray[lineIndex * 6] = positions[i * 3];
                    linesArray[lineIndex * 6 + 1] = positions[i * 3 + 1];
                    linesArray[lineIndex * 6 + 2] = positions[i * 3 + 2];

                    linesArray[lineIndex * 6 + 3] = positions[j * 3];
                    linesArray[lineIndex * 6 + 4] = positions[j * 3 + 1];
                    linesArray[lineIndex * 6 + 5] = positions[j * 3 + 2];
                    lineIndex++;
                }
            }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        linesRef.current.geometry.setAttribute('position',
            new THREE.BufferAttribute(linesArray.slice(0, lineIndex * 6), 3)
        );
        linesRef.current.geometry.setDrawRange(0, lineIndex * 2);
    });

    return (
        <group>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={particlesData.positions}
                        count={particleCount}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        array={particlesData.colors}
                        count={particleCount}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.2}
                    sizeAttenuation
                    vertexColors
                    transparent
                    opacity={0.8}
                />
            </points>

            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array(0)}
                        count={0}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={0.3}
                />
            </lineSegments>
        </group>
    );
};

const Particles = () => {
    return (
        <Canvas
            style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: '-1',
                background: 'white'
            }}
            camera={{
                position: [0, 0, 20],
                fov: 75,
                near: 0.1,
                far: 1000
            }}
        >
            <color attach="background" args={['white']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <CodeParticleSystem />
        </Canvas>
    );
};

export default Particles;