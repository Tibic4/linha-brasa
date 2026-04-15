"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const comparisons = [
  { method: "GLP (Botijão)", monthly: 1200, color: "#EF4444", percent: 100 },
  { method: "Gás Natural", monthly: 850, color: "#F97316", percent: 71 },
  { method: "Bomba de Calor", monthly: 650, color: "#EAB308", percent: 54 },
  { method: "Aquecedor Solar", monthly: 180, color: "#3B82F6", percent: 15 },
  { method: "LINHA BRASA", monthly: 150, color: "#22C55E", percent: 12.5, highlight: true },
];

export default function CostComparison() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const bars = sectionRef.current.querySelectorAll("[data-bar]");
    const labels = sectionRef.current.querySelectorAll("[data-bar-label]");

    const ctx = gsap.context(() => {
      bars.forEach((bar, i) => {
        const target = (bar as HTMLElement).dataset.bar || "100";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.4,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Thermometer fill animation
      const thermo = sectionRef.current?.querySelector("[data-thermometer]");
      if (thermo) {
        gsap.fromTo(
          thermo,
          { height: "0%" },
          {
            height: "85%",
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: thermo,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      labels.forEach((label, i) => {
        gsap.fromTo(
          label,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: label,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-brasa-bg-light relative">
      <div className="max-w-5xl mx-auto" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Comparativo
          </p>
          <h2 className="font-bebas text-3xl sm:text-5xl md:text-7xl">
            CUSTO MENSAL <span className="text-brasa-gold">REAL</span>
          </h2>
          <p className="text-brasa-gray mt-4 max-w-xl mx-auto">
            Baseado em piscina de 20.000L mantida a 28°C durante o mês inteiro
          </p>
        </motion.div>

        <div className="flex gap-6 md:gap-10">
          {/* Thermometer Visual — GSAP scaleY animated */}
          <div className="hidden sm:flex flex-col items-center shrink-0 py-2">
            <span className="font-mono text-[10px] text-brasa-gray mb-2">R$/mês</span>
            <div className="relative w-8 h-full min-h-[260px] bg-brasa-bg rounded-full overflow-hidden border border-brasa-border">
              <div
                data-thermometer
                className="absolute bottom-0 left-0 right-0 rounded-full"
                style={{ height: 0, background: "linear-gradient(to top, #22C55E 0%, #EAB308 40%, #F97316 70%, #EF4444 100%)" }}
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-brasa-bg border border-brasa-border flex items-center justify-center -mt-1">
              <span className="text-sm">🌡️</span>
            </div>
            <span className="font-mono text-[10px] text-brasa-gray mt-1">CUSTO</span>
          </div>

          {/* Bars */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {comparisons.map((item) => (
              <div
                key={item.method}
                className={`flex items-center gap-3 sm:gap-4 ${item.highlight ? "scale-105 origin-left" : ""}`}
              >
                <div className="w-20 sm:w-24 md:w-44 text-right shrink-0" data-bar-label>
                  <p
                    className={`font-mono text-xs sm:text-sm ${
                      item.highlight ? "text-brasa-green font-bold" : "text-brasa-gray"
                    }`}
                  >
                    {item.method}
                  </p>
                </div>
                <div className="flex-1 h-8 sm:h-10 bg-brasa-bg rounded-lg overflow-hidden relative">
                  <div
                    data-bar={item.percent}
                    className="h-full rounded-lg flex items-center justify-end pr-2 sm:pr-3"
                    style={{ backgroundColor: item.color, width: 0 }}
                  >
                    <span className="font-mono text-xs sm:text-sm text-white font-bold whitespace-nowrap">
                      R$ {item.monthly}/mês
                    </span>
                  </div>
                  {item.highlight && (
                    <div className="absolute -right-2 -top-2 bg-brasa-green text-white text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.5 rounded-full animate-pulse">
                      MENOR CUSTO
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 glass-card rounded-xl p-6 text-center border-brasa-green/20"
        >
          <p className="font-bebas text-3xl">
            ECONOMIA ANUAL DE ATÉ{" "}
            <span className="text-brasa-green">R$ 12.600</span>
          </p>
          <p className="text-brasa-gray mt-2 font-mono text-sm">
            A caldeira se paga em menos de 12 meses
          </p>
        </motion.div>
      </div>
    </section>
  );
}
