"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once. Call from any Client Component before use. */
export function registerGsap() {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
