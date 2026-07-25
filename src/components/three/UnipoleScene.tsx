"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { UnipoleModel } from "@/components/three/UnipoleModel";

interface UnipoleSceneProps {
  /** Reduces geometry detail and disables antialiasing for phones. */
  simplified: boolean;
}

/** Very slow camera drift + a small, clamped mouse-follow offset. */
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

/** Fully assembled unipole (dynamically imported, client-only — see HeroVisual). */
export default function UnipoleScene({ simplified }: UnipoleSceneProps) {
  const progressRef = useRef(1);

  return (
    <Canvas
      dpr={[1, simplified ? 1.25 : 1.75]}
      gl={{ antialias: !simplified, alpha: true }}
      camera={{ position: [6, 3.4, 7], fov: 42 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 4]} intensity={0.7} color="#fff8f0" />
      <directionalLight position={[-4, 3, -3]} intensity={0.25} color="#ffffff" />
      <UnipoleModel progressRef={progressRef} intensity={simplified ? 0.6 : 1} />
      <CameraRig />
    </Canvas>
  );
}
