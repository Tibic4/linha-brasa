"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color: string;
}

function GSAPCounter({ end, suffix = "", prefix = "", label, color }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${Math.floor(obj.val).toLocaleString("pt-BR")}${suffix}`;
          }
        },
      });
    });
    return () => ctx.revert();
  }, [end, suffix, prefix]);

  return (
    <div className="text-center">
      <span ref={ref} className={`font-bebas text-5xl md:text-7xl tabular-nums ${color}`}>
        {prefix}0{suffix}
      </span>
      <p className="text-brasa-gray text-sm mt-2 font-mono">{label}</p>
    </div>
  );
}

export default function ProblemSection() {
  const cardsRef = useRef<HTMLDivElement>(null);

  // GSAP stagger entrance for problem cards
  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll("[data-problem-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-brasa-bg relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            O Problema
          </p>
          <h2 className="font-bebas text-3xl sm:text-5xl md:text-7xl">
            AQUECER PISCINA NO BRASIL
            <br />
            <span className="text-brasa-gray">É ABSURDAMENTE CARO</span>
          </h2>
        </motion.div>

        {/* GSAP Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <GSAPCounter end={850} prefix="R$ " label="Custo médio mensal a gás" color="text-red-500" />
          <GSAPCounter end={12} suffix=" meses" label="Sem uso no inverno" color="text-brasa-gold" />
          <GSAPCounter end={65} suffix="%" label="Desvalorização sem aquecimento" color="text-brasa-gold" />
          <GSAPCounter end={40} suffix=" mil" prefix="R$ " label="Investimento em solar" color="text-red-500" />
        </div>

        {/* GSAP stagger problem cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Gás Natural / GLP",
              problem: "R$ 600-1.200/mês",
              detail: "Custo operacional altíssimo que inviabiliza o uso frequente da piscina.",
              icon: "💸",
            },
            {
              title: "Aquecedor Solar",
              problem: "R$ 25.000-50.000",
              detail: "Investimento alto, depende do sol, ineficiente no inverno e dias nublados.",
              icon: "☁️",
            },
            {
              title: "Bomba de Calor",
              problem: "R$ 15.000-30.000",
              detail: "Consome muita energia elétrica. Lenta para aquecer em temperaturas baixas.",
              icon: "⚡",
            },
          ].map((item, i) => (
            <div
              key={i}
              data-problem-card
              className="glass-card rounded-xl p-6 border-red-500/20 hover:border-red-500/40 transition-all duration-300"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-bebas text-2xl mb-1">{item.title}</h3>
              <p className="text-red-400 font-mono text-lg mb-3">{item.problem}</p>
              <p className="text-brasa-gray text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
