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
          <h2 className="font-bebas text-5xl md:text-7xl">
            COMO A <span className="text-brasa-orange">LINHA BRASA</span> FUNCIONA
          </h2>
        </motion.div>

        {/* SVG Diagram — GSAP stroke-dashoffset animation */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <svg
            ref={svgRef}
            viewBox="0 0 800 300"
            className="w-full h-auto"
            fill="none"
          >
            {/* Top flow path */}
            <path
              d="M 100 150 C 200 150, 250 80, 400 80 C 550 80, 600 150, 700 150"
              stroke="#FF4F00"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Bottom flow path */}
            <path
              d="M 100 150 C 200 150, 250 220, 400 220 C 550 220, 600 150, 700 150"
              stroke="#22C55E"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Nodes */}
            {[
              { x: 100, y: 150, label: "LENHA", sub: "Energia renovável", color: "#FFD166" },
              { x: 400, y: 80, label: "CALDEIRA BRASA", sub: "Combustão eficiente", color: "#FF4F00" },
              { x: 400, y: 220, label: "SERPENTINA", sub: "Troca de calor", color: "#22C55E" },
              { x: 700, y: 150, label: "PISCINA QUENTE", sub: "28°C o ano todo", color: "#FF4F00" },
            ].map((node, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.3 }}
              >
                <circle cx={node.x} cy={node.y} r="35" fill="#111827" stroke={node.color} strokeWidth="2" />
                <text
                  x={node.x}
                  y={node.y - 5}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="9"
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
        <div ref={benefitsRef} className="grid md:grid-cols-4 gap-6">
          {[
            { value: "80%", label: "Economia vs gás", icon: "💰" },
            { value: "4h", label: "Tempo de aquecimento", icon: "⏱️" },
            { value: "365", label: "Dias por ano", icon: "📅" },
            { value: "R$5", label: "Custo diário médio", icon: "🔥" },
          ].map((item, i) => (
            <div
              key={i}
              data-benefit
              className="glass-card rounded-xl p-6 text-center hover:border-brasa-green/40 transition-colors duration-300"
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <p className="font-bebas text-4xl text-brasa-green">{item.value}</p>
              <p className="text-brasa-gray text-sm mt-1 font-mono">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
