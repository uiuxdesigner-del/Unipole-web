"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface UnipoleSceneProps {
  /** Reduces geometry detail, drops the ground plane and disables antialiasing for phones. */
  simplified: boolean;
}

function UnipoleStructure({ simplified }: { simplified: boolean }) {
  return (
    <group>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 4.4, simplified ? 8 : 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.6, -0.06]}>
        <boxGeometry args={[2.7, 1.4, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.6} />
      </mesh>
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[2.6, 1.3, 0.08]} />
        <meshStandardMaterial color="#d71920" emissive="#d71920" emissiveIntensity={0.18} roughness={0.5} />
      </mesh>
    </group>
  );
}

function RoadPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0d0d0d" roughness={1} />
    </mesh>
  );
}

/** Very slow camera drift + a small, clamped mouse-follow offset. Skipped when mounted only for prefers-reduced-motion (see HeroVisual). */
function CameraRig() {
  const { camera, pointer } = useThree();
  const basePosition = useMemo(() => new THREE.Vector3(6, 3.4, 7), []);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta * 0.05;
    const drift = Math.sin(elapsed.current) * 0.4;
    const mouseX = THREE.MathUtils.clamp(pointer.x, -1, 1) * 0.3;
    const mouseY = THREE.MathUtils.clamp(pointer.y, -1, 1) * 0.15;
    camera.position.set(basePosition.x + drift + mouseX, basePosition.y + mouseY, basePosition.z);
    camera.lookAt(0, 2.6, 0);
  });

  return null;
}

/** Simplified single-pole unipole scene: dynamically imported, client-only (see HeroVisual). */
export default function UnipoleScene({ simplified }: UnipoleSceneProps) {
  return (
    <Canvas
      dpr={[1, simplified ? 1.25 : 1.75]}
      gl={{ antialias: !simplified }}
      camera={{ position: [6, 3.4, 7], fov: 42 }}
    >
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 8, 26]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} />
      <UnipoleStructure simplified={simplified} />
      {!simplified && <RoadPlane />}
      <CameraRig />
    </Canvas>
  );
}
