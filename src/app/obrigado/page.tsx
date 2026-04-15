"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { trackPurchase } from "@/components/shared/AnalyticsEvents";

export default function Obrigado() {
  useEffect(() => {
    // Confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF4F00", "#FFD166", "#22C55E"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF4F00", "#FFD166", "#22C55E"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Track purchase
    trackPurchase(14500);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-brasa-bg px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center max-w-lg"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-8xl mb-6"
          >
            🔥
          </motion.div>

          <h1 className="font-bebas text-6xl md:text-8xl mb-4">
            <span className="text-brasa-orange">OBRIGADO</span>!
          </h1>

          <p className="text-brasa-gray text-lg mb-8">
            Sua compra foi realizada com sucesso. Em breve entraremos em contato
            para confirmar os detalhes da entrega e instalação.
          </p>

          <div className="glass-card rounded-xl p-6 mb-8">
            <p className="font-mono text-xs text-brasa-gray mb-2">Próximos passos:</p>
            <ul className="space-y-2 text-left">
              {[
                "Você receberá um e-mail de confirmação",
                "Nossa equipe entrará em contato em até 24h",
                "Agendaremos a entrega e instalação",
                "Sua piscina estará quente em breve!",
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-brasa-gray text-sm">
                  <span className="w-6 h-6 rounded-full bg-brasa-orange/20 text-brasa-orange font-mono text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className="btn-brasa">
              VOLTAR AO INÍCIO
            </a>
            <a
              href={`https://wa.me/5543999999999?text=${encodeURIComponent("Acabei de fazer minha compra! 🔥")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-bebas text-lg tracking-wider text-brasa-green border-2 border-brasa-green rounded-lg hover:bg-brasa-green/10 transition-all"
            >
              FALAR NO WHATSAPP
            </a>
          </div>
        </motion.div>
      </main>
    </>
  );
}
