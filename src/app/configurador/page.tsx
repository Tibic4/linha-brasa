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
import ProductImage from "@/components/shared/ProductImage";
import { products, addons, productColors } from "@/data/products";
import testimonials from "@/../data/testimonials.json";
import ProductColorPreview from "@/components/shared/ProductColorPreview";

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

function InlineCalculator({ total }: { total: number }) {
  const [poolVolume, setPoolVolume] = useState(30000);

  const gasMonthly = poolVolume * 0.042;
  const brasaMonthly = poolVolume * 0.0075;
  const monthlySaving = gasMonthly - brasaMonthly;
  const annualSaving = monthlySaving * 8;
  const paybackMonths = monthlySaving > 0 ? Math.ceil(total / monthlySaving) : 0;

  return (
    <div className="hidden lg:block glass-card rounded-2xl p-4">
      <h4 className="font-bebas text-base text-brasa-green mb-3">CALCULADORA DE ECONOMIA</h4>
      <label className="font-mono text-[10px] text-brasa-gray block mb-1">Volume da piscina</label>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="range"
          min={5000}
          max={60000}
          step={1000}
          value={poolVolume}
          onChange={(e) => setPoolVolume(Number(e.target.value))}
          className="flex-1 accent-brasa-orange"
        />
        <span className="font-mono text-xs text-brasa-orange w-16 text-right">{(poolVolume / 1000).toFixed(0)}k L</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-brasa-gray text-xs">Custo gás/mês</span>
          <span className="font-mono text-xs text-red-400">R$ {Math.round(gasMonthly).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brasa-gray text-xs">Custo BRASA/mês</span>
          <span className="font-mono text-xs text-brasa-green">R$ {Math.round(brasaMonthly).toLocaleString("pt-BR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brasa-gray text-xs">Economia anual</span>
          <span className="font-mono text-xs text-brasa-green font-bold">R$ {Math.round(annualSaving).toLocaleString("pt-BR")}</span>
        </div>
        <div className="pt-2 border-t border-brasa-border flex justify-between">
          <span className="text-brasa-gray text-xs">Retorno do investimento</span>
          <span className="font-mono text-xs text-brasa-gold">~{paybackMonths} meses</span>
        </div>
      </div>
    </div>
  );
}

export default function Configurador() {
  const [selectedModel, setSelectedModel] = useState(1); // Default BRASA 60
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedColor, setSelectedColor] = useState("preto-satin");

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "boleto">("pix");
  const addonsRef = useRef<HTMLDivElement>(null);
  const colorSectionRef = useRef<HTMLElement>(null);
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
        // On mobile, scroll to order summary so user sees the item added
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          setTimeout(() => {
            resumoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      }
      return next;
    });
  };

  const expandedRef = useRef<HTMLDivElement>(null);

  const handleModelClick = (i: number) => {
    if (expandedModel === i) {
      selectAndCollapse(i);
      return;
    }
    setExpandedModel(i);
  };

  const selectAndCollapse = (i: number) => {
    setSelectedModel(i);
    setExpandedModel(null);
    trackAddToCart(products[i].name, products[i].price);
    // Aguarda o modal fechar, depois rola suavemente para a seção de cor
    setTimeout(() => {
      colorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  const colorPrice = productColors.find((c) => c.id === selectedColor)?.price || 0;

  const total = useMemo(() => {
    const modelPrice = products[selectedModel].price;
    const addonsPrice = addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return modelPrice + addonsPrice + colorPrice;
  }, [selectedModel, selectedAddons, colorPrice]);

  // Inline testimonials for selected model
  const modelTestimonials = testimonials.filter(
    (t) => t.active !== false && t.model === products[selectedModel].id
  );

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <motion.main layoutScroll className="pt-20 min-h-screen relative">
        {/* Color Morphing — gradiente de fundo muda por modelo (relatório spec) */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          animate={{ background: products[selectedModel].gradient }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ opacity: 0.4 }}
        />
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
            <h1 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
              MONTE SUA <span className="text-brasa-orange">CALDEIRA</span>
            </h1>
            <p className="text-brasa-gray mt-3 max-w-lg mx-auto">
              Selecione o modelo, aditivos e cor. Veja o preço atualizar em tempo real.
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bebas text-2xl sm:text-3xl mb-4 sm:mb-6"
          >
            <span className="text-brasa-orange mr-2">01.</span> ESCOLHA O MODELO
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="flex-1 min-w-0 space-y-6">

            {/* === STEP 1: Models === */}
            <section>

                <LayoutGroup>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
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
                            className={`glass-card p-2.5 xs:p-4 text-left h-full ${
                              selectedModel === i
                                ? "border-brasa-orange glow-orange-sm"
                                : "hover:border-brasa-orange/30"
                            } transition-colors duration-300`}
                            style={{ borderRadius: 12 }}
                          >
                            <motion.div
                              layout="position"
                              layoutId={`cfg-img-${product.id}`}
                              className="w-full h-24 xs:h-32 mb-2 xs:mb-3 relative overflow-hidden"
                              style={{ borderRadius: 8, background: product.gradient }}
                            >
                              <ProductImage model={product.id} />
                              {i === 1 && (
                                <span className="absolute top-1 right-1 font-mono text-[10px] text-brasa-bg bg-brasa-gold px-1.5 py-0.5 rounded font-bold z-10">
                                  TOP
                                </span>
                              )}
                            </motion.div>
                            <motion.h3 layout="position" layoutId={`cfg-title-${product.id}`} className="font-bebas text-base xs:text-xl text-brasa-orange">
                              {product.name}
                            </motion.h3>
                            <motion.p layout="position" className="text-brasa-gray text-xs font-mono">{product.poolSize}</motion.p>
                            <motion.p layout="position" layoutId={`cfg-price-${product.id}`} className="font-bebas text-base xs:text-xl text-brasa-white mt-1">
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

                  {/* === EXPANDED CARD — Centered Modal with Backdrop === */}
                  <AnimatePresence>
                    {expandedModel !== null && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55]"
                          onClick={() => setExpandedModel(null)}
                        />
                        <div
                          className="fixed inset-x-0 top-[72px] bottom-0 z-[60] flex items-end sm:items-center justify-center px-3 pb-3 sm:p-4"
                          onClick={() => setExpandedModel(null)}
                        >
                          <motion.div
                            ref={expandedRef}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 28,
                              opacity: { duration: 0.2 },
                            }}
                            className="bg-brasa-bg-card border-0 sm:border border-brasa-border w-full sm:max-w-2xl max-h-[calc(100vh-90px)] sm:max-h-[85vh] overflow-y-auto relative rounded-t-2xl sm:rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setExpandedModel(null)}
                              className="absolute top-3 right-3 w-11 h-11 rounded-full bg-brasa-bg/80 border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white transition-colors z-10"
                            >
                              ✕
                            </button>

                            <div className="flex flex-col sm:flex-row">
                              {/* Image */}
                              <div
                                className="w-full sm:w-56 shrink-0 relative overflow-hidden flex items-center justify-center p-6 max-h-[30vh] sm:max-h-none"
                                style={{ background: products[expandedModel].gradient }}
                              >
                                <ProductImage model={products[expandedModel].id} size="md" className="max-h-[25vh] sm:max-h-none" />
                              </div>

                              {/* Info */}
                              <div className="flex-1 p-5 sm:p-6">
                                <h3 className="font-bebas text-3xl text-brasa-orange mb-0.5">
                                  {products[expandedModel].name}
                                </h3>
                                <p className="font-mono text-[10px] text-brasa-gray mb-3">{products[expandedModel].subtitle}</p>
                                <p className="text-brasa-gray text-sm leading-relaxed mb-4">
                                  {products[expandedModel].description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="font-mono text-[10px] text-brasa-gold bg-brasa-gold/10 px-2.5 py-1 rounded-full">
                                    {products[expandedModel].poolSize}
                                  </span>
                                  <span className="font-mono text-[10px] text-brasa-gold bg-brasa-gold/10 px-2.5 py-1 rounded-full">
                                    {products[expandedModel].power}
                                  </span>
                                </div>

                                <ul className="grid grid-cols-1 gap-1.5 mb-5">
                                  {products[expandedModel].features.map((f, idx) => (
                                    <motion.li
                                      key={idx}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 + idx * 0.05 }}
                                      className="flex items-start gap-2 text-brasa-gray text-xs"
                                    >
                                      <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full shrink-0 mt-1" />
                                      {f}
                                    </motion.li>
                                  ))}
                                </ul>

                                <div className="flex items-center justify-between border-t border-brasa-border pt-4">
                                  <div>
                                    <p className="font-bebas text-2xl sm:text-3xl text-brasa-white">
                                      R$ {products[expandedModel].price.toLocaleString("pt-BR")}
                                    </p>
                                    <p className="text-brasa-gray text-[10px] font-mono">
                                      12x R$ {Math.ceil(products[expandedModel].price / 12).toLocaleString("pt-BR")}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectAndCollapse(expandedModel);
                                    }}
                                    className="btn-brasa !py-2.5 !px-5 !text-sm"
                                  >
                                    {selectedModel === expandedModel ? "SELECIONADO ✓" : "SELECIONAR"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </LayoutGroup>
            </section>

            {/* === STEP 2: Addons === */}
            <section className="">
                <h2 className="font-bebas text-2xl sm:text-3xl mb-2">
                  <span className="text-brasa-orange mr-2">02.</span> ADITIVOS OPCIONAIS
                </h2>
                <p className="text-brasa-gray text-sm mb-6 font-mono">
                  {selectedAddons.size} selecionados
                </p>
                <div ref={addonsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-3">
                  {addons.filter((addon) => {
                    if (addon.models === "todos" || addon.models === "sul-sudeste") return true;
                    const modelNumber = products[selectedModel].id.replace("brasa-", "");
                    return addon.models.split(",").includes(modelNumber);
                  }).map((addon) => {
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
                            {t.image ? (
                              <img
                                src={t.image}
                                alt={t.name}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-brasa-orange/30 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brasa-orange/20 flex items-center justify-center shrink-0">
                                <span className="font-bebas text-brasa-orange text-lg">
                                  {t.name.charAt(0)}
                                </span>
                              </div>
                            )}
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

            {/* === STEP 3: Color === */}
            <section ref={colorSectionRef} className="scroll-mt-24">
                <h2 className="font-bebas text-2xl sm:text-3xl mb-4 sm:mb-6">
                  <span className="text-brasa-orange mr-2">03.</span> ESCOLHA A COR
                </h2>
                <div className="flex flex-col xs:flex-row gap-4 sm:gap-6 items-center xs:items-start">
                  {/* Color Preview */}
                  <div className="relative w-32 sm:w-64 rounded-xl overflow-hidden flex items-center justify-center py-2 sm:py-4 shrink-0"
                    style={{ background: products[selectedModel].gradient }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${products[selectedModel].id}-${selectedColor}`}
                        initial={{ opacity: 0, scale: 0.88, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                          opacity: { duration: 0.3 },
                        }}
                      >
                        <ProductColorPreview
                          colorHex={productColors.find(c => c.id === selectedColor)?.hex || "#1A1A1A"}
                          modelName={products[selectedModel].name}
                          className="w-24 h-32 sm:w-48 sm:h-56"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute top-2 right-2">
                      <span className="font-bebas text-sm text-white/70 bg-black/40 px-2 py-0.5 rounded">
                        {products[selectedModel].name}
                      </span>
                    </div>
                  </div>

                  {/* Color Swatches — compact circles on mobile, cards on desktop */}
                  <div className="flex-1">
                    {/* Mobile: horizontal circles */}
                    <div className="sm:hidden">
                      <div className="flex flex-wrap gap-2 xs:gap-3 justify-center mb-3">
                        {productColors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color.id)}
                          >
                            <motion.div
                              animate={{ scale: selectedColor === color.id ? 1.2 : 1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                selectedColor === color.id
                                  ? "border-brasa-orange ring-2 ring-brasa-orange/40 ring-offset-2 ring-offset-brasa-bg"
                                  : "border-brasa-border"
                              }`}
                              style={{ backgroundColor: color.hex }}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center font-mono text-sm">
                        <span className="text-brasa-white">{productColors.find(c => c.id === selectedColor)?.name}</span>
                        <span className={`ml-2 text-xs ${(productColors.find(c => c.id === selectedColor)?.price || 0) > 0 ? "text-brasa-gold" : "text-brasa-green"}`}>
                          {(productColors.find(c => c.id === selectedColor)?.price || 0) > 0 ? `+R$ ${productColors.find(c => c.id === selectedColor)?.price}` : "Incluso"}
                        </span>
                      </p>
                    </div>

                    {/* Desktop: cards with name + price */}
                    <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {productColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                            selectedColor === color.id
                              ? "border-brasa-orange bg-brasa-orange/10"
                              : "border-brasa-border hover:border-brasa-orange/30 bg-brasa-bg-card/50"
                          }`}
                        >
                          <motion.div
                            animate={{ scale: selectedColor === color.id ? 1.2 : 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full border-2 shrink-0 ${
                              selectedColor === color.id
                                ? "border-brasa-orange ring-2 ring-brasa-orange/30"
                                : "border-brasa-border"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-left">
                            <p className={`font-mono text-xs leading-tight ${
                              selectedColor === color.id ? "text-brasa-orange" : "text-brasa-white"
                            }`}>{color.name}</p>
                            <p className={`font-mono text-[10px] ${
                              color.price > 0 ? "text-brasa-gold" : "text-brasa-green"
                            }`}>
                              {color.price > 0 ? `+R$ ${color.price}` : "Incluso"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
            </section>
            </div>

            {/* === SIDEBAR === */}
            <div ref={resumoRef} className="order-2 lg:w-96 lg:shrink-0 scroll-mt-20 lg:self-stretch">
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl flex flex-col max-h-[calc(100vh-120px)]"
                >
                  {/* === TOP: Items (scrollable area) === */}
                  <div className="flex-1 overflow-y-auto p-6 pb-0 min-h-0">
                    <h3 className="font-bebas text-2xl mb-4">RESUMO DO PEDIDO</h3>

                    <div className="space-y-3 mb-4">
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
                  </div>

                  {/* === BOTTOM: Total + CTA (always visible, pinned) === */}
                  <div className="shrink-0 p-6 pt-0">
                    <div className="border-t border-brasa-border pt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bebas text-xl">TOTAL</span>
                        <AnimatedTotal value={total} />
                      </div>
                      <p className="text-brasa-gray text-xs font-mono text-right">
                        ou 12x de R$ {Math.ceil(total / 12).toLocaleString("pt-BR")} no cartão
                      </p>
                    </div>

                    {/* Frete */}
                    <div className="flex justify-between items-center mt-3 mb-1">
                      <span className="text-brasa-gray text-xs">Frete</span>
                      <span className="font-mono text-xs text-brasa-green">
                        Grátis Sul/Sudeste
                      </span>
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full mt-4 py-4 font-bebas text-xl tracking-wider text-white bg-brasa-green rounded-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] active:scale-95 transition-all"
                    >
                      FINALIZAR COM PIX (5% OFF)
                    </button>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="btn-brasa w-full text-lg mt-2"
                    >
                      PAGAR NO CARTÃO
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
                      Ou solicite via WhatsApp →
                    </a>
                  </div>
                </motion.div>

                {/* Inline Economy Calculator */}
                <InlineCalculator total={total} />

                {/* Guarantees — compact inline */}
                <div className="hidden lg:flex flex-wrap gap-x-4 gap-y-1 justify-center">
                  {[
                    { icon: "🛡️", text: "2 anos garantia" },
                    { icon: "🚚", text: "Frete grátis Sul/SE" },
                    { icon: "🇧🇷", text: "Fabricado no Brasil" },
                    { icon: "🔬", text: "Teste 8 bar" },
                  ].map((g) => (
                    <span key={g.text} className="flex items-center gap-1 text-brasa-gray text-[10px] font-mono">
                      <span>{g.icon}</span>
                      <span>{g.text}</span>
                    </span>
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
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
                  onClick={() => setShowCheckout(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.15 }}
                  className="fixed inset-0 sm:top-16 sm:inset-x-4 sm:bottom-4 lg:top-16 lg:inset-x-8 lg:bottom-8 lg:max-w-5xl lg:mx-auto bg-brasa-bg-card border-0 sm:border border-brasa-border sm:rounded-2xl z-50 overflow-y-auto"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-brasa-bg-card/95 backdrop-blur-lg border-b border-brasa-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                    <h2 className="font-bebas text-2xl sm:text-3xl">CHECKOUT</h2>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-11 h-11 rounded-full bg-brasa-bg border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column — Form */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                      <div className="mb-6 sm:mb-8">
                        <h3 className="font-bebas text-lg sm:text-xl text-brasa-orange mb-3 sm:mb-4">DADOS PESSOAIS</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Nome completo</label>
                            <input
                              type="text"
                              placeholder="Seu nome"
                              required
                              className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">CPF / CNPJ</label>
                            <input
                              type="text"
                              placeholder="000.000.000-00"
                              required
                              className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Telefone / WhatsApp</label>
                            <input
                              type="tel"
                              placeholder="(00) 00000-0000"
                              required
                              className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">E-mail</label>
                            <input
                              type="email"
                              placeholder="seu@email.com"
                              required
                              className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <h3 className="font-bebas text-lg sm:text-xl text-brasa-orange mb-3 sm:mb-4">ENDEREÇO DE ENTREGA</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="address-form">
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">CEP</label>
                            <input
                              type="text"
                              placeholder="00000-000"
                              maxLength={9}
                              className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors"
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
                          <div /> {/* spacer */}
                          <div className="sm:col-span-2">
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Rua</label>
                            <input data-field="rua" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Número</label>
                            <input type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Complemento</label>
                            <input type="text" placeholder="Apto, bloco, etc. (opcional)" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white placeholder:text-brasa-gray-dark font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Bairro</label>
                            <input data-field="bairro" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">Cidade</label>
                            <input data-field="cidade" type="text" className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="font-mono text-xs text-brasa-gray block mb-1.5">UF</label>
                            <input data-field="uf" type="text" maxLength={2} className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono focus:border-brasa-orange focus:ring-1 focus:ring-brasa-orange/30 outline-none transition-colors uppercase" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bebas text-lg sm:text-xl text-brasa-orange mb-3 sm:mb-4">PAGAMENTO</h3>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                          {([
                            { id: "pix" as const, label: "PIX", desc: "5% desconto", icon: "⚡" },
                            { id: "cartao" as const, label: "Cartão", desc: "Até 12x", icon: "💳" },
                            { id: "boleto" as const, label: "Boleto", desc: "Venc. 3 dias", icon: "📄" },
                          ]).map((method) => {
                            const isActive = paymentMethod === method.id;
                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-brasa-bg border-2 text-center cursor-pointer transition-all hover:scale-[1.02] ${
                                  isActive
                                    ? method.id === "pix"
                                      ? "border-brasa-green bg-brasa-green/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                                      : "border-brasa-orange bg-brasa-orange/10"
                                    : "border-brasa-border hover:border-brasa-orange/30"
                                }`}
                              >
                                <span className="text-lg block mb-0.5">{method.icon}</span>
                                <span className={`font-mono text-sm block ${isActive ? "text-white" : "text-brasa-white"}`}>{method.label}</span>
                                <span className={`font-mono text-[10px] ${
                                  isActive && method.id === "pix" ? "text-brasa-green" : isActive ? "text-brasa-orange" : "text-brasa-gray-dark"
                                }`}>{method.desc}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Mercado Pago Bricks container — renders CardPayment or PaymentBrick */}
                        <div id="mercadopago-bricks-container" className="min-h-[120px] rounded-xl border border-dashed border-brasa-border">
                          {paymentMethod === "pix" ? (
                            <div className="p-6 text-center">
                              <p className="font-bebas text-2xl text-brasa-green mb-2">PIX — 5% DE DESCONTO</p>
                              <p className="font-mono text-xs text-brasa-gray mb-3">
                                Total: <span className="text-brasa-green font-bold">R$ {Math.floor(total * 0.95).toLocaleString("pt-BR")}</span>
                                <span className="line-through ml-2 text-brasa-gray-dark">R$ {total.toLocaleString("pt-BR")}</span>
                              </p>
                              <p className="text-brasa-gray-dark text-[10px] font-mono">
                                QR Code dinâmico será gerado ao confirmar (Mercado Pago Checkout Bricks).
                                <br />Configure NEXT_PUBLIC_MP_PUBLIC_KEY para ativar.
                              </p>
                            </div>
                          ) : paymentMethod === "cartao" ? (
                            <div className="p-6 text-center">
                              <p className="font-bebas text-2xl text-brasa-orange mb-2">CARTÃO DE CRÉDITO</p>
                              <p className="font-mono text-xs text-brasa-gray mb-3">
                                Até 12x de <span className="text-brasa-gold font-bold">R$ {Math.ceil(total / 12).toLocaleString("pt-BR")}</span> sem juros
                              </p>
                              <p className="text-brasa-gray-dark text-[10px] font-mono">
                                Formulário do cartão será renderizado aqui (Mercado Pago CardPayment Brick).
                                <br />Configure NEXT_PUBLIC_MP_PUBLIC_KEY para ativar.
                              </p>
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <p className="font-bebas text-2xl text-brasa-white mb-2">BOLETO BANCÁRIO</p>
                              <p className="font-mono text-xs text-brasa-gray mb-3">
                                Vencimento em 3 dias úteis — R$ {total.toLocaleString("pt-BR")}
                              </p>
                              <p className="text-brasa-gray-dark text-[10px] font-mono">
                                Boleto será gerado ao confirmar (Mercado Pago Checkout Bricks).
                                <br />Configure NEXT_PUBLIC_MP_PUBLIC_KEY para ativar.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column — Order Summary */}
                    <div className="lg:w-80 lg:border-l border-t lg:border-t-0 border-brasa-border bg-brasa-bg/30 p-4 sm:p-6 lg:p-8">
                      <h3 className="font-bebas text-xl mb-4">SEU PEDIDO</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-brasa-white text-sm font-medium">{products[selectedModel].name}</span>
                          <span className="font-mono text-sm">R$ {products[selectedModel].price.toLocaleString("pt-BR")}</span>
                        </div>

                        {colorPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-brasa-gray text-xs flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: productColors.find(c => c.id === selectedColor)?.hex }} />
                              {productColors.find(c => c.id === selectedColor)?.name}
                            </span>
                            <span className="font-mono text-xs text-brasa-gray">+R$ {colorPrice.toLocaleString("pt-BR")}</span>
                          </div>
                        )}

                        {addons.filter((a) => selectedAddons.has(a.id)).map((a) => (
                          <div key={a.id} className="flex justify-between items-center">
                            <span className="text-brasa-gray text-xs">{a.emoji} {a.name}</span>
                            <span className="font-mono text-xs text-brasa-gray">+R$ {a.price.toLocaleString("pt-BR")}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-brasa-gray text-xs">Frete</span>
                        <span className="font-mono text-xs text-brasa-green">Grátis Sul/Sudeste</span>
                      </div>

                      <div className="border-t border-brasa-border pt-4 mb-6">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bebas text-xl">TOTAL</span>
                          <span className="font-bebas text-2xl text-brasa-orange">
                            {paymentMethod === "pix"
                              ? `R$ ${Math.floor(total * 0.95).toLocaleString("pt-BR")}`
                              : `R$ ${total.toLocaleString("pt-BR")}`}
                          </span>
                        </div>
                        {paymentMethod === "pix" && (
                          <p className="text-brasa-green text-xs font-mono text-right">
                            5% off no Pix <span className="line-through text-brasa-gray-dark ml-1">R$ {total.toLocaleString("pt-BR")}</span>
                          </p>
                        )}
                        {paymentMethod === "cartao" && (
                          <p className="text-brasa-gray text-xs font-mono text-right">
                            ou 12x de R$ {Math.ceil(total / 12).toLocaleString("pt-BR")} sem juros
                          </p>
                        )}
                        {paymentMethod === "boleto" && (
                          <p className="text-brasa-gray text-xs font-mono text-right">
                            Vencimento em 3 dias úteis
                          </p>
                        )}
                      </div>

                      <a
                        href={`/obrigado?total=${paymentMethod === "pix" ? Math.floor(total * 0.95) : total}`}
                        className="btn-brasa w-full text-lg text-center block"
                      >
                        FINALIZAR PEDIDO
                      </a>

                      <a
                        href={`https://wa.me/5543999999999?text=${encodeURIComponent(
                          `Olá! Quero comprar: ${products[selectedModel].name}${selectedColor !== "preto-satin" ? ` (cor: ${productColors.find(c => c.id === selectedColor)?.name})` : ""}${selectedAddons.size > 0 ? ` com ${selectedAddons.size} aditivos` : ""}. Total: R$ ${total.toLocaleString("pt-BR")}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center mt-4 text-brasa-green font-mono text-sm hover:underline"
                      >
                        Ou finalize pelo WhatsApp
                      </a>

                      <div className="mt-6 pt-4 border-t border-brasa-border grid grid-cols-2 gap-2">
                        {[
                          { icon: "🛡️", text: "2 anos garantia" },
                          { icon: "🔒", text: "Pagamento seguro" },
                          { icon: "🚚", text: "Frete grátis Sul/SE" },
                          { icon: "🇧🇷", text: "Fabricado no Brasil" },
                        ].map((g) => (
                          <span key={g.text} className="flex items-center gap-1.5 text-brasa-gray text-[10px] font-mono">
                            <span>{g.icon}</span>
                            <span>{g.text}</span>
                          </span>
                        ))}
                      </div>
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
              className="btn-brasa !py-3 !px-4 xs:!px-6 !text-sm xs:!text-base"
            >
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
      </motion.main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
