"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/#modelos", label: "Modelos" },
  { href: "/#calculadora", label: "Calculadora" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-brasa-bg/90 backdrop-blur-lg border-b border-brasa-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brasa-orange rounded-lg flex items-center justify-center">
              <span className="font-bebas text-white text-lg">B</span>
            </div>
            <span className="font-bebas text-2xl tracking-wider">
              LINHA <span className="text-brasa-orange">BRASA</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-wider text-brasa-gray hover:text-brasa-orange transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
            <a href="/configurador" className="btn-brasa !py-2 !px-6 !text-sm">
              COMPRAR
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-brasa-white block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-brasa-white block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-brasa-white block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-brasa-bg/95 backdrop-blur-lg z-40 pt-16 sm:pt-20 px-4 sm:px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-bebas text-2xl sm:text-3xl md:text-4xl text-brasa-white hover:text-brasa-orange transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/configurador"
                className="btn-brasa text-center text-xl mt-4"
                onClick={() => setMobileOpen(false)}
              >
                COMPRAR AGORA
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
