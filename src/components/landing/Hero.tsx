"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import HeroVideoPlaceholder from "@/components/shared/HeroVideo";
import ProductImage from "@/components/shared/ProductImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const [activeModel, setActiveModel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Mouse position for parallax (normalized -1 to 1)
  const mousePos = useRef({ x: 0, y: 0 });

  // Auto-cycle models
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax — move layers at different speeds
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mousePos.current = {
      x: (e.clientX / innerWidth - 0.5) * 2,
      y: (e.clientY / innerHeight - 0.5) * 2,
    };

    // Product layer — subtle movement
    if (productRef.current) {
      gsap.to(productRef.current, {
        x: mousePos.current.x * 15,
        y: mousePos.current.y * 10,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    // Embers layer — stronger movement (opposite direction for depth)
    if (embersRef.current) {
      gsap.to(embersRef.current, {
        x: mousePos.current.x * -25,
        y: mousePos.current.y * -15,
        duration: 1.2,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    // Skip parallax on touch devices — no hover, saves battery
    if (window.matchMedia("(hover: none)").matches) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // GSAP scroll parallax
  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
      }
      gsap.to(contentRef.current, {
        yPercent: -15,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "20% top", end: "80% top", scrub: true, invalidateOnRefresh: true },
      });
    });
    return () => ctx.revert();
  }, [videoError]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-28 md:pt-20"
    >
      {/* Layer 0: Video / Animated Placeholder */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-30 will-change-transform"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-fire-pool.mp4" type="video/mp4" />
        </video>
      ) : (
        <HeroVideoPlaceholder />
      )}

      {/* Layer 1: COLOR MORPHING — gradiente de fundo dissolve ao trocar modelo (Briefing Seção 01+05) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: products[activeModel].gradient }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ opacity: 0.35, mixBlendMode: "screen" }}
      />

      {/* Layer 2: Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg via-brasa-bg/40 to-brasa-bg/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-brasa-bg/60 via-transparent to-transparent h-32" />

      {/* Layer 3: Watermark Typography (pulsing scale) */}
      <span className="watermark font-bebas top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-watermark-pulse">
        BRASA
      </span>

      {/* Layer 4a: Embers DESFOCADAS — atrás do produto (briefing: partículas desfocadas → produto) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform z-[0]" style={{ filter: "blur(3px)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`blur-${i}`}
            className={`absolute rounded-full bg-brasa-orange/50 ${i % 2 === 0 ? "w-2 h-2" : "w-1.5 h-1.5"} hidden sm:block`}
            initial={{ x: `${Math.random() * 100}%`, y: "110%", opacity: 0 }}
            animate={{ y: "-10%", opacity: [0, 0.6, 0], x: `${Math.random() * 100}%` }}
            transition={{ duration: 5 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          />
        ))}
      </div>

      {/* Layer 5: Product Image — 'O Produto é o Herói' (briefing: >60% da tela, colossal) */}
      <div
        ref={productRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform z-[1]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel}
            initial={{ opacity: 0, scale: 0.85, y: 40, rotate: -3 }}
            animate={{ opacity: 0.85, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30, rotate: 3 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 1.2,
              opacity: { duration: 0.4 },
            }}
            className="w-[70vw] h-[45vh] sm:w-[50vw] sm:h-[65vh] max-w-[650px] max-h-[700px] relative isolate perspective-container"
            style={{ background: "radial-gradient(ellipse at center, rgba(20,20,20,0.6) 0%, transparent 70%)" }}
          >
            <ProductImage model={products[activeModel].id} size="lg" className="w-full h-full depth-layer depth-shadow" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layer 6a: Embers EM FOCO — na frente do produto (briefing: produto → partículas em foco → UI) */}
      <div ref={embersRef} className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform z-[2]">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`focus-${i}`}
            className={`absolute rounded-full bg-brasa-orange/70 ${i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1"} hidden sm:block`}
            initial={{ x: `${Math.random() * 100}%`, y: "110%", opacity: 0 }}
            animate={{ y: "-10%", opacity: [0, 0.9, 0], x: `${Math.random() * 100}%` }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          />
        ))}
      </div>

      {/* Layer 6: UI Content */}
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
          className="font-bebas text-3xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] mb-6"
        >
          AQUEÇA SUA
          <br />
          <span className="text-brasa-orange glow-text">PISCINA</span>
          <br />
          <span className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-brasa-gray leading-tight">
            POR <span className="text-brasa-gold">R$ 84</span>. COM LENHA. QUALQUER CLIMA.
          </span>
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

        {/* Model Selector with Clip Mask Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-1.5 xs:gap-2 md:gap-3 mb-6"
        >
          {products.map((product, i) => (
            <button
              key={product.id}
              onClick={() => setActiveModel(i)}
              className={`relative px-3 xs:px-4 md:px-5 py-2.5 min-h-[44px] rounded-full font-mono text-[10px] xs:text-xs tracking-wider transition-all duration-500 overflow-hidden ${
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

        {/* Info Card with Clip Mask Typography — name slides up/down on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              opacity: { duration: 0.25 },
            }}
            className="glass-card rounded-2xl p-5 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="text-left overflow-hidden">
                {/* Clip mask: name enters from below, exits upward */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`name-${activeModel}`}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, opacity: { duration: 0.2 } }}
                    className="font-bebas text-2xl text-brasa-orange"
                  >
                    {products[activeModel].name}
                  </motion.p>
                </AnimatePresence>
                <p className="text-brasa-gray text-xs font-mono">{products[activeModel].subtitle}</p>
              </div>
              <div className="text-right overflow-hidden">
                <p className="font-mono text-brasa-gold text-lg">{products[activeModel].poolSize}</p>
                {/* Price slides in too */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`price-${activeModel}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05, opacity: { duration: 0.2 } }}
                    className="font-bebas text-2xl"
                  >
                    R$ {products[activeModel].price.toLocaleString("pt-BR")}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-6 sm:mt-8 px-2 xs:px-0"
        >
          <a
            href="https://wa.me/5543999999999?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Brasa%20Forge."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brasa text-base sm:text-xl w-full sm:w-auto text-center gap-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.346 0-4.542-.658-6.413-1.797l-.448-.271-3.29 1.103 1.103-3.29-.271-.448A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            FALAR COM ESPECIALISTA
          </a>
          <a
            href="#modelos"
            className="px-8 py-4 font-bebas text-lg tracking-wider text-brasa-orange border-2 border-brasa-orange/50 rounded-lg hover:bg-brasa-orange/10 hover:border-brasa-orange transition-all duration-300 text-center backdrop-blur-sm w-full sm:w-auto"
          >
            VER MODELOS
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
