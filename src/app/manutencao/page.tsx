"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface MaintenanceItem {
  id: string;
  icon: string;
  title: string;
  frequency: string;
  description: string;
  order: number;
}

const frequencyColors: Record<string, { bg: string; text: string }> = {
  "Após cada uso": { bg: "bg-orange-500/20", text: "text-orange-400" },
  "Semanal": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  "Mensal": { bg: "bg-blue-500/20", text: "text-blue-400" },
  "Trimestral": { bg: "bg-purple-500/20", text: "text-purple-400" },
  "Semestral": { bg: "bg-green-500/20", text: "text-green-400" },
  "Anual": { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default function ManutencaoPage() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brasa-bg">
        {/* Hero Header */}
        <section className="section-padding relative overflow-hidden pt-32 md:pt-40">
          {/* Watermark */}
          <div className="watermark font-bebas top-1/2 left-1/2 animate-watermark-pulse">
            MANUTENÇÃO
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs tracking-widest text-brasa-orange uppercase mb-4"
            >
              Guia Completo
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-bebas text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider mb-4"
            >
              GUIA DE{" "}
              <span className="text-brasa-orange">MANUTENÇÃO</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-brasa-gray text-base xs:text-lg md:text-xl max-w-2xl mx-auto"
            >
              Mantenha sua caldeira em perfeito estado seguindo estas
              recomendações de manutenção preventiva.
            </motion.p>
          </div>
        </section>

        {/* Timeline / Steps */}
        <section className="section-padding pt-0">
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 xs:left-6 top-0 bottom-0 w-px bg-brasa-border hidden sm:block" />

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-brasa-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, i) => {
                  const colors = frequencyColors[item.frequency] || {
                    bg: "bg-gray-500/20",
                    text: "text-gray-400",
                  };

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative sm:pl-16"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-3.5 xs:left-4.5 top-6 w-3 h-3 rounded-full bg-brasa-orange border-2 border-brasa-bg hidden sm:block" />

                      <div className="glass-card rounded-xl p-5 xs:p-6 hover:border-brasa-orange/30 transition-colors duration-300">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="text-3xl xs:text-4xl flex-shrink-0 mt-0.5">
                            {item.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title + Badge */}
                            <div className="flex flex-wrap items-center gap-2 xs:gap-3 mb-2">
                              <h3 className="font-bebas text-xl xs:text-2xl tracking-wide text-brasa-white">
                                {item.title}
                              </h3>
                              <span
                                className={`${colors.bg} ${colors.text} text-[10px] xs:text-xs font-mono px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`}
                              >
                                {item.frequency}
                              </span>
                            </div>

                            <p className="text-brasa-gray text-sm xs:text-base leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto glass-card rounded-2xl p-8 xs:p-10 text-center"
          >
            <h2 className="font-bebas text-3xl xs:text-4xl tracking-wider mb-3">
              DÚVIDAS SOBRE <span className="text-brasa-orange">MANUTENÇÃO</span>?
            </h2>
            <p className="text-brasa-gray mb-6 text-sm xs:text-base">
              Fale com nossa equipe técnica ou configure sua caldeira ideal.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5543999999999?text=Olá! Tenho dúvidas sobre manutenção da caldeira."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brasa !bg-green-600 hover:!shadow-[0_0_30px_rgba(34,197,94,0.5)]"
              >
                WHATSAPP
              </a>
              <a href="/configurador" className="btn-brasa">
                CONFIGURAR CALDEIRA
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
