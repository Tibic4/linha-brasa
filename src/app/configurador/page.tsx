"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { CountUp } from "countup.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import LoadingScreen from "@/components/shared/LoadingScreen";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { trackAddToCart, trackWhatsAppClick } from "@/components/shared/AnalyticsEvents";
import ColorMorph from "@/components/shared/ColorMorph";
import ProductImage from "@/components/shared/ProductImage";
import { products, addons, colors } from "@/data/products";

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
  const [selectedModel, setSelectedModel] = useState(0);
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedColor, setSelectedColor] = useState("preto-fosco");
  const [showCheckout, setShowCheckout] = useState(false);
  const addonsRef = useRef<HTMLDivElement>(null);

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

  const handleModelClick = (i: number) => {
    if (expandedModel === i) {
      // Click on already expanded → select it and collapse
      setSelectedModel(i);
      setExpandedModel(null);
    } else {
      // Expand to preview
      setExpandedModel(i);
    }
  };

  const selectAndCollapse = (i: number) => {
    setSelectedModel(i);
    setExpandedModel(null);
    trackAddToCart(products[i].name, products[i].price);
  };

  const total = useMemo(() => {
    const modelPrice = products[selectedModel].price;
    const addonsPrice = addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return modelPrice + addonsPrice;
  }, [selectedModel, selectedAddons]);

  const monthlySavings = useMemo(() => Math.round(total * 0.048), [total]);

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <main className="pt-20 min-h-screen relative">
        <ColorMorph activeModel={selectedModel} variant="page" className="fixed" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
              Configurador Interativo
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl">
              MONTE SUA <span className="text-brasa-orange">CALDEIRA</span>
            </h1>
            <p className="text-brasa-gray mt-3 max-w-lg mx-auto">
              Selecione o modelo, aditivos e cor. Veja o preço atualizar em tempo real.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Config */}
            <div className="flex-1 space-y-10">
              {/* === STEP 1: Models with REAL Shared Layout Animation === */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-bebas text-3xl mb-6">
                  <span className="text-brasa-orange mr-2">01.</span> ESCOLHA O MODELO
                </h2>

                <LayoutGroup>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((product, i) => (
                      <TiltCard
                        key={product.id}
                        className={`cursor-pointer ${expandedModel !== null && expandedModel !== i ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => handleModelClick(i)}
                      >
                        {expandedModel !== i && (
                          <motion.div
                            layoutId={`cfg-model-${product.id}`}
                            className={`glass-card rounded-xl p-4 text-left h-full ${
                              selectedModel === i
                                ? "border-brasa-orange glow-orange-sm"
                                : "hover:border-brasa-orange/30"
                            } transition-colors duration-300`}
                          >
                            <motion.div
                              layoutId={`cfg-img-${product.id}`}
                              className="w-full h-24 rounded-lg mb-3 relative overflow-hidden"
                              style={{ background: product.gradient }}
                            >
                              <motion.div layoutId={`cfg-name-big-${product.id}`} className="absolute inset-0">
                                <ProductImage model={product.id as "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50"} />
                              </motion.div>
                              {i === 1 && (
                                <span className="absolute top-1 right-1 font-mono text-[10px] text-brasa-bg bg-brasa-gold px-1.5 py-0.5 rounded font-bold">
                                  TOP
                                </span>
                              )}
                            </motion.div>
                            <motion.h3 layoutId={`cfg-title-${product.id}`} className="font-bebas text-xl text-brasa-orange">
                              {product.name}
                            </motion.h3>
                            <p className="text-brasa-gray text-xs font-mono">{product.poolSize}</p>
                            <motion.p layoutId={`cfg-price-${product.id}`} className="font-bebas text-xl text-brasa-white mt-1">
                              R$ {product.price.toLocaleString("pt-BR")}
                            </motion.p>
                            {selectedModel === i && (
                              <div className="mt-2 text-center py-1 rounded bg-brasa-orange/20 text-brasa-orange font-mono text-[10px]">
                                SELECIONADO
                              </div>
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
                        layoutId={`cfg-model-${products[expandedModel].id}`}
                        className="glass-card rounded-2xl p-6 mt-4 overflow-hidden"
                        style={{ originY: 0 }}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <motion.div
                            layoutId={`cfg-img-${products[expandedModel].id}`}
                            className="w-full md:w-56 h-56 rounded-xl shrink-0 relative overflow-hidden"
                            style={{ background: products[expandedModel].gradient }}
                          >
                            <motion.div layoutId={`cfg-name-big-${products[expandedModel].id}`} className="absolute inset-0">
                              <ProductImage model={products[expandedModel].id as "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50"} />
                            </motion.div>
                          </motion.div>

                          <div className="flex-1">
                            <motion.h3
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
                                  transition={{ delay: 0.1 + idx * 0.05 }}
                                  className="flex items-center gap-2 text-brasa-gray text-xs"
                                >
                                  <span className="w-1.5 h-1.5 bg-brasa-orange rounded-full shrink-0" />
                                  {f}
                                </motion.li>
                              ))}
                            </ul>

                            <div className="flex items-center justify-between border-t border-brasa-border pt-4">
                              <motion.p
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
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LayoutGroup>
              </motion.section>

              {/* === STEP 2: Addons with GSAP stagger === */}
              <section>
                <h2 className="font-bebas text-3xl mb-2">
                  <span className="text-brasa-orange mr-2">02.</span> ADITIVOS OPCIONAIS
                </h2>
                <p className="text-brasa-gray text-sm mb-6 font-mono">
                  {selectedAddons.size} de {addons.length} selecionados
                </p>
                <div ref={addonsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.has(addon.id);
                    return (
                      <TiltCard key={addon.id} className="cursor-pointer" onClick={() => toggleAddon(addon.id)}>
                        <div
                          data-addon-card
                          className={`glass-card rounded-xl p-4 text-left transition-all duration-300 h-full ${
                            isSelected
                              ? "border-brasa-orange glow-orange-sm"
                              : "hover:border-brasa-orange/30"
                          }`}
                        >
                          <div
                            className={`w-full h-16 rounded-lg mb-3 flex items-center justify-center transition-all duration-300 ${
                              isSelected ? "bg-brasa-orange/20" : "bg-brasa-bg"
                            }`}
                          >
                            <motion.span
                              animate={isSelected ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
                              className={`font-bebas text-2xl ${
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
                          <p className="font-mono text-sm text-brasa-gold mt-2">
                            + R$ {addon.price.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>
              </section>

              {/* Color selector moved to sidebar for proximity to product image */}
            </div>

            {/* === RIGHT: Sticky Sidebar === */}
            <div className="lg:w-96 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-bebas text-2xl mb-4">RESUMO DO PEDIDO</h3>

                  {/* Product Photo — clean, no color filter */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4"
                    style={{ background: products[selectedModel].gradient }}
                  >
                    <ProductImage
                      model={products[selectedModel].id as "brasa-15" | "brasa-25" | "brasa-35" | "brasa-50"}
                      className="absolute inset-0"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="font-bebas text-sm text-white/70 bg-black/40 px-2 py-0.5 rounded">
                        {products[selectedModel].name}
                      </span>
                    </div>
                  </div>

                  {/* Color Swatches — selection only, no image tint */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-[10px] text-brasa-gray uppercase tracking-wider shrink-0">Cor:</span>
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        title={color.name}
                        className="relative"
                      >
                        <motion.div
                          animate={
                            selectedColor === color.id
                              ? { scale: 1.25, boxShadow: `0 0 12px ${color.hex}80` }
                              : { scale: 1, boxShadow: "none" }
                          }
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="w-7 h-7 rounded-full border-2"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: selectedColor === color.id ? "#FF4F00" : "#1E293B",
                          }}
                        />
                        {selectedColor === color.id && (
                          <motion.div
                            layoutId="color-ring"
                            className="absolute -inset-1 rounded-full border-2 border-brasa-orange"
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                        )}
                      </button>
                    ))}
                    <span className="font-mono text-[10px] text-brasa-gray ml-1">
                      {colors.find((c) => c.id === selectedColor)?.name}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-brasa-gray text-sm">{products[selectedModel].name}</span>
                      <span className="font-mono text-sm text-brasa-white">
                        R$ {products[selectedModel].price.toLocaleString("pt-BR")}
                      </span>
                    </div>

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
                            <span className="text-brasa-gray text-xs">{addon.name}</span>
                            <span className="font-mono text-xs text-brasa-gray">
                              + R$ {addon.price.toLocaleString("pt-BR")}
                            </span>
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="flex justify-between items-center">
                      <span className="text-brasa-gray text-xs">
                        Cor: {colors.find((c) => c.id === selectedColor)?.name}
                      </span>
                    </div>
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
                      `Olá! Quero comprar: ${products[selectedModel].name} na cor ${
                        colors.find((c) => c.id === selectedColor)?.name
                      }${selectedAddons.size > 0 ? ` com ${selectedAddons.size} aditivos` : ""}. Total: R$ ${total.toLocaleString("pt-BR")}`
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
                  className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:max-w-2xl md:mx-auto bg-brasa-bg-card border border-brasa-border rounded-2xl z-50 overflow-y-auto p-8"
                >
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brasa-bg border border-brasa-border flex items-center justify-center text-brasa-gray hover:text-white"
                  >
                    ✕
                  </button>

                  <h2 className="font-bebas text-4xl mb-6">CHECKOUT</h2>

                  <div className="mb-8">
                    <h3 className="font-bebas text-xl text-brasa-orange mb-4">ENDEREÇO DE ENTREGA</h3>
                    <div className="grid grid-cols-2 gap-4" id="address-form">
                      <div className="col-span-2 md:col-span-1">
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
                      <div className="col-span-2 md:col-span-1">
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

                  <div className="glass-card rounded-xl p-6 mb-8">
                    <h3 className="font-bebas text-xl mb-3">RESUMO</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brasa-gray">{products[selectedModel].name}</span>
                        <span className="font-mono">R$ {products[selectedModel].price.toLocaleString("pt-BR")}</span>
                      </div>
                      {addons.filter((a) => selectedAddons.has(a.id)).map((a) => (
                        <div key={a.id} className="flex justify-between">
                          <span className="text-brasa-gray text-xs">{a.name}</span>
                          <span className="font-mono text-xs">R$ {a.price.toLocaleString("pt-BR")}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span className="text-brasa-gray text-xs">
                          Cor: {colors.find((c) => c.id === selectedColor)?.name}
                        </span>
                      </div>
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
                    <div className="glass-card rounded-xl p-8 text-center">
                      <p className="text-brasa-gray font-mono text-sm mb-4">
                        Mercado Pago Checkout Bricks
                      </p>
                      <div className="flex justify-center gap-3 mb-4">
                        {[
                          { label: "PIX", desc: "QR Code dinâmico" },
                          { label: "Cartão", desc: "Até 12x" },
                          { label: "Boleto", desc: "Venc. 3 dias" },
                        ].map((method) => (
                          <div
                            key={method.label}
                            className="px-4 py-3 rounded-lg bg-brasa-bg border border-brasa-border text-center"
                          >
                            <span className="font-mono text-xs text-brasa-white block">{method.label}</span>
                            <span className="font-mono text-[10px] text-brasa-gray-dark">{method.desc}</span>
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
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
