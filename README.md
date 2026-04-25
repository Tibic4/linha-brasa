# Brasa Forge — Landing E-commerce Demo

> Case study de landing page de e-commerce com animações pesadas, admin CMS e checkout integrado. Construído como projeto pessoal para praticar GSAP, Framer Motion e arquitetura completa de e-commerce em Next.js.

🌐 **Live:** [caldeira-showcase.vercel.app](https://caldeira-showcase.vercel.app)

> ⚠️ Projeto demonstrativo. Marca, produtos, preços e dados são fictícios.

---

## Sobre o projeto

Landing page de venda + admin CMS para um e-commerce fictício de aquecedores de piscina a lenha. Foco em **animações performáticas** (GSAP morphing, Framer Motion, vanilla-tilt) sem comprometer Core Web Vitals, e em **arquitetura completa** (frontend → admin → checkout → integração de pagamento).

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS 3 com design tokens custom |
| Animações | GSAP + @gsap/react · Framer Motion · vanilla-tilt · canvas-confetti · countup.js |
| Carrossel | Swiper |
| Pagamentos | Mercado Pago SDK (Bricks) |
| Storage | Vercel Blob (imagens do admin) |
| Email | EmailJS (formulário de contato) |
| Imagens | Sharp (otimização automática Next.js) |
| Analytics | Vercel Analytics + Speed Insights |
| Deploy | Vercel |

## Highlights de engenharia

### 1. Animações cinematográficas com performance

- **Hero com GSAP timeline** orquestrando entrada de elementos (logo morphing, fade-up sequencial, parallax)
- **Watermark gigante "BRASA FORGE"** em Bebas Neue com `clamp()` responsivo (60px → 400px) e pulsing scale infinito
- **Vanilla-tilt** em cards de produto (rotação 3D no hover)
- **CountUp** animado nos stats (anos de garantia, economia mensal, etc)
- **Confetti** após conversão (formulário enviado / checkout iniciado)
- **Swiper** em galeria de produtos com lazy-load

Todas as animações respeitam `prefers-reduced-motion` e usam `requestAnimationFrame` via GSAP — zero jank em mobile.

### 2. Admin CMS completo (`/admin`)

7 painéis separados:

- **Produtos** — CRUD com upload de imagens (Vercel Blob)
- **Cores** — paleta de cores disponíveis por produto
- **Aditivos** — itens opcionais (chimney kit, base, etc)
- **Depoimentos** — moderação e ordenação
- **FAQ** — gestão de perguntas frequentes
- **Manutenção** — modo manutenção do site

Tudo com formulários controlados, upload de arquivo, preview em tempo real.

### 3. Checkout Mercado Pago Bricks

Integração com `@mercadopago/sdk-react`:
- Wallet Brick (carteira MP)
- Card Payment Brick (cartão de crédito)
- Status Screen Brick (confirmação/falha)

Fluxo: configurador → resumo → pagamento → callback.

### 4. Configurador interativo (`/configurador`)

Cliente monta a caldeira escolhendo:
- Modelo (volume da piscina)
- Cor
- Aditivos opcionais

Preço atualiza em tempo real. Resumo persiste em URL params (link compartilhável).

### 5. Outros detalhes

- **SEO completo** — metadata + OpenGraph + JSON-LD Schema (Organization + Product)
- **Mobile-first** com breakpoints customizados em Tailwind
- **Otimização de imagens** — Next.js `<Image>` + Sharp + lazy-load + AVIF/WebP
- **Critters** para inline critical CSS
- **react-intersection-observer** para animações on-scroll

---

## Estrutura

```
src/
├── app/
│   ├── page.tsx                      # Landing principal
│   ├── configurador/                 # Configurador interativo
│   ├── manutencao/                   # Página de manutenção
│   ├── obrigado/                     # Pós-conversão
│   └── admin/                        # Painel admin (7 sub-rotas)
│       ├── produtos/
│       ├── cores/
│       ├── aditivos/
│       ├── depoimentos/
│       ├── faq/
│       └── manutencao/
├── components/
│   ├── landing/                      # Hero, Calculator, Comparison, FAQ, etc
│   ├── checkout/                     # Mercado Pago Bricks integration
│   ├── sales/                        # CTAs, badges, social proof
│   ├── shared/                       # Footer, SchemaMarkup, WhatsAppFloat
│   └── ui/                           # Primitivos
├── data/                             # Mock data (produtos, depoimentos, FAQ)
├── hooks/
│   ├── useGSAP.ts                    # Wrapper GSAP com cleanup
│   └── useTilt.ts                    # Wrapper vanilla-tilt
├── lib/                              # Utilities, configs
└── styles/                           # CSS globals + Tailwind tokens
```

---

## Como rodar

```bash
git clone https://github.com/Tibic4/linha-brasa.git
cd linha-brasa
npm install
npm run dev
```

Abre http://localhost:3000.

Para o admin: http://localhost:3000/admin

---

## Decisões de produto

- **WhatsApp como canal primário** — botão flutuante sempre visível, CTAs principais levam direto pro chat
- **Calculadora de economia em destaque** — comparação direta com GLP/elétrico
- **Showcase visual antes de specs** — fotos grandes, vídeos curtos
- **Admin sem auth real** — é demo; em produção real teria Clerk/NextAuth (auth atual é placeholder, ver auditoria)

---

## Aprendizados

- Animações GSAP em Server Components com Next.js App Router exigem cuidado com `useGSAP` + `gsap.context()` para cleanup
- Framer Motion `<AnimatePresence>` + Server Components → componente precisa ser `'use client'`
- Vercel Blob é mais simples que S3 para projetos pequenos, mas custa mais por GB
- Mercado Pago Bricks têm bom DX mas pouca documentação em casos edge (status screens custom)
- `clamp()` em CSS resolveu 90% dos problemas de responsive typography que antes precisavam media queries

---

## Auditoria de segurança

Como projeto demonstrativo, identifiquei limitações conhecidas que ficariam pra v2 se virasse produto real:

- **Auth admin é placeholder** — token estático em `lib/auth.ts`. Em produção real → Clerk/NextAuth com JWT + bcrypt
- **Upload Vercel Blob** sem validação de mime/size — em produção → whitelist + size limit + sanitização de filename
- **Rate limiting ausente** nas API routes — em produção → @upstash/ratelimit em login e endpoints de write
- **CSP/HSTS** não configurados — em produção → headers via `next.config.mjs` ou middleware

Os achados estão documentados em [docs/AUDITORIA.md](docs/AUDITORIA.md).

---

## Licença

Projeto pessoal. Marca e produtos fictícios. Use o código como referência à vontade.
