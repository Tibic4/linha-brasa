"use client";

/**
 * Placeholder animado para o vídeo do hero.
 * Quando o vídeo real estiver disponível, basta colocar em /public/videos/hero-fire-pool.mp4
 * e o componente <video> no Hero.tsx vai carregar automaticamente.
 *
 * Este componente renderiza um fundo atmosférico animado com:
 * - Gradientes simulando fogo/brasa
 * - Partículas de luz flutuando
 * - Efeito de "água" na parte inferior
 */

import { motion } from "framer-motion";

export default function HeroVideoPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base dark */}
      <div className="absolute inset-0 bg-brasa-bg" />

      {/* Fire glow — top center */}
      <motion.div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,79,0,0.25) 0%, rgba(255,79,0,0) 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary warm glow */}
      <motion.div
        className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,209,102,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pool water effect — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background: "linear-gradient(to top, rgba(14,116,144,0.15) 0%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute bottom-[5%] left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(14,116,144,0.3) 50%, transparent 100%)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating light particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            background: i % 2 === 0 ? "#FF4F00" : "#FFD166",
            filter: "blur(1px)",
          }}
          animate={{
            y: ["80vh", "10vh"],
            opacity: [0, 0.8, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * 30, 0],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}
