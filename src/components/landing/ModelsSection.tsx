"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <TiltCard
              key={product.id}
              className="cursor-pointer"
              onClick={() => setSelectedId(product.id)}
            >
              <motion.div
                data-model-card
                layoutId={`card-${product.id}`}
                className="glass-card rounded-2xl p-6 hover:border-brasa-orange/50 transition-colors duration-300 group h-full"
              >
                {/* Product Image */}
                <div
                  className="w-full h-32 sm:h-48 rounded-xl mb-4 sm:mb-6 relative overflow-hidden"
                  style={{ background: product.gradient }}
                >
                  <ProductImage model={product.id as "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50"} className="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg-card/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="font-mono text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                      {product.power}
                    </span>
                    {i === 1 && (
                      <span className="font-mono text-xs text-brasa-bg bg-brasa-gold px-2 py-1 rounded font-bold">
                        MAIS VENDIDA
                      </span>
                    )}
                  </div>
                </div>

                <motion.div layoutId={`title-${product.id}`}>
                  <h3 className="font-bebas text-3xl text-brasa-orange">{product.name}</h3>
                </motion.div>
                <p className="text-brasa-gray text-sm mb-1">{product.subtitle}</p>
                <p className="font-mono text-brasa-gold text-sm mb-3">{product.poolSize}</p>

                <div className="border-t border-brasa-border pt-3 mt-auto">
                  <p className="font-bebas text-3xl text-brasa-white">
                    R$ {product.price.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-brasa-gray text-xs font-mono">
                    12x de R$ {Math.ceil(product.price / 12).toLocaleString("pt-BR")} s/ juros
                  </p>
                </div>

                <div className="mt-4 w-full text-center py-2.5 rounded-lg bg-brasa-orange/10 text-brasa-orange font-mono text-sm group-hover:bg-brasa-orange group-hover:text-white transition-all duration-300">
                  Ver detalhes →
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* Expanded Card Modal */}
        <AnimatePresence>
          {selectedId && selectedProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                onClick={() => setSelectedId(null)}
              />
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedId(null)}
              >
                <motion.div
                  layoutId={`card-${selectedId}`}
                  className="bg-brasa-bg-card border border-brasa-border rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="w-full h-64 rounded-xl mb-6 relative overflow-hidden"
                    style={{ background: selectedProduct.gradient }}
                  >
                    <ProductImage model={selectedProduct.id as "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50"} className="absolute inset-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brasa-bg-card/40 to-transparent" />
                  </div>

                  <motion.div layoutId={`title-${selectedId}`}>
                    <h3 className="font-bebas text-3xl sm:text-5xl text-brasa-orange mb-2">
                      {selectedProduct.name}
                    </h3>
                  </motion.div>

                  <p className="text-brasa-gray text-lg mb-4">{selectedProduct.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
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
                    {selectedProduct.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-brasa-gray text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full" />
                        {f}
                      </li>
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
      </div>
    </section>
  );
}
