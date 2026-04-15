"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { CountUp } from "countup.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { trackAddToCart, trackWhatsAppClick } from "@/components/shared/AnalyticsEvents";
import ColorMorph from "@/components/shared/ColorMorph";
import ProductImage from "@/components/shared/ProductImage";
import { products, addons, productColors, testimonials } from "@/data/products";

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
        max: 6,
        speed: 400,
        glare: true,
        "max-glare": 0.12,
        scale: 1.02,
        perspective: 1200,
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

function AnimatedTotal({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!ref.current) return;
    const counter = new CountUp(ref.current, value, {
      startVal: prevValue.current,
      duration: 0.8,
      separator: ".",
      prefix: "R$ ",
      useEasing: true,
    });
    counter.start();
    prevValue.current = value;
  }, [value]);

  return (
    <span ref={ref} className="font-bebas text-3xl">
      R$ {value.toLocaleString("pt-BR")}
    </span>
  );
}

export default function Configurador() {
  const [selectedModel, setSelectedModel] = useState(1); // Default BRASA 60
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedColor, setSelectedColor] = useState("preto-satin");

  const [showCheckout, setShowCheckout] = useState(false);
  const addonsRef = useRef<HTMLDivElement>(null);
  const resumoRef = useRef<HTMLDivElement>(null);

  // GSAP stagger entrance for addon cards
  useEffect(() => {
    if (!addonsRef.current) return;
    const cards = addonsRef.current.querySelectorAll("[data-addon-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: addonsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const addon = addons.find((a) => a.id === id);
        if (addon) trackAddToCart(addon.name, addon.price);
      }
      return next;
    });
  };

  const expandedRef = useRef<HTMLDivElement>(null);

  const handleModelClick = (i: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

    if (isMobile) {
      setSelectedModel(i);
      setExpandedModel(null);
      trackAddToCart(products[i].name, products[i].price);
      setTimeout(() => {
        resumoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    if (expandedModel === i) {
      setSelectedModel(i);
      setExpandedModel(null);
    } else {
      setExpandedModel(i);
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const selectAndCollapse = (i: number) => {
    setSelectedModel(i);
    setExpandedModel(null);
    trackAddToCart(products[i].name, products[i].price);
  };

  const colorPrice = productColors.find((c) => c.id === selectedColor)?.price || 0;

  const total = useMemo(() => {
    const modelPrice = products[selectedModel].price;
    const addonsPrice = addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return modelPrice + addonsPrice + colorPrice;
  }, [selectedModel, selectedAddons, colorPrice]);

  const monthlySavings = useMemo(() => Math.round(total * 0.048), [total]);

  // Inline testimonials for selected model
  const modelTestimonials = testimonials.filter(
    (t) => t.model === products[selectedModel].id
  );

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-20 min-h-screen relative">
        <ColorMorph activeModel={selectedModel} variant="page" className="fixed" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 pb-28 lg:pb-12 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-12"
          >
            <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
              Configurador Interativo
            </p>
            <h1 className="font-bebas text-3xl sm:text-5xl md:text-7xl">
              MONTE SUA <span className="text-brasa-orange">CALDEIRA</span>
            </h1>
            <p className="text-brasa-gray mt-3 max-w-lg mx-auto">
              Selecione o modelo, aditivos e cor. Veja o preço atualizar em tempo real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-4 lg:gap-8">

            {/* === STEP 1: Models === */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-1"
            >
                <h2 className="font-bebas text-2xl sm:text-3xl mb-4 sm:mb-6">
                  <span className="text-brasa-orange mr-2">01.</span> ESCOLHA O MODELO
                </h2>

                <LayoutGroup>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.map((product, i) => (
                      <TiltCard
                        key={product.id}
                        className={`cursor-pointer ${expandedModel !== null && expandedModel !== i ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => handleModelClick(i)}
                      >
                        {expandedModel !== i && (
                          <motion.div
                            layout
                            layoutId={`cfg-model-${product.id}`}
                            transition={{
                              layout: { type: "spring", stiffness: 350, damping: 30 },
                              opacity: { duration: 0.2 },
                            }}
                            className={`glass-card p-4 text-left h-full ${
                              selectedModel === i
                                ? "border-brasa-orange glow-orange-sm"
                                : "hover:border-brasa-orange/30"
                            } transition-colors duration-300`}
                            style={{ borderRadius: 12 }}
                          >
                            <motion.div
                              layout="position"
                              layoutId={`cfg-img-${product.id}`}
                              className="w-full h-32 mb-3 relative overflow-hidden"
                              style={{ borderRadius: 8, background: product.gradient }}
                            >
                              <ProductImage model={product.id} />
                              {i === 1 && (
                                <span className="absolute top-1 right-1 font-mono text-[10px] text-brasa-bg bg-brasa-gold px-1.5 py-0.5 rounded font-bold z-10">
                                  TOP
                                </span>
                              )}
                            </motion.div>
                            <motion.h3 layout="position" layoutId={`cfg-title-${product.id}`} className="font-bebas text-xl text-brasa-orange">
                              {product.name}
                            </motion.h3>
                            <motion.p layout="position" className="text-brasa-gray text-xs font-mono">{product.poolSize}</motion.p>
                            <motion.p layout="position" layoutId={`cfg-price-${product.id}`} className="font-bebas text-xl text-brasa-white mt-1">
                              R$ {product.price.toLocaleString("pt-BR")}
                            </motion.p>
                            {selectedModel === i && (
                              <motion.div layout="position" className="mt-2 text-center py-1 bg-brasa-orange/20 text-brasa-orange font-mono text-[10px]" style={{ borderRadius: 4 }}>
                                SELECIONADO
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </TiltCard>
                    ))}
                  </div>

                  {/* === EXPANDED CARD — Shared Layout (Juicy Expand) === */}
                  <AnimatePresence>
                    {expandedModel !== null && (
                      <motion.div
                        ref={expandedRef}
                        layout
                        layoutId={`cfg-model-${products[expandedModel].id}`}
                        transition={{
                          layout: { type: "spring", stiffness: 350, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                        className="glass-card p-6 mt-4 overflow-hidden"
                        style={{ borderRadius: 16, originY: 0 }}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <motion.div
                            layout="position"
                            layoutId={`cfg-img-${products[expandedModel].id}`}
                            className="w-full md:w-64 h-56 shrink-0 relative overflow-hidden"
                            style={{ borderRadius: 12, background: products[expandedModel].gradient }}
                          >
                            <ProductImage model={products[expandedModel].id} size="lg" />
                          </motion.div>

                          <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.3 }}
                          >
                            <motion.h3
                              layout="position"
                              layoutId={`cfg-title-${products[expandedModel].id}`}
                              className="font-bebas text-4xl text-brasa-orange mb-1"
                            >
                              {products[expandedModel].name}
                            </motion.h3>
                            <p className="text-brasa-gray text-sm mb-3">
                              {products[expandedModel].description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="font-mono text-xs text-brasa-gold bg-brasa-gold/10 px-3 py-1 rounded-full">
                                {products[expandedModel].poolSize}
                              </span>
                              <span className="font-mono text-xs text-brasa-gold bg-brasa-gold/10 px-3 py-1 rounded-full">
                                {products[expandedModel].power}
                              </span>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-4">
                              {products[expandedModel].features.map((f, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.15 + idx * 0.05 }}
                                  className="flex items-center gap-2 text-brasa-gray text-xs"
                                >
                                  <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full shrink-0" />
                                  {f}
                                </motion.li>
                              ))}
                            </ul>

                            <div className="flex items-center justify-between border-t border-brasa-border pt-4">
                              <motion.p
                                layout="position"
                                layoutId={`cfg-price-${products[expandedModel].id}`}
                                className="font-bebas text-3xl text-brasa-white"
                              >
                                R$ {products[expandedModel].price.toLocaleString("pt-BR")}
                              </motion.p>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedModel(null);
                                  }}
                                  className="px-4 py-2 font-mono text-xs text-brasa-gray border border-brasa-border rounded-lg hover:border-brasa-gray transition-colors"
                                >
                                  Fechar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectAndCollapse(expandedModel);
                                  }}
                                  className="btn-brasa !py-2 !px-6 !text-sm"
                                >
                                  {selectedModel === expandedModel ? "SELECIONADO ✓" : "SELECIONAR"}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LayoutGroup>
            </motion.section>

            {/* === STEP 2: Addons === */}
            <section className="order-3">
                <h2 className="font-bebas text-2xl sm:text-3xl mb-2">
                  <span className="text-brasa-orange mr-2">02.</span> ADITIVOS OPCIONAIS
                </h2>
                <p className="text-brasa-gray text-sm mb-6 font-mono">
                  {selectedAddons.size} de {addons.length} selecionados
                </p>
                <div ref={addonsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.has(addon.id);
                    return (
                      <TiltCard key={addon.id} className="cursor-pointer" onClick={() => toggleAddon(addon.id)}>
                        <div
                          data-addon-card
                          className={`glass-card rounded-xl p-3 sm:p-4 text-left transition-all duration-300 h-full ${
                            isSelected
                              ? "border-brasa-orange glow-orange-sm"
                              : "hover:border-brasa-orange/30"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xl sm:text-2xl">{addon.emoji}</span>
                            <motion.span
                              animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
                              className={`font-bebas text-lg ${
                                isSelected ? "text-brasa-orange" : "text-brasa-gray-dark"
                              }`}
                            >
                              {isSelected ? "✓" : "+"}
                            </motion.span>
                          </div>
                          <p
                            className={`font-bebas text-sm leading-tight ${
                              isSelected ? "text-brasa-orange" : "text-brasa-white"
                            }`}
                          >
                            {addon.name}
                          </p>
                          <p className="text-brasa-gray text-xs mt-0.5 leading-tight">
                            {addon.description}
                          </p>
                          {addon.badge && (
                            <span className="inline-block mt-1.5 font-mono text-[9px] text-brasa-gold bg-brasa-gold/10 px-2 py-0.5 rounded">
                              {addon.badge}
                            </span>
                          )}
                          <p className="font-mono text-sm text-brasa-gold mt-2">
                            + R$ {addon.price.toLocaleString("pt-BR")}
                          </p>
                          {addon.models !== "todos" && (
                            <p className="font-mono text-[9px] text-brasa-gray-dark mt-0.5">
                              {addon.models === "sul-sudeste" ? "Sul/Sudeste" : `Modelos: ${addon.models}`}
                            </p>
                          )}
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>

                {/* === STEP 3: Color Selector === */}
                <div className="mt-8">
                  <h2 className="font-bebas text-2xl sm:text-3xl mb-2">
                    <span className="text-brasa-orange mr-2">03.</span> ESCOLHA A COR
                  </h2>
                  <p className="text-brasa-gray text-sm mb-4 font-mono">
                    Preto Satin incluso. Outras cores com adicional.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                    {productColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className="group flex flex-col items-center gap-1.5 sm:gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                            selectedColor === color.id
                              ? "border-brasa-orange scale-110 ring-2 ring-brasa-orange/30 ring-offset-2 ring-offset-brasa-bg"
                              : "border-brasa-border group-hover:border-brasa-gray"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`font-mono text-[10px] text-center leading-tight max-w-[60px] ${
                          selectedColor === color.id ? "text-brasa-orange" : "text-brasa-gray"
                        }`}>
                          {color.name}
                        </span>
                        {color.price > 0 && (
                          <span className="font-mono text-[9px] text-brasa-gold">
                            +R$ {color.price}
                          </span>
                        )}
                        {color.price === 0 && (
                          <span className="font-mono text-[9px] text-brasa-green">
                            Incluso
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* === INLINE TESTIMONIALS === */}
                {modelTestimonials.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-bebas text-lg text-brasa-gray mb-3">
                      O que dizem sobre a {products[selectedModel].name}
                    </h3>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={products[selectedModel].id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        {modelTestimonials.slice(0, 2).map((t) => (
                          <div key={t.id} className="glass-card rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brasa-orange/20 flex items-center justify-center shrink-0">
                              <span className="font-bebas text-brasa-orange text-lg">
                                {t.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bebas text-sm text-brasa-white">{t.name}</span>
                                <span className="text-brasa-gray text-xs">— {t.location}</span>
                              </div>
                              <p className="text-brasa-gray text-xs leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                              {t.result && (
                                <p className="font-mono text-[10px] text-brasa-green mt-1">
                                  {t.result} | Piscina: {t.poolSize}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
            </section>

            {/* === SIDEBAR === */}
            <div ref={resumoRef} className="order-2 lg:row-span-2 lg:row-start-1 lg:col-start-2 scroll-mt-20">
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-bebas text-2xl mb-4">RESUMO DO PEDIDO</h3>

                  {/* Product Photo */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4"
                    style={{ background: products[selectedModel].gradient }}
                  >
                    <img
                      src={products[selectedModel].image}
                      alt={`Caldeira ${products[selectedModel].name}`}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="font-bebas text-sm text-white/70 bg-black/40 px-2 py-0.5 rounded">
                        {products[selectedModel].name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-brasa-gray text-sm">{products[selectedModel].name}</span>
                      <span className="font-mono text-sm text-brasa-white">
                        R$ {products[selectedModel].price.toLocaleString("pt-BR")}
                      </span>
                    </div>

                    {/* Color line */}
                    {colorPrice > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-brasa-gray text-xs flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-brasa-border inline-block"
                            style={{ backgroundColor: productColors.find(c => c.id === selectedColor)?.hex }}
                          />
                          {productColors.find(c => c.id === selectedColor)?.name}
                        </span>
                        <span className="font-mono text-xs text-brasa-gray">
                          + R$ {colorPrice.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    )}

                    <AnimatePresence>
                      {addons
                        .filter((a) => selectedAddons.has(a.id))
                        .map((addon) => (
                          <motion.div
                            key={addon.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center overflow-hidden"
                          >
                            <span className="text-brasa-gray text-xs">{addon.emoji} {addon.name}</span>
                            <span className="font-mono text-xs text-brasa-gray">
                              + R$ {addon.price.toLocaleString("pt-BR")}
                            </span>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-brasa-border pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bebas text-xl">TOTAL</span>
                      <AnimatedTotal value={total} />
                    </div>
                    <p className="text-brasa-gray text-xs font-mono text-right">
                      ou 12x de R$ {Math.ceil(total / 12).toLocaleString("pt-BR")} no cartão
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-brasa w-full text-xl mt-6"
                  >
                    FINALIZAR COMPRA
                  </button>

                  <a
                    href={`https://wa.me/5543999999999?text=${encodeURIComponent(
                      `Olá! Quero comprar: ${products[selectedModel].name}${selectedColor !== "preto-satin" ? ` (cor: ${productColors.find(c => c.id === selectedColor)?.name})` : ""}${selectedAddons.size > 0 ? ` com ${selectedAddons.size} aditivos` : ""}. Total: R$ ${total.toLocaleString("pt-BR")}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-3 text-brasa-green font-mono text-sm hover:underline"
                    onClick={() => trackWhatsAppClick("configurador_sidebar")}
                  >
                    Ou compre pelo WhatsApp →
                  </a>
                </motion.div>

                {/* Economy Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h4 className="font-bebas text-lg text-brasa-green mb-3">ECONOMIA ESTIMADA</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brasa-gray text-xs">Economia mensal vs gás</span>
                      <span className="font-mono text-sm text-brasa-green">
                        ~R$ {monthlySavings.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brasa-gray text-xs">Economia anual</span>
                      <span className="font-mono text-sm text-brasa-green">
                        ~R$ {(monthlySavings * 10).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brasa-gray text-xs">Retorno do investimento</span>
                      <span className="font-mono text-sm text-brasa-gold">
                        ~{Math.ceil(total / monthlySavings)} meses
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-brasa-border">
                      <div className="flex justify-between">
                        <span className="text-brasa-gray text-xs">Economia em 5 anos</span>
                        <span className="font-mono text-sm text-brasa-green font-bold">
                          R$ {(monthlySavings * 60 - total).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Guarantees */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🛡️", text: "2 anos garantia" },
                    { icon: "🚚", text: "Frete grátis Sul/SE" },
                    { icon: "🇧🇷", text: "Fabricado no Brasil" },
                    { icon: "🔬", text: "Teste 8 bar" },
                  ].map((g) => (
                    <div key={g.text} className="flex items-center gap-2 text-brasa-gray text-[10px] font-mono">
                      <span>{g.icon}</span>
                      <span>{g.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* === CHECKOUT MODAL === */}
          <AnimatePresence>
            {showCheckout && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                  onClick={() => setShowCheckout(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.15 }}
                  className="fixed inset-0 sm:inset-4 md:inset-x-auto md:inset-y-8 md:max-w-2xl md:mx-auto bg-brasa-bg-card border border-brasa-border sm:rounded-2xl z-50 overflow-y-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-3 sm:pb-4 sm:p-6 md:p-8"
                >
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="absolute top-20 sm:top-4 right-4 w-10 h-10 rounded-full bg-brasa-bg border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white"
                  >
                    ✕
                  </button>

                  <h2 className="font-bebas text-3xl sm:text-4xl mb-4 sm:mb-6 pr-12">CHECKOUT</h2>

                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-bebas text-lg sm:text-xl text-brasa-orange mb-3 sm:mb-4">ENDEREÇO DE ENTREGA</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" id="address-form">
                      <div>
                        <label className="font-mono text-xs text-brasa-gray block mb-1">CEP</label>
                        <input
                          type="text"
                          placeholder="00000-000"
                          maxLength={9}
                          className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none"
                          onChange={async (e) => {
                            const cep = e.target.value.replace(/\D/g, "");
                            if (cep.length === 8) {
                              try {
                                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                                const data = await res.json();
                                if (!data.erro) {
                                  const form = document.getElementById("address-form");
                                  if (form) {
                                    const rua = form.querySelector<HTMLInputElement>("[data-field='rua']");
                                    const bairro = form.querySelector<HTMLInputElement>("[data-field='bairro']");
                                    const cidade = form.querySelector<HTMLInputElement>("[data-field='cidade']");
                                    const uf = form.querySelector<HTMLInputElement>("[data-field='uf']");
                                    if (rua) rua.value = data.logradouro || "";
                                    if (bairro) bairro.value = data.bairro || "";
                                    if (cidade) cidade.value = data.localidade || "";
                                    if (uf) uf.value = data.uf || "";
                                  }
                                }
                              } catch { /* ignore */ }
                            }
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-mono text-xs text-brasa-gray block mb-1">Rua</label>
                        <input data-field="rua" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none" />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-brasa-gray block mb-1">Bairro</label>
                        <input data-field="bairro" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none" />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-brasa-gray block mb-1">Cidade</label>
                        <input data-field="cidade" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none" />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-brasa-gray block mb-1">UF</label>
                        <input data-field="uf" type="text" maxLength={2} className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none" />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-brasa-gray block mb-1">Número</label>
                        <input type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="font-bebas text-xl mb-3">RESUMO</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brasa-gray">{products[selectedModel].name}</span>
                        <span className="font-mono">R$ {products[selectedModel].price.toLocaleString("pt-BR")}</span>
                      </div>
                      {colorPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-brasa-gray text-xs">Cor: {productColors.find(c => c.id === selectedColor)?.name}</span>
                          <span className="font-mono text-xs">R$ {colorPrice.toLocaleString("pt-BR")}</span>
                        </div>
                      )}
                      {addons.filter((a) => selectedAddons.has(a.id)).map((a) => (
                        <div key={a.id} className="flex justify-between">
                          <span className="text-brasa-gray text-xs">{a.emoji} {a.name}</span>
                          <span className="font-mono text-xs">R$ {a.price.toLocaleString("pt-BR")}</span>
                        </div>
                      ))}

                      <div className="border-t border-brasa-border pt-2 flex justify-between">
                        <span className="font-bebas text-xl">TOTAL</span>
                        <span className="font-bebas text-2xl text-brasa-orange">
                          R$ {total.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bebas text-xl text-brasa-orange mb-4">PAGAMENTO</h3>
                    <div className="glass-card rounded-xl p-4 sm:p-8 text-center">
                      <p className="text-brasa-gray font-mono text-sm mb-4">
                        Mercado Pago Checkout Bricks
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                        {[
                          { label: "PIX", desc: "5% desconto", highlight: true },
                          { label: "Cartão", desc: "Até 12x" },
                          { label: "Boleto", desc: "Venc. 3 dias" },
                        ].map((method) => (
                          <div
                            key={method.label}
                            className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-brasa-bg border text-center ${
                              (method as { highlight?: boolean }).highlight ? "border-brasa-green" : "border-brasa-border"
                            }`}
                          >
                            <span className="font-mono text-xs text-brasa-white block">{method.label}</span>
                            <span className={`font-mono text-[10px] ${
                              (method as { highlight?: boolean }).highlight ? "text-brasa-green" : "text-brasa-gray-dark"
                            }`}>{method.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div id="mercadopago-bricks-container" />
                      <p className="text-brasa-gray-dark text-xs font-mono mt-4">
                        O checkout do Mercado Pago será renderizado aqui com as credenciais de produção.
                      </p>
                      <a
                        href="/obrigado"
                        className="btn-brasa inline-block mt-6 text-lg"
                      >
                        FINALIZAR PEDIDO
                      </a>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* === MOBILE STICKY CTA BAR === */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-brasa-bg-card/95 backdrop-blur-lg border-t border-brasa-border px-4 py-3 flex items-center justify-between safe-bottom">
            <div>
              <p className="text-brasa-gray text-[10px] font-mono uppercase tracking-wider">Total</p>
              <p className="font-bebas text-2xl text-brasa-orange leading-none">
                R$ {total.toLocaleString("pt-BR")}
              </p>
              <p className="text-brasa-gray text-[10px] font-mono">
                12x R$ {Math.ceil(total / 12).toLocaleString("pt-BR")}
              </p>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="btn-brasa !py-3 !px-6 !text-base"
            >
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
