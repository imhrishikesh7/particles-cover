import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Particle = ({ position, targetPosition, transition }) => {
  const mesh = useRef();
  const initialPosition = useRef(position.clone());
  const [isTransitioning, setTransitioning] = useState(false);
  const driftOffset = useRef(new THREE.Vector3(
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  ));

  useEffect(() => {
    if (transition && !isTransitioning) {
      setTransitioning(true);
    }
  }, [transition, isTransitioning]);

  useFrame(() => {
    if (!isTransitioning && mesh.current) {
      const time = Date.now() * 0.0005;
      const amplitude = 0.1;
      mesh.current.position.x = initialPosition.current.x + Math.sin(time + driftOffset.current.x) * amplitude;
      mesh.current.position.y = initialPosition.current.y + Math.cos(time + driftOffset.current.y) * amplitude;
      mesh.current.position.z = initialPosition.current.z + Math.sin(time * 0.5 + driftOffset.current.z) * amplitude;
    } else if (isTransitioning && mesh.current) {
      mesh.current.position.lerp(targetPosition, 0.02);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.007, 16, 16]} />
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
};

const Particles = ({ stage }) => {
  const particles = [];
  const sphereRadius = 1;
  const spherePoints1 = useRef([]);
  const spherePoints3 = useRef([]);

  useEffect(() => {
    // Generate points for sphere1
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);
      spherePoints1.current.push(new THREE.Vector3(x, y, z));
    }

    // Generate points for sphere3 (1.2 times initial sphere1)
    for (let i = 0; i < 2000; i++) {
      spherePoints3.current.push(spherePoints1.current[i].clone().multiplyScalar(1.2));
    }
  }, []);

  const getTargetPosition = (i) => {
    if (stage === 1) {
      return spherePoints1.current[i];
    } else if (stage === 2) {
      return spherePoints3.current[i];
    }
  };

  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 2;
    particles.push(<Particle key={i} position={new THREE.Vector3(x, y, z)} targetPosition={getTargetPosition(i)} transition={stage !== 0} />);
  }

  return particles;
};

const Scene = ({ stage }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0.5, 0, 2.2); // Shift the camera to the left
  }, [camera]);

  useEffect(() => {
    console.log(`Stage: ${stage}`);
  }, [stage]);

  return (
    <>
      <ambientLight intensity={100} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <Particles stage={stage} />
    </>
  );
};

export default function App() {
  const [stage, setStage] = useState(0);
  const colors = ['rgb(233, 119, 36)', 'rgb(229, 180, 24)', 'rgb(92, 76, 133)']; // Colors for each stage

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage(1); // First stage: Initial sphere
    }, 4000);

    const timer2 = setTimeout(() => {
      setStage(2); // Third stage: Larger sphere
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      animate={{ backgroundColor: colors[stage] }}
      transition={{ duration: 2 }}
      style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Canvas style={{ background: 'transparent' }}>
        <Scene stage={stage} />
      </Canvas>
    </motion.div>
  );
}
