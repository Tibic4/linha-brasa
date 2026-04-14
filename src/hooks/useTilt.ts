"use client";

import { useEffect, useRef } from "react";

export function useTilt(options?: {
  max?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;

    let tiltInstance: { destroy: () => void } | null = null;

    import("vanilla-tilt").then((VanillaTilt) => {
      if (!ref.current) return;
      VanillaTilt.default.init(ref.current, {
        max: options?.max ?? 8,
        speed: options?.speed ?? 400,
        glare: options?.glare ?? true,
        "max-glare": options?.maxGlare ?? 0.15,
        scale: options?.scale ?? 1.02,
        perspective: 1000,
      });
      tiltInstance = (ref.current as unknown as { vanillaTilt: { destroy: () => void } }).vanillaTilt;
    });

    return () => {
      tiltInstance?.destroy();
    };
  }, [options?.max, options?.speed, options?.glare, options?.maxGlare, options?.scale]);

  return ref;
}
