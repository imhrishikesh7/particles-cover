import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particle = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
};

const SphereParticles = () => {
  const groupRef = useRef();
  const particles = [];

  const numParticles = 500;
  const radius = 2;

  for (let i = 0; i < numParticles; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos((2 * Math.random()) - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    particles.push(
      <Particle key={i} position={new THREE.Vector3(x, y, z)} />
    );
  }

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {particles}
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 5, 5]} />
      <SphereParticles />
    </>
  );
};

export default function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
