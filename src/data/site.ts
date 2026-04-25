/**
 * Single source of truth para metadados do site.
 *
 * Como Brasa Forge é projeto demonstrativo, telefone, email e CNPJ
 * são placeholders explícitos — isolar aqui evita que recrutador
 * ou usuário do site tente "ligar" para um número fake. Em produto
 * real, viriam de variáveis de ambiente.
 */

export const SITE = {
  name: "Brasa Forge",
  tagline: "Aquecedor de Piscina a Lenha",
  domain: "caldeira-showcase.vercel.app",

  // Demo flag — usado em UI para esconder/mostrar disclaimer
  isDemo: true,

  // Telefone WhatsApp em formato internacional (sem +, sem máscara)
  // Em projeto real, viria de NEXT_PUBLIC_WHATSAPP_NUMBER
  whatsappNumber: "5500000000000",

  // Como é demo: link genérico, sem CTA real
  whatsappUrl: "https://wa.me/?text=Tenho%20interesse%20no%20produto",

  contact: {
    email: "contato@brasaforge.demo",
    phoneDisplay: "WhatsApp · DEMO",
    address: "Brasil",
  },

  // Mensagem padrão do botão WhatsApp
  whatsappMessage:
    "Olá! Tenho interesse na Brasa Forge. (Projeto demo — não enviará mensagem real)",

  // Repo do portfolio
  github: "https://github.com/Tibic4",
} as const;

export type SiteConfig = typeof SITE;
