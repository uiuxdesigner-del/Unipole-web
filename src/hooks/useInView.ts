"use client";

import { useEffect, useState, type RefObject } from "react";

/** Tracks whether `ref`'s element is intersecting the viewport — used to pause off-screen Canvas rendering. */
export function useInView<T extends HTMLElement>(ref: RefObject<T | null>): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "20% 0px",
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
