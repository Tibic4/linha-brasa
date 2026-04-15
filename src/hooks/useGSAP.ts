"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Detect mobile/touch devices for reduced-motion strategies */
const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Skip parallax on mobile — saves GPU/battery
    if (isMobile()) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 30,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const children = ref.current.querySelectorAll("[data-reveal]");
    if (!children.length) return;

    const ctx = gsap.context(() => {
      children.forEach((child, i) => {
        gsap.fromTo(
          child,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: child,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return ref;
}

export function useProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const bars = ref.current.querySelectorAll("[data-progress]");
    if (!bars.length) return;

    const ctx = gsap.context(() => {
      bars.forEach((bar) => {
        const target = (bar as HTMLElement).dataset.progress || "100";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return ref;
}

export function useCounterGSAP() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const counters = ref.current.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const ctx = gsap.context(() => {
      counters.forEach((el) => {
        const target = parseFloat((el as HTMLElement).dataset.count || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = Math.floor(obj.val).toLocaleString("pt-BR");
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return ref;
}
