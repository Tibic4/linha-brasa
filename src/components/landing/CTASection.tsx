"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { trackLead, trackWhatsAppClick } from "@/components/shared/AnalyticsEvents";
import ProductImage from "@/components/shared/ProductImage";

export default function CTASection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", poolSize: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "SERVICE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "TEMPLATE_ID",
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          pool_size: form.poolSize,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "PUBLIC_KEY"
      );
      setSent(true);
      trackLead("form_contato");
    } catch {
      alert("Erro ao enviar. Tente pelo WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Olá! Tenho interesse na Linha Brasa. Gostaria de saber mais sobre as caldeiras para piscina."
  );

  return (
    <section className="section-padding bg-brasa-bg-light relative overflow-hidden">
      {/* Product render background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
        <ProductImage model="brasa-60" size="lg" className="w-[60vw] max-w-[700px] h-auto" />
      </div>
      <span className="watermark font-bebas bottom-10 right-10">CONTATO</span>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-brasa-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Fale Conosco
          </p>
          <h2 className="font-bebas text-2xl xs:text-3xl sm:text-5xl md:text-7xl">
            PRONTO PARA <span className="text-brasa-orange">ECONOMIZAR</span>?
          </h2>
          <p className="text-brasa-gray mt-4 max-w-xl mx-auto">
            Solicite um orçamento personalizado ou tire suas dúvidas pelo WhatsApp
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {sent ? (
              <div className="glass-card rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">🔥</span>
                <h3 className="font-bebas text-3xl text-brasa-orange mb-2">MENSAGEM ENVIADA!</h3>
                <p className="text-brasa-gray">Retornaremos em até 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 sm:p-8 space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white placeholder:text-brasa-gray-dark font-dm focus:border-brasa-orange outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white placeholder:text-brasa-gray-dark font-dm focus:border-brasa-orange outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (com DDD)"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white placeholder:text-brasa-gray-dark font-dm focus:border-brasa-orange outline-none transition-colors"
                />
                <select
                  value={form.poolSize}
                  onChange={(e) => setForm({ ...form, poolSize: e.target.value })}
                  className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-dm focus:border-brasa-orange outline-none transition-colors"
                >
                  <option value="">Tamanho da piscina</option>
                  <option value="ate-15000">Até 15.000L</option>
                  <option value="15000-25000">15.000 a 25.000L</option>
                  <option value="25000-35000">25.000 a 35.000L</option>
                  <option value="35000-50000">35.000 a 50.000L</option>
                  <option value="mais-50000">Mais de 50.000L</option>
                </select>
                <textarea
                  placeholder="Mensagem (opcional)"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white placeholder:text-brasa-gray-dark font-dm focus:border-brasa-orange outline-none transition-colors resize-none"
                />
                <button type="submit" disabled={sending} className="btn-brasa w-full text-base sm:text-xl">
                  {sending ? "ENVIANDO..." : "SOLICITAR ORÇAMENTO"}
                </button>
              </form>
            )}
          </motion.div>

          {/* WhatsApp + Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <a
              href={`https://wa.me/5543999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-4 hover:border-brasa-green/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] transition-all group text-center"
              onClick={() => trackWhatsAppClick("cta_section")}
            >
              <div className="w-20 h-20 rounded-full bg-brasa-green/20 flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform">
                💬
              </div>
              <div>
                <p className="font-bebas text-2xl xs:text-3xl sm:text-4xl text-brasa-green">FALE PELO WHATSAPP</p>
                <p className="text-brasa-gray text-sm">Resposta rápida — fale com um especialista</p>
              </div>
              <span className="inline-block bg-brasa-green text-white font-bebas text-base xs:text-lg sm:text-xl px-6 xs:px-8 sm:px-10 py-3 sm:py-4 rounded-lg group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-shadow">
                INICIAR CONVERSA
              </span>
            </a>

            <div className="glass-card rounded-2xl p-8 flex-1">
              <h3 className="font-bebas text-2xl mb-4 text-brasa-orange">POR QUE A LINHA BRASA?</h3>
              <ul className="space-y-3">
                {[
                  "Fabricação própria em Londrina/PR",
                  "Produto único — sem concorrentes no Brasil",
                  "Economia real de até 80% no aquecimento",
                  "2 anos de garantia de fábrica",
                  "Entrega e instalação para todo Brasil",
                  "Suporte técnico direto com fabricante",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-brasa-gray text-sm">
                    <span className="w-2 h-2 bg-brasa-orange rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
