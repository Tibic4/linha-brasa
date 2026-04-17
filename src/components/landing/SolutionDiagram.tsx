"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const NODES = [
  {
    x: 90, y: 140, label: "LENHA", sub: "Energia renovável", color: "#FFD166", glow: "#FFD16640",
    icon: (
      <path d="M-8-6 L0-10 L8-6 L6 2 L-6 2Z M-4 2 L-2 8 L2 8 L4 2" stroke="#FFD166" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    x: 270, y: 70, label: "CÂMARA", sub: "Combustão eficiente", color: "#FF4F00", glow: "#FF4F0040",
    icon: (
      <path d="M0-10 C2-6 6-4 6 0 C6 4 2 8 0 10 C-2 8-6 4-6 0 C-6-4-2-6 0-10Z M-2-4 C0-2 2-2 2 0 C2 2 0 4 0 4" stroke="#FF4F00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
  },
  {
    x: 450, y: 140, label: "SERPENTINA", sub: "Inox 304L", color: "#FF4F00", glow: "#FF4F0040",
    icon: (
      <path d="M-6-8 C6-8 6-3 -2-3 C-8-3 8 2 -2 2 C-8 2 6 7 6 7" stroke="#FF4F00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
  },
  {
    x: 630, y: 70, label: "ÁGUA QUENTE", sub: "Troca de calor", color: "#22C55E", glow: "#22C55E40",
    icon: (
      <path d="M0-10 C0-10 6 0 6 4 C6 8 3 10 0 10 C-3 10-6 8-6 4 C-6 0 0-10 0-10Z M-2 4 C-2 6 2 6 2 4" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ),
  },
  {
    x: 810, y: 140, label: "PISCINA", sub: "28°C o ano todo", color: "#22C55E", glow: "#22C55E40",
    icon: (
      <>
        <path d="M-8 0 C-5-3 -2 3 1 0 C4-3 7 3 8 0" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M-8 5 C-5 2 -2 8 1 5 C4 2 7 8 8 5" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      </>
    ),
  },
];

const MOBILE_NODES = NODES.map(({ label, sub, color, glow, icon }) => ({ label, sub, color, glow, icon }));

export default function SolutionDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef as React.RefObject<Element>, { once: true, margin: "-100px" });
  const benefitsRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileInView = useInView(mobileRef as React.RefObject<Element>, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!benefitsRef.current) return;
    const cards = benefitsRef.current.querySelectorAll("[data-benefit]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.7)",
          scrollTrigger: { trigger: benefitsRef.current, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("[data-flow-path]");
    const ctx = gsap.context(() => {
      paths.forEach((path, i) => {
        const el = path as SVGPathElement;
        const length = el.getTotalLength();
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(el, {
          strokeDashoffset: 0, duration: 2, delay: i * 0.3, ease: "power2.inOut",
          scrollTrigger: { trigger: svgRef.current, start: "top 75%", toggleActions: "play none none none" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  // Animated energy dot along paths
  useEffect(() => {
    if (!svgRef.current) return;
    const dots = svgRef.current.querySelectorAll("[data-energy-dot]");
    const paths = svgRef.current.querySelectorAll("[data-flow-path]");
    if (!dots.length || !paths.length) return;

    const ctx = gsap.context(() => {
      dots.forEach((dot, i) => {
        const pathEl = paths[i] as SVGPathElement;
        if (!pathEl) return;
        const length = pathEl.getTotalLength();

        gsap.to(dot, {
          motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5] },
          duration: 3,
          repeat: -1,
          ease: "none",
          delay: 3 + i * 0.5,
        });

        gsap.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 3 + i * 0.5 });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-brasa-bg-light relative overflow-hidden">
      <span className="watermark font-bebas top-10 left-10">SOLUÇÃO</span>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="text-brasa-green font-mono text-sm tracking-[0.3em] uppercase mb-4">
            A Solução
          </p>
          <h2 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
            COMO A <span className="text-brasa-orange">LINHA BRASA</span> FUNCIONA
          </h2>
        </motion.div>

        {/* DESKTOP SVG */}
        <div className="relative max-w-5xl mx-auto mb-10 hidden md:block">
          <svg
            ref={svgRef}
            viewBox="0 0 900 280"
            className="w-full h-auto"
            fill="none"
          >
            <defs>
              {NODES.map((node, i) => (
                <radialGradient key={`grad-${i}`} id={`nodeGrad${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={node.color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1A2030" stopOpacity="1" />
                </radialGradient>
              ))}
              {NODES.map((node, i) => (
                <filter key={`glow-${i}`} id={`glow${i}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feFlood floodColor={node.color} floodOpacity="0.4" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Flow paths */}
            <path
              data-flow-path
              d="M 90 140 C 170 140, 200 70, 270 70 C 340 70, 370 140, 450 140"
              stroke="#FF4F00"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              data-flow-path
              d="M 450 140 C 530 140, 560 70, 630 70 C 700 70, 730 140, 810 140"
              stroke="#22C55E"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Energy dots */}
            <circle data-energy-dot r="5" fill="#FF4F00" opacity="0">
              <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle data-energy-dot r="5" fill="#22C55E" opacity="0">
              <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
            </circle>

            {/* Nodes */}
            {NODES.map((node, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.25 }}
              >
                {/* Outer glow ring */}
                <circle cx={node.x} cy={node.y} r="52" fill="none" stroke={node.color} strokeWidth="1" opacity="0.2">
                  <animate attributeName="r" values="50;54;50" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Main circle with gradient */}
                <circle
                  cx={node.x} cy={node.y} r="46"
                  fill={`url(#nodeGrad${i})`}
                  stroke={node.color}
                  strokeWidth="2.5"
                  filter={`url(#glow${i})`}
                />

                {/* Icon */}
                <g transform={`translate(${node.x}, ${node.y - 10})`}>
                  {node.icon}
                </g>

                {/* Label */}
                <text
                  x={node.x} y={node.y + 12}
                  textAnchor="middle"
                  fill="#ECF0F8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="var(--font-bebas)"
                  letterSpacing="1.5"
                >
                  {node.label}
                </text>
                <text
                  x={node.x} y={node.y + 25}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="var(--font-dm-sans)"
                >
                  {node.sub}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* MOBILE — vertical journey cards */}
        <div ref={mobileRef} className="md:hidden mb-8 max-w-sm mx-auto px-4">
          {MOBILE_NODES.map((node, i) => (
            <div key={i} className="relative">
              {/* Gradient connector line */}
              {i < 4 && (
                <div className="absolute left-7 top-[72px] w-[2px] h-8 overflow-hidden z-0"
                  style={{ background: `linear-gradient(to bottom, ${node.color}50, ${MOBILE_NODES[i + 1]?.color ?? node.color}50)` }}
                >
                  <motion.div
                    className="w-full h-3 rounded-full absolute"
                    style={{ background: node.color, filter: `drop-shadow(0 0 4px ${node.color})` }}
                    animate={{ top: ["-12px", "32px"] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: "linear" }}
                  />
                </div>
              )}

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
                animate={mobileInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex items-center gap-3 rounded-xl p-3 border border-white/[0.06]"
                style={{
                  background: `linear-gradient(135deg, ${node.color}08 0%, rgba(26,32,48,0.6) 100%)`,
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 0 20px ${node.color}10`,
                }}
              >
                {/* Step number */}
                <span
                  className="absolute -top-2 -left-1 font-bebas text-xs px-1.5 py-0.5 rounded"
                  style={{ background: node.color, color: "#0F1520" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon circle with glow */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${node.color}20 0%, #1A2030 70%)`,
                    border: `2px solid ${node.color}`,
                    boxShadow: `0 0 15px ${node.glow}, inset 0 0 10px ${node.glow}`,
                  }}
                >
                  <svg width="24" height="24" viewBox="-12 -12 24 24" fill="none">
                    {node.icon}
                  </svg>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-bebas text-lg tracking-wider leading-tight" style={{ color: node.color }}>
                    {node.label}
                  </p>
                  <p className="text-brasa-gray text-xs font-mono">{node.sub}</p>
                </div>

                {/* Arrow hint for flow */}
                {i < 4 && (
                  <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 opacity-30">
                    <path d="M8 2 L8 14 M4 10 L8 14 L12 10" stroke={node.color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </motion.div>

              {/* Spacer for connector */}
              {i < 4 && <div className="h-8" />}
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { value: "13h", label: "Para aquecer 60.000L", icon: "⏱️" },
            { value: "R$84", label: "Por aquecimento completo", icon: "💰" },
            { value: "365", label: "Independe do clima", icon: "🔥" },
          ].map((item, i) => (
            <div
              key={i}
              data-benefit
              className="glass-card rounded-xl p-6 text-center hover:border-brasa-green/40 transition-all duration-300"
              style={{ transformStyle: "preserve-3d" }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg)";
              }}
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <p className="font-bebas text-3xl xs:text-4xl text-brasa-green">{item.value}</p>
              <p className="text-brasa-gray text-sm mt-1 font-mono">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
