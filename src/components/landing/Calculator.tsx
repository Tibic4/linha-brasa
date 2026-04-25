"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const costs: Record<string, number> = {
  "glp": 0.06,
  "gas-natural": 0.042,
  "bomba-calor": 0.033,
  "eletrico": 0.08,
};

const methodLabels: Record<string, string> = {
  "glp": "GLP (Botijão)",
  "gas-natural": "Gás Natural",
  "bomba-calor": "Bomba de Calor",
  "eletrico": "Elétrico",
};

function AnimatedValue({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!ref.current) return;
    const start = prevValue.current;
    const end = value;
    prevValue.current = value;
    if (start === end) return;

    const duration = 600;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (ref.current) {
        ref.current.textContent = `${prefix}${current.toLocaleString("pt-BR")}${suffix}`;
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, prefix, suffix]);

  return (
    <p ref={ref} className={className}>
      {prefix}{Math.round(value).toLocaleString("pt-BR")}{suffix}
    </p>
  );
}

export default function Calculator() {
  const [poolSize, setPoolSize] = useState(20000);
  const [currentMethod, setCurrentMethod] = useState("gas-natural");
  const [monthsPerYear, setMonthsPerYear] = useState(8);

  const savings = useMemo(() => {
    const currentCostPerLiter = costs[currentMethod] || 0.042;
    const brasaCostPerLiter = 0.0075;
    const monthlyCurrentCost = poolSize * currentCostPerLiter;
    const monthlyBrasaCost = poolSize * brasaCostPerLiter;
    const monthlySaving = monthlyCurrentCost - monthlyBrasaCost;
    const annualSaving = monthlySaving * monthsPerYear;
    const paybackMonths = Math.ceil(14500 / monthlySaving);

    return {
      currentMonthly: monthlyCurrentCost,
      brasaMonthly: monthlyBrasaCost,
      monthlySaving,
      annualSaving,
      paybackMonths,
    };
  }, [poolSize, currentMethod, monthsPerYear]);

  return (
    <section id="calculadora" className="section-padding bg-brasa-bg relative">
      <span className="watermark font-bebas top-10 left-10">ECONOMIA</span>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brasa-green font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Calculadora
          </p>
          <h2 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
            QUANTO VOCÊ <span className="text-brasa-green">ECONOMIZA</span>?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-8"
        >
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div>
              <label className="font-mono text-xs text-brasa-gray block mb-2">
                VOLUME DA PISCINA
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={1000}
                  value={poolSize}
                  onChange={(e) => setPoolSize(Number(e.target.value))}
                  className="w-full accent-brasa-orange"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min={5000}
                    max={60000}
                    step={1000}
                    value={poolSize}
                    onChange={(e) => setPoolSize(Math.min(60000, Math.max(5000, Number(e.target.value))))}
                    className="w-28 bg-brasa-bg border border-brasa-border rounded-lg px-3 py-1 text-brasa-orange font-bebas text-2xl focus:border-brasa-orange outline-none"
                  />
                  <span className="text-brasa-orange font-bebas text-2xl">L</span>
                </div>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-brasa-gray block mb-2">
                MÉTODO ATUAL
              </label>
              <select
                value={currentMethod}
                onChange={(e) => setCurrentMethod(e.target.value)}
                className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none"
              >
                {Object.entries(methodLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-xs text-brasa-gray block mb-2">
                MESES DE USO/ANO
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={monthsPerYear}
                  onChange={(e) => setMonthsPerYear(Number(e.target.value))}
                  className="w-full accent-brasa-orange"
                />
                <p className="font-bebas text-2xl text-brasa-orange mt-2">
                  {monthsPerYear} meses
                </p>
              </div>
            </div>
          </div>

          {/* Results with glow */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="font-mono text-xs text-red-400 mb-1">Custo mensal com {methodLabels[currentMethod]}</p>
              <AnimatedValue value={savings.currentMonthly} prefix="R$ " className="font-bebas text-2xl xs:text-4xl text-red-400" />
            </div>
            <div className="bg-brasa-green/10 border border-brasa-green/20 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(255,79,0,0.12)]">
              <p className="font-mono text-xs text-brasa-green mb-1">Custo mensal com Brasa Forge</p>
              <AnimatedValue value={savings.brasaMonthly} prefix="R$ " className="font-bebas text-2xl xs:text-4xl text-brasa-green" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-brasa-gray">Economia mensal</p>
              <AnimatedValue value={savings.monthlySaving} prefix="R$ " className="font-bebas text-2xl xs:text-3xl text-brasa-gold" />
            </div>
            <div className="glass-card rounded-xl p-4 text-center shadow-[0_0_25px_rgba(255,79,0,0.15)]">
              <p className="font-mono text-xs text-brasa-gray">Economia anual</p>
              <AnimatedValue value={savings.annualSaving} prefix="R$ " className="font-bebas text-2xl xs:text-3xl text-brasa-green" />
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-brasa-gray">Retorno do investimento</p>
              <AnimatedValue value={savings.paybackMonths} suffix=" meses" className="font-bebas text-2xl xs:text-3xl text-brasa-orange" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
