"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingScreen — splash que cobre a tela ENQUANTO o documento ainda está
 * carregando. Some assim que `document.readyState === "complete"`.
 *
 * Antes era um setTimeout(500) artificial que custava ~500ms de LCP no
 * Lighthouse. Agora segue o sinal real do browser, e em conexões rápidas
 * desaparece quase instantâneo.
 */
export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }

    const onReady = () => setLoading(false);
    window.addEventListener("load", onReady, { once: true });

    // Safety net: garante que o splash some mesmo se algum recurso travar.
    const safety = setTimeout(() => setLoading(false), 3000);

    return () => {
      window.removeEventListener("load", onReady);
      clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-brasa-bg flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-brasa-orange rounded-2xl flex items-center justify-center mx-auto glow-orange">
              <span className="font-bebas text-4xl text-white">B</span>
            </div>
            <p className="font-bebas text-3xl tracking-[0.2em] mt-6">
              BRASA <span className="text-brasa-orange">FORGE</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
