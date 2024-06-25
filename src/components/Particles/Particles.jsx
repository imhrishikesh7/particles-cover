import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Particle = ({ position }) => {
  const mesh = useRef();
  const initialPosition = useRef(position.clone());

  useFrame((state) => {
    if (mesh.current) {
      const { mouse } = state;
      const mouseVector = new THREE.Vector3(mouse.x, mouse.y, 0);

      // Move slightly towards the mouse but remain close to the initial position
      const directionToMouse = mouseVector.clone().sub(mesh.current.position).normalize();
      const distanceToMouse = mesh.current.position.distanceTo(mouseVector);
      const force = Math.min(0.002 / distanceToMouse, 0.002);

      // Ensure the particle doesn't stray too far from its initial position
      const maxDisplacement = 0.1;
      const displacement = mesh.current.position.clone().sub(initialPosition.current);
      if (displacement.length() > maxDisplacement) {
        mesh.current.position.sub(displacement.normalize().multiplyScalar(force));
      } else {
        mesh.current.position.add(directionToMouse.multiplyScalar(force));
      }
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.007, 16, 16]} /> {/* Adjusted particle size here */}
      <meshStandardMaterial color={'#ffffff'} />
    </mesh>
  );
};

const Particles = () => {
  const particles = [];

  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 2;
    particles.push(<Particle key={i} position={new THREE.Vector3(x, y, z)} />);
  }

  return particles;
};

const Scene = () => {
  const { camera } = useThree();
  camera.position.z = 2.2; // Ensure camera position is maintained

  return (
    <>
      <ambientLight intensity={100} /> {/* Reduce ambient light intensity */}
      <pointLight position={[5, 5, 5]} intensity={1} /> {/* Increase point light intensity */}
      <Particles />
    </>
  );
};

export default function App() {
  return (
    <Canvas style={{ background: '#e87625' }}>
      <Scene />
    </Canvas>
  );
}
