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
          { y: 60, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
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
                  <div className="relative mb-4 sm:mb-6">
                    <motion.div
                      layout="position"
                      className="w-full h-24 sm:h-32 md:h-48 relative overflow-hidden"
                      style={{ borderRadius: 12, background: product.gradient }}
                    >
                      <ProductImage model={product.id} className="absolute inset-0" />
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
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedId(null)}
                >
                  <motion.div
                    layout
                    layoutId={`card-${selectedId}`}
                    transition={{
                      layout: layoutTransition,
                      opacity: { duration: 0.2 },
                    }}
                    className="bg-brasa-bg-card border border-brasa-border p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                    style={{ borderRadius: 16 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image — layout="position" keeps aspect ratio clean */}
                    <motion.div
                      layout="position"
                      className="w-full h-40 sm:h-56 md:h-64 mb-4 sm:mb-6 relative overflow-hidden"
                      style={{ borderRadius: 12, background: selectedProduct.gradient }}
                    >
                      <ProductImage model={selectedProduct.id} className="absolute inset-0" size="lg" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg-card/40 to-transparent" />
                    </motion.div>

                    {/* Title — animates from card position */}
                    <motion.div layout="position" layoutId={`title-${selectedId}`}>
                      <h3 className="font-bebas text-3xl sm:text-5xl text-brasa-orange mb-2">
                        {selectedProduct.name}
                      </h3>
                    </motion.div>

                    {/* Content fades in after layout settles */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                    >
                      <p className="text-brasa-gray text-lg mb-4">{selectedProduct.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="glass-card rounded-lg p-4">
                          <p className="font-mono text-xs text-brasa-gray">Capacidade</p>
                          <p className="font-bebas text-2xl text-brasa-gold">
                            {selectedProduct.poolSize}
                          </p>
                        </div>
                        <div className="glass-card rounded-lg p-4">
                          <p className="font-mono text-xs text-brasa-gray">Potência</p>
                          <p className="font-bebas text-2xl text-brasa-gold">
                            {selectedProduct.power}
                          </p>
                        </div>
                      </div>

                      <h4 className="font-bebas text-xl mb-3 text-brasa-white">Características</h4>
                      <ul className="space-y-2 mb-6">
                        {selectedProduct.features.map((f, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.06 }}
                            className="flex items-center gap-2 text-brasa-gray text-sm"
                          >
                            <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full" />
                            {f}
                          </motion.li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between border-t border-brasa-border pt-6">
                        <div>
                          <p className="font-bebas text-4xl text-brasa-white">
                            R$ {selectedProduct.price.toLocaleString("pt-BR")}
                          </p>
                          <p className="text-brasa-gray text-sm font-mono">
                            12x R$ {Math.ceil(selectedProduct.price / 12).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <a href="/configurador" className="btn-brasa">
                          CONFIGURAR AGORA
                        </a>
                      </div>
                    </motion.div>

                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brasa-bg border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
