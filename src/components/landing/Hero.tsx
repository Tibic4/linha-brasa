"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import ColorMorph from "@/components/shared/ColorMorph";
import HeroVideoPlaceholder from "@/components/shared/HeroVideo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const [activeModel, setActiveModel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Auto-cycle models
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // GSAP parallax
  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
      gsap.to(contentRef.current, {
        yPercent: -15,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "20% top", end: "80% top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [videoError]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Video or Animated Placeholder */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-30 will-change-transform"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-fire-pool.mp4" type="video/mp4" />
        </video>
      ) : (
        <HeroVideoPlaceholder />
      )}

      {/* COLOR MORPHING */}
      <ColorMorph activeModel={activeModel} variant="hero" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg via-brasa-bg/40 to-brasa-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-brasa-bg/60 via-transparent to-transparent h-32" />

      {/* Embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brasa-orange/60"
            initial={{ x: `${Math.random() * 100}%`, y: "110%", opacity: 0 }}
            animate={{ y: "-10%", opacity: [0, 1, 0], x: `${Math.random() * 100}%` }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          />
        ))}
      </div>

      {/* Watermark */}
      <span className="watermark font-bebas top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        LINHA BRASA
      </span>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-brasa-orange/10 border border-brasa-orange/30 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 bg-brasa-orange rounded-full animate-pulse" />
          <span className="text-brasa-orange font-mono text-xs tracking-[0.2em] uppercase">
            Fabricação própria — Londrina/PR
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-bebas text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] mb-6"
        >
          AQUEÇA SUA
          <br />
          <span className="text-brasa-orange glow-text">PISCINA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-brasa-gray text-lg md:text-xl max-w-2xl mx-auto mb-4"
        >
          Caldeiras a lenha de alta performance.{" "}
          <span className="text-brasa-gold font-medium">Economize até 80%</span> comparado ao gás.
          Produto único no Brasil.
        </motion.p>

        {/* Model Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-2 md:gap-3 mb-8"
        >
          {products.map((product, i) => (
            <button
              key={product.id}
              onClick={() => setActiveModel(i)}
              className={`relative px-3 md:px-5 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-500 overflow-hidden ${
                activeModel === i
                  ? "text-white"
                  : "bg-brasa-bg-card/80 text-brasa-gray border border-brasa-border hover:border-brasa-orange/50"
              }`}
            >
              {activeModel === i && (
                <motion.div
                  layoutId="model-pill"
                  className="absolute inset-0 bg-brasa-orange glow-orange-sm rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{product.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Info Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel}
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="glass-card rounded-2xl p-5 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-bebas text-2xl text-brasa-orange">{products[activeModel].name}</p>
                <p className="text-brasa-gray text-xs font-mono">{products[activeModel].subtitle}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-brasa-gold text-lg">{products[activeModel].poolSize}</p>
                <p className="font-bebas text-2xl">R$ {products[activeModel].price.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <a href="/configurador" className="btn-brasa text-xl">
            CONFIGURAR MINHA CALDEIRA
          </a>
          <a
            href="#calculadora"
            className="px-8 py-4 font-bebas text-lg tracking-wider text-brasa-orange border-2 border-brasa-orange/50 rounded-lg hover:bg-brasa-orange/10 hover:border-brasa-orange transition-all duration-300 text-center backdrop-blur-sm"
          >
            CALCULAR ECONOMIA
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-brasa-gray/30 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 bg-brasa-orange rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
