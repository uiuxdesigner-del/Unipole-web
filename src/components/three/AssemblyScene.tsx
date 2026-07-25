"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { UnipoleModel } from "@/components/three/UnipoleModel";

interface AssemblySceneProps {
  progressRef: RefObject<number>;
  intensity: number;
  simplified: boolean;
  /** "never" pauses the render loop entirely while the canvas is off-screen. */
  frameloop: "always" | "demand" | "never";
}

/** Camera stays mostly stable; only a very small controlled dolly as the sequence completes. */
function AssemblyCameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const base = useRef(new THREE.Vector3(6.5, 3.2, 7.5));

  useFrame(() => {
    const settle = THREE.MathUtils.smoothstep(progressRef.current, 0.9, 1);
    camera.position.set(base.current.x - settle * 0.6, base.current.y, base.current.z - settle * 0.5);
    camera.lookAt(0, 2.6, 0);
  });

  return null;
}

/** Reversible assembly scene — dynamically imported, client-only (see UnipoleAssemblySection). */
export default function AssemblyScene({
  progressRef,
  intensity,
  simplified,
  frameloop,
}: AssemblySceneProps) {
  return (
    <Canvas
      dpr={[1, simplified ? 1.25 : 1.75]}
      gl={{ antialias: !simplified, alpha: true }}
      camera={{ position: [6.5, 3.2, 7.5], fov: 40 }}
      frameloop={frameloop}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[5, 8, 4]} intensity={0.65} color="#fff8f0" />
      <directionalLight position={[-4, 3, -3]} intensity={0.25} color="#ffffff" />
      <UnipoleModel progressRef={progressRef} intensity={intensity} />
      <AssemblyCameraRig progressRef={progressRef} />
    </Canvas>
  );
}
