/** Shared timing/easing constants so section components stay visually consistent. */
export const motionConfig = {
  ease: {
    out: "power3.out",
    outStrong: "power4.out",
    outExpo: "expo.out",
    inOut: "power2.inOut",
  },
  duration: {
    reveal: 1.1,
    revealShort: 0.8,
    revealLong: 1.4,
    fade: 0.9,
  },
  stagger: {
    tight: 0.06,
    normal: 0.1,
    loose: 0.16,
  },
  parallax: {
    background: 0.5,
    main: 0.9,
    foreground: 1.1,
    typography: 1.05,
  },
  atmosphere: {
    minDuration: 20,
    maxDuration: 40,
  },
} as const;
