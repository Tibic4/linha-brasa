"use client";

import { useState, useMemo } from "react";
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
          <h2 className="font-bebas text-5xl md:text-7xl">
            QUANTO VOCÊ <span className="text-brasa-green">ECONOMIZA</span>?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8"
        >
          {/* Inputs */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                <p className="font-bebas text-2xl text-brasa-orange mt-2">
                  {poolSize.toLocaleString("pt-BR")}L
                </p>
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

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="font-mono text-xs text-red-400 mb-1">Custo mensal com {methodLabels[currentMethod]}</p>
              <p className="font-bebas text-4xl text-red-400">
                R$ {savings.currentMonthly.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-brasa-green/10 border border-brasa-green/20 rounded-xl p-6 text-center">
              <p className="font-mono text-xs text-brasa-green mb-1">Custo mensal com Linha Brasa</p>
              <p className="font-bebas text-4xl text-brasa-green">
                R$ {savings.brasaMonthly.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-brasa-gray">Economia mensal</p>
              <p className="font-bebas text-3xl text-brasa-gold">
                R$ {savings.monthlySaving.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-brasa-gray">Economia anual</p>
              <p className="font-bebas text-3xl text-brasa-green">
                R$ {savings.annualSaving.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-brasa-gray">Retorno do investimento</p>
              <p className="font-bebas text-3xl text-brasa-orange">
                {savings.paybackMonths} meses
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
