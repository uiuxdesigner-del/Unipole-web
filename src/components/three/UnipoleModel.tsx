"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface AssemblyStage {
  title: string;
  description: string;
  /** Scroll progress (0–1) at which this stage becomes active. */
  at: number;
}

/** Stage metadata shared by the assembly UI and the model's group progress ranges below. */
export const ASSEMBLY_STAGES: AssemblyStage[] = [
  { title: "Foundation", description: "The ground anchor settles into position.", at: 0 },
  { title: "Main Structure", description: "The primary pole rises and connects to the base.", at: 0.12 },
  { title: "Support System", description: "Structural braces lock the pole in place.", at: 0.3 },
  { title: "Display Frame", description: "The frame moves into position at the top.", at: 0.45 },
  { title: "Display Panel", description: "The billboard panel aligns within the frame.", at: 0.58 },
  { title: "Illumination", description: "Lighting fixtures attach and activate.", at: 0.7 },
  { title: "Campaign Surface", description: "The creative surface reveals on the panel.", at: 0.82 },
  { title: "Complete Unipole", description: "The structure settles into its final form.", at: 0.97 },
];

function smoothstep(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function localProgress(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return smoothstep((progress - start) / (end - start));
}

interface UnipoleModelProps {
  /** Mutable 0–1 progress read every frame (never a React prop) so scroll doesn't re-render. */
  progressRef: RefObject<number>;
  /** Scales exploded-offset distances — reduced on tablet/mobile. Defaults to 1 (desktop). */
  intensity?: number;
}

/**
 * Shared, reversible unipole model: seven mesh groups that slide in from an "exploded"
 * offset to their assembled position as `progressRef.current` rises 0→1, and reverse exactly
 * since the transform is a pure function of progress (no timeline, no one-shot animation).
 * Used at a fixed progress of 1 by the hero scene and driven by scroll in the assembly scene.
 */
export function UnipoleModel({ progressRef, intensity = 1 }: UnipoleModelProps) {
  const foundationRef = useRef<THREE.Group>(null!);
  const poleRef = useRef<THREE.Group>(null!);
  const supportRef = useRef<THREE.Group>(null!);
  const frameRef = useRef<THREE.Group>(null!);
  const panelRef = useRef<THREE.Group>(null!);
  const lightingRef = useRef<THREE.Group>(null!);
  const campaignMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const fixtureLightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const progress = progressRef.current;

    const apply = (
      group: THREE.Group,
      start: number,
      end: number,
      assembled: [number, number, number],
      offset: [number, number, number],
      rotationYFrom = 0
    ) => {
      const t = localProgress(progress, start, end);
      group.visible = progress >= start - 0.001;
      group.position.set(
        assembled[0] + offset[0] * intensity * (1 - t),
        assembled[1] + offset[1] * intensity * (1 - t),
        assembled[2] + offset[2] * intensity * (1 - t)
      );
      group.scale.setScalar(THREE.MathUtils.lerp(0.88, 1, t));
      group.rotation.y = rotationYFrom * (1 - t);
    };

    apply(foundationRef.current, 0, 0.12, [0, 0.15, 0], [0, -1.1, 0]);
    apply(poleRef.current, 0.12, 0.3, [0, 2.2, 0], [0, -2.6, 0]);
    apply(supportRef.current, 0.3, 0.45, [0, 1.7, 0.3], [0.9, -0.4, 0.9]);
    apply(frameRef.current, 0.45, 0.58, [0, 4.6, -0.08], [0, 1.1, -1.6], 0.35);
    apply(panelRef.current, 0.58, 0.7, [0, 4.6, 0], [0, 0, 1.9]);
    apply(lightingRef.current, 0.7, 0.82, [0, 4.6, 0.12], [0.7, 0.6, 0.7]);

    const campaignT = localProgress(progress, 0.82, 1);
    if (campaignMaterialRef.current) campaignMaterialRef.current.opacity = campaignT * 0.85;
    if (fixtureLightRef.current) {
      const lightT = localProgress(progress, 0.7, 0.82);
      fixtureLightRef.current.intensity = lightT * 0.6;
    }
  });

  return (
    <group>
      {/* Foundation */}
      <group ref={foundationRef}>
        <mesh>
          <boxGeometry args={[1.6, 0.3, 1.6]} />
          <meshStandardMaterial color="#242422" roughness={0.85} metalness={0.1} />
        </mesh>
      </group>

      {/* Main pole */}
      <group ref={poleRef}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.13, 4.4, 16]} />
          <meshStandardMaterial color="#2e2e2c" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Support braces */}
      <group ref={supportRef}>
        <mesh position={[0.3, -1.1, 0]} rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#3a3a37" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[-0.3, -1.1, 0]} rotation={[0, 0, -0.55]}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#3a3a37" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* Display frame */}
      <group ref={frameRef}>
        <mesh>
          <boxGeometry args={[2.7, 1.4, 0.1]} />
          <meshStandardMaterial color="#1c1c1a" roughness={0.6} metalness={0.35} />
        </mesh>
      </group>

      {/* Billboard panel */}
      <group ref={panelRef}>
        <mesh>
          <boxGeometry args={[2.6, 1.3, 0.06]} />
          <meshStandardMaterial color="#f2f1ee" roughness={0.75} metalness={0.05} />
        </mesh>
        {/* Campaign creative surface — opacity-revealed, not position-animated */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.5, 1.2]} />
          <meshBasicMaterial ref={campaignMaterialRef} color="#d71920" transparent opacity={0} />
        </mesh>
      </group>

      {/* Lighting fixtures */}
      <group ref={lightingRef}>
        <mesh position={[-1.2, 0.75, 0.15]}>
          <boxGeometry args={[0.14, 0.1, 0.14]} />
          <meshStandardMaterial color="#3a3a37" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[1.2, 0.75, 0.15]}>
          <boxGeometry args={[0.14, 0.1, 0.14]} />
          <meshStandardMaterial color="#3a3a37" roughness={0.5} metalness={0.5} />
        </mesh>
        <pointLight
          ref={fixtureLightRef}
          position={[0, 4.9, 0.6]}
          color="#fff4e8"
          intensity={0}
          distance={4}
        />
      </group>

      {/* Contact shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
