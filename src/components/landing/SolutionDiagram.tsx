"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SolutionDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef as React.RefObject<Element>, { once: true, margin: "-100px" });
  const benefitsRef = useRef<HTMLDivElement>(null);

  // GSAP parallax on the watermark
  useEffect(() => {
    if (!benefitsRef.current) return;
    const cards = benefitsRef.current.querySelectorAll("[data-benefit]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // GSAP animate SVG paths with real stroke-dashoffset
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");
    const ctx = gsap.context(() => {
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          delay: i * 0.3,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
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
          className="text-center mb-16"
        >
          <p className="text-brasa-green font-mono text-sm tracking-[0.3em] uppercase mb-4">
            A Solução
          </p>
          <h2 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
            COMO A <span className="text-brasa-orange">LINHA BRASA</span> FUNCIONA
          </h2>
        </motion.div>

        {/* SVG Diagram — GSAP stroke-dashoffset animation */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <svg
            ref={svgRef}
            viewBox="0 0 900 300"
            className="w-full h-auto"
            fill="none"
          >
            {/* Flow paths connecting 5 nodes */}
            <path
              d="M 90 150 C 160 150, 200 80, 270 80 C 340 80, 360 150, 450 150"
              stroke="#FF4F00"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 450 150 C 540 150, 560 80, 630 80 C 700 80, 720 150, 810 150"
              stroke="#22C55E"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* 5 Nodes */}
            {[
              { x: 90, y: 150, label: "LENHA", sub: "Energia renovável", color: "#FFD166" },
              { x: 270, y: 80, label: "CÂMARA", sub: "Combustão eficiente", color: "#FF4F00" },
              { x: 450, y: 150, label: "SERPENTINA", sub: "Inox 304L", color: "#FF4F00" },
              { x: 630, y: 80, label: "ÁGUA QUENTE", sub: "Troca de calor", color: "#22C55E" },
              { x: 810, y: 150, label: "PISCINA", sub: "28°C o ano todo", color: "#22C55E" },
            ].map((node, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.25 }}
              >
                <circle cx={node.x} cy={node.y} r="35" fill="#1A2030" stroke={node.color} strokeWidth="2" />
                <text
                  x={node.x}
                  y={node.y - 5}
                  textAnchor="middle"
                  fill="#ECF0F8"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="var(--font-bebas)"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="7"
                  fontFamily="var(--font-dm-sans)"
                >
                  {node.sub}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Benefits Grid — GSAP stagger with bounce */}
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
