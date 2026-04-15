"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import ProductImage from "@/components/shared/ProductImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TiltCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") return;
    let instance: { destroy: () => void } | null = null;

    import("vanilla-tilt").then((VanillaTilt) => {
      if (!ref.current) return;
      VanillaTilt.default.init(ref.current, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.03,
        perspective: 1000,
      });
      instance = (ref.current as unknown as { vanillaTilt: { destroy: () => void } }).vanillaTilt;
    });

    return () => instance?.destroy();
  }, []);

  return (
    <div ref={ref} className={className} onClick={onClick}>
      {children}
    </div>
  );
}

// Layout transition — spring for natural feel
const layoutTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 1,
};

export default function ModelsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = products.find((p) => p.id === selectedId);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll("[data-model-card]");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,

            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding bg-brasa-bg relative overflow-hidden">
      <span className="watermark font-bebas top-10 right-10">MODELOS</span>

      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Nossos Modelos
          </p>
          <h2 className="font-bebas text-5xl md:text-7xl">
            ESCOLHA SUA <span className="text-brasa-orange">BRASA</span>
          </h2>
          <p className="text-brasa-gray mt-3 max-w-lg mx-auto">
            4 modelos projetados para cada tamanho de piscina. Clique para ver detalhes.
          </p>
        </motion.div>

        {/* Cards Grid — LayoutGroup syncs all shared layoutId transitions */}
        <LayoutGroup>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <TiltCard
                key={product.id}
                className="cursor-pointer"
                onClick={() => setSelectedId(product.id)}
              >
                <motion.div
                  data-model-card
                  layout
                  layoutId={`card-${product.id}`}
                  transition={{
                    layout: layoutTransition,
                    opacity: { duration: 0.2 },
                  }}
                  className="glass-card p-6 hover:border-brasa-orange/50 transition-colors duration-300 group h-full"
                  style={{ borderRadius: 16 }}
                >
                  {/* Product Image — layout="position" avoids aspect ratio distortion */}
                  <div className="relative mb-4 sm:mb-6 perspective-container">
                    <motion.div
                      layout="position"
                      className="w-full h-24 sm:h-32 md:h-48 relative overflow-hidden"
                      style={{ borderRadius: 12, background: product.gradient }}
                    >
                      <ProductImage model={product.id} className="absolute inset-0 depth-layer depth-shadow" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg-card/60 to-transparent" />
                      <motion.div layout="position" className="absolute bottom-3 left-3">
                        <span className="font-mono text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                          {product.power}
                        </span>
                      </motion.div>
                    </motion.div>
                    {i === 1 && (
                      <span className="absolute -top-2 -right-2 font-mono text-[10px] sm:text-xs text-brasa-bg bg-brasa-gold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold whitespace-nowrap z-10">
                        MAIS VENDIDA
                      </span>
                    )}
                  </div>

                  {/* Title — shared layoutId for seamless card→modal */}
                  <motion.div layout="position" layoutId={`title-${product.id}`}>
                    <h3 className="font-bebas text-xl sm:text-2xl md:text-3xl text-brasa-orange">{product.name}</h3>
                  </motion.div>
                  <motion.p layout="position" className="text-brasa-gray text-sm mb-1">{product.subtitle}</motion.p>
                  <motion.p layout="position" className="font-mono text-brasa-gold text-sm mb-3">{product.poolSize}</motion.p>

                  <motion.div layout="position" className="border-t border-brasa-border pt-3 mt-auto">
                    <p className="font-bebas text-xl sm:text-2xl md:text-3xl text-brasa-white">
                      R$ {product.price.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-brasa-gray text-xs font-mono">
                      12x de R$ {Math.ceil(product.price / 12).toLocaleString("pt-BR")} s/ juros
                    </p>
                  </motion.div>

                  <motion.div layout="position" className="mt-4 w-full text-center py-2.5 bg-brasa-orange/10 text-brasa-orange font-mono text-sm group-hover:bg-brasa-orange group-hover:text-white transition-all duration-300" style={{ borderRadius: 8 }}>
                    Ver detalhes →
                  </motion.div>
                </motion.div>
              </TiltCard>
            ))}
          </div>

          {/* Expanded Card Modal — shared layout from card */}
          <AnimatePresence>
            {selectedId && selectedProduct && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                  onClick={() => setSelectedId(null)}
                />
                <motion.div
                  layoutRoot
                  className="fixed inset-0 top-16 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                  style={{ position: "fixed" }}
                  onClick={() => setSelectedId(null)}
                >
                  <motion.div
                    layout
                    layoutId={`card-${selectedId}`}
                    transition={{
                      layout: layoutTransition,
                      opacity: { duration: 0.2 },
                    }}
                    className="bg-brasa-bg-card border border-brasa-border w-full max-h-[100vh] sm:max-h-[85vh] sm:max-w-4xl overflow-y-auto relative"
                    style={{ borderRadius: 16 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left — Image */}
                      <motion.div
                        layout="position"
                        className="w-full md:w-[320px] shrink-0 relative overflow-hidden flex items-center justify-center p-6 md:p-8 max-h-[35vh] md:max-h-none"
                        style={{ borderRadius: "16px 16px 0 0", background: selectedProduct.gradient }}
                      >
                        <ProductImage model={selectedProduct.id} size="md" className="relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </motion.div>

                      {/* Right — Info */}
                      <div className="flex-1 p-6 md:p-8">
                        {/* Title */}
                        <motion.div layout="position" layoutId={`title-${selectedId}`}>
                          <h3 className="font-bebas text-4xl sm:text-5xl text-brasa-orange mb-1">
                            {selectedProduct.name}
                          </h3>
                          <p className="font-mono text-xs text-brasa-gray mb-4">{selectedProduct.subtitle}</p>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.3 }}
                        >
                          <p className="text-brasa-gray text-sm leading-relaxed mb-5">{selectedProduct.description}</p>

                          <div className="flex gap-4 mb-5">
                            <div className="glass-card rounded-lg px-4 py-3">
                              <p className="font-mono text-[10px] text-brasa-gray uppercase">Capacidade</p>
                              <p className="font-bebas text-xl text-brasa-gold">{selectedProduct.poolSize}</p>
                            </div>
                            <div className="glass-card rounded-lg px-4 py-3">
                              <p className="font-mono text-[10px] text-brasa-gray uppercase">Potência</p>
                              <p className="font-bebas text-xl text-brasa-gold">{selectedProduct.power}</p>
                            </div>
                          </div>

                          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                            {selectedProduct.features.map((f, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.05 }}
                                className="flex items-start gap-2 text-brasa-gray text-xs"
                              >
                                <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full mt-1 shrink-0" />
                                {f}
                              </motion.li>
                            ))}
                          </ul>

                          <div className="flex items-center justify-between border-t border-brasa-border pt-5">
                            <div>
                              <p className="font-bebas text-3xl text-brasa-white">
                                R$ {selectedProduct.price.toLocaleString("pt-BR")}
                              </p>
                              <p className="text-brasa-gray text-xs font-mono">
                                12x R$ {Math.ceil(selectedProduct.price / 12).toLocaleString("pt-BR")}
                              </p>
                            </div>
                            <a href="/configurador" className="btn-brasa">
                              CONFIGURAR AGORA
                            </a>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute top-3 right-3 w-11 h-11 rounded-full bg-brasa-bg/80 border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white transition-colors z-10"
                    >
                      ✕
                    </button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
