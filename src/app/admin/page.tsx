"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Stats {
  produtos: number;
  aditivos: number;
  cores: number;
  depoimentos: number;
  faq: number;
  manutencao: number;
}

interface HealthCheck {
  label: string;
  status: "ok" | "warn" | "error";
  detail: string;
}

const STAT_CARDS: {
  key: keyof Stats;
  label: string;
  icon: string;
  href: string;
}[] = [
  { key: "produtos", label: "Produtos", icon: "\u{1F525}", href: "/admin/produtos" },
  { key: "aditivos", label: "Aditivos", icon: "\u26A1", href: "/admin/aditivos" },
  { key: "cores", label: "Cores", icon: "\u{1F3A8}", href: "/admin/cores" },
  { key: "depoimentos", label: "Depoimentos", icon: "\u{1F4AC}", href: "/admin/depoimentos" },
  { key: "faq", label: "FAQs", icon: "\u2753", href: "/admin/faq" },
  { key: "manutencao", label: "Guia Manut.", icon: "\u{1F527}", href: "/admin/manutencao" },
];

const QUICK_LINKS = [
  { href: "/admin/produtos", label: "Gerenciar Produtos", icon: "\u{1F525}" },
  { href: "/admin/aditivos", label: "Gerenciar Aditivos", icon: "\u26A1" },
  { href: "/admin/cores", label: "Gerenciar Cores", icon: "\u{1F3A8}" },
  { href: "/admin/depoimentos", label: "Gerenciar Depoimentos", icon: "\u{1F4AC}" },
  { href: "/admin/faq", label: "Gerenciar FAQ", icon: "\u2753" },
  { href: "/admin/manutencao", label: "Guia Manuten\u00E7\u00E3o", icon: "\u{1F527}" },
];

// API routes map (Portuguese page names -> English API routes)
const API_MAP: Record<keyof Stats, string> = {
  produtos: "/api/admin/products",
  aditivos: "/api/admin/addons",
  cores: "/api/admin/colors",
  depoimentos: "/api/admin/testimonials",
  faq: "/api/admin/faq",
  manutencao: "/api/admin/maintenance",
};

async function fetchCount(url: string): Promise<number> {
  try {
    const res = await fetch(url);
    if (!res.ok) return 0;
    const data = await res.json();
    if (Array.isArray(data)) return data.filter((d: { active?: boolean }) => d.active !== false).length;
    return 0;
  } catch {
    return 0;
  }
}

function StatusDot({ status }: { status: "ok" | "warn" | "error" }) {
  const colors = {
    ok: "bg-green-500 shadow-green-500/50",
    warn: "bg-yellow-500 shadow-yellow-500/50",
    error: "bg-red-500 shadow-red-500/50",
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full shadow-md ${colors[status]}`} />;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    produtos: 0,
    aditivos: 0,
    cores: 0,
    depoimentos: 0,
    faq: 0,
    manutencao: 0,
  });
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);

  const loadStats = useCallback(async () => {
    const keys = Object.keys(API_MAP) as (keyof Stats)[];
    const counts = await Promise.all(keys.map((k) => fetchCount(API_MAP[k])));
    const newStats = {} as Stats;
    keys.forEach((k, i) => { newStats[k] = counts[i]; });
    setStats(newStats);
    setLoading(false);
    return newStats;
  }, []);

  const runHealthChecks = useCallback(async (s: Stats) => {
    const checks: HealthCheck[] = [];

    // 1. Produtos
    checks.push({
      label: "Produtos cadastrados",
      status: s.produtos >= 4 ? "ok" : s.produtos > 0 ? "warn" : "error",
      detail: s.produtos >= 4 ? `${s.produtos} modelos ativos` : s.produtos > 0 ? `Apenas ${s.produtos} modelos (esperado: 4)` : "Nenhum produto ativo",
    });

    // 2. Depoimentos
    checks.push({
      label: "Depoimentos (prova social)",
      status: s.depoimentos >= 5 ? "ok" : s.depoimentos >= 3 ? "warn" : "error",
      detail: s.depoimentos >= 5 ? `${s.depoimentos} depoimentos ativos` : s.depoimentos > 0 ? `${s.depoimentos} depoimentos (recomendado: 5+)` : "Sem depoimentos — impacta conversao",
    });

    // 3. FAQ
    checks.push({
      label: "FAQ (SEO + conversao)",
      status: s.faq >= 10 ? "ok" : s.faq >= 5 ? "warn" : "error",
      detail: s.faq >= 10 ? `${s.faq} perguntas ativas` : `${s.faq} perguntas (recomendado: 10+)`,
    });

    // 4. Cores
    checks.push({
      label: "Opcoes de cores",
      status: s.cores >= 4 ? "ok" : s.cores >= 2 ? "warn" : "error",
      detail: `${s.cores} cores disponiveis`,
    });

    // 5. Aditivos
    checks.push({
      label: "Aditivos (ticket medio)",
      status: s.aditivos >= 10 ? "ok" : s.aditivos >= 6 ? "warn" : "error",
      detail: s.aditivos >= 10 ? `${s.aditivos} opcoes — bom para upsell` : `${s.aditivos} opcoes (recomendado: 10+)`,
    });

    // 6. Guia Manutencao
    checks.push({
      label: "Guia de manutencao",
      status: s.manutencao >= 5 ? "ok" : s.manutencao > 0 ? "warn" : "error",
      detail: s.manutencao > 0 ? `${s.manutencao} passos documentados` : "Sem guia — pagina /manutencao vazia",
    });

    // 7. Meta tags (check if GA4/GTM is configured)
    try {
      const res = await fetch("/");
      const html = await res.text();
      const hasGTM = html.includes("GTM-") || html.includes("googletagmanager");
      const hasPixel = html.includes("fbq(") || html.includes("facebook.net");
      const hasGA = html.includes("gtag(") || html.includes("G-");
      const hasSchema = html.includes("application/ld+json");
      const hasOG = html.includes("og:title");

      checks.push({
        label: "Google Analytics / GTM",
        status: hasGTM || hasGA ? "ok" : "error",
        detail: hasGTM ? "GTM instalado" : hasGA ? "GA4 direto instalado" : "Nao detectado — sem tracking de conversao",
      });

      checks.push({
        label: "Meta Pixel (Facebook/Instagram)",
        status: hasPixel ? "ok" : "warn",
        detail: hasPixel ? "Pixel instalado" : "Nao detectado — sem retargeting de ads",
      });

      checks.push({
        label: "Schema Markup (SEO)",
        status: hasSchema ? "ok" : "warn",
        detail: hasSchema ? "JSON-LD detectado" : "Sem Schema — Google nao mostra rich results",
      });

      checks.push({
        label: "Open Graph (compartilhamento)",
        status: hasOG ? "ok" : "warn",
        detail: hasOG ? "OG tags detectadas" : "Sem OG — link no WhatsApp/Facebook sem preview",
      });
    } catch {
      checks.push({
        label: "Tags e tracking",
        status: "error",
        detail: "Nao foi possivel verificar — site offline?",
      });
    }

    // 8. Env vars
    checks.push({
      label: "Mercado Pago (checkout)",
      status: "warn",
      detail: "Aguardando credenciais — checkout nao funcional",
    });

    setHealth(checks);
    setHealthLoading(false);
  }, []);

  useEffect(() => {
    loadStats().then(runHealthChecks);
  }, [loadStats, runHealthChecks]);

  const okCount = health.filter((h) => h.status === "ok").length;
  const warnCount = health.filter((h) => h.status === "warn").length;
  const errorCount = health.filter((h) => h.status === "error").length;
  const totalChecks = health.length;
  const scorePercent = totalChecks > 0 ? Math.round((okCount / totalChecks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-bebas text-3xl xs:text-4xl md:text-5xl tracking-wider text-brasa-white">
            DASHBOARD
          </h1>
          <p className="font-mono text-xs text-brasa-gray uppercase tracking-widest mt-1">
            Visao geral do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-xs px-4 py-2 rounded-lg border border-brasa-border text-brasa-gray hover:text-brasa-white hover:border-brasa-orange/30 transition-colors"
          >
            Ver Site &rarr;
          </Link>
          <Link
            href="/manutencao"
            target="_blank"
            className="font-mono text-xs px-4 py-2 rounded-lg border border-brasa-border text-brasa-gray hover:text-brasa-white hover:border-brasa-orange/30 transition-colors"
          >
            Guia Publico &rarr;
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="glass-card rounded-xl p-4 hover:border-brasa-orange/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{card.icon}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 text-brasa-gray group-hover:text-brasa-orange transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="font-bebas text-3xl xs:text-4xl text-brasa-orange leading-none">
              {loading ? (
                <span className="inline-block w-10 h-8 bg-brasa-border/50 rounded animate-pulse" />
              ) : (
                stats[card.key]
              )}
            </div>
            <p className="font-mono text-[9px] xs:text-[10px] text-brasa-gray uppercase tracking-wider mt-1.5">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Health Check - Site Readiness */}
      <div className="glass-card rounded-xl p-5 xs:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bebas text-xl xs:text-2xl tracking-wider text-brasa-white flex items-center gap-2">
              SAUDE DO SITE
              <span className="font-mono text-xs text-brasa-gray font-normal tracking-normal lowercase">
                checklist automatico
              </span>
            </h2>
            <p className="font-mono text-[10px] text-brasa-gray mt-1">
              Verifica dados, tags, tracking e integracao em tempo real
            </p>
          </div>

          {!healthLoading && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1.5">
                  <StatusDot status="ok" /> <span className="text-green-400">{okCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <StatusDot status="warn" /> <span className="text-yellow-400">{warnCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <StatusDot status="error" /> <span className="text-red-400">{errorCount}</span>
                </span>
              </div>
              <div className="text-right">
                <div className={`font-bebas text-2xl leading-none ${scorePercent >= 80 ? "text-green-400" : scorePercent >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {scorePercent}%
                </div>
                <div className="font-mono text-[8px] text-brasa-gray uppercase tracking-wider">Score</div>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!healthLoading && (
          <div className="w-full h-2 bg-brasa-border rounded-full overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${scorePercent >= 80 ? "bg-green-500" : scorePercent >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        )}

        {healthLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-brasa-orange border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 font-mono text-xs text-brasa-gray">Verificando integridade...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {health.map((check, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  check.status === "ok"
                    ? "border-green-500/20 bg-green-500/5"
                    : check.status === "warn"
                    ? "border-yellow-500/20 bg-yellow-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <StatusDot status={check.status} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-brasa-white leading-tight">{check.label}</p>
                  <p className="font-mono text-[10px] text-brasa-gray leading-tight mt-0.5 truncate" title={check.detail}>
                    {check.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversion Funnel Diagram */}
      <div className="glass-card rounded-xl p-5 xs:p-6">
        <h2 className="font-bebas text-xl xs:text-2xl tracking-wider text-brasa-white mb-2">
          FUNIL DE CONVERSAO
        </h2>
        <p className="font-mono text-[10px] text-brasa-gray mb-6">
          Jornada do visitante — cada etapa depende dos dados cadastrados
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
          {[
            { step: "1", label: "Landing Page", sub: "Hero + Secoes", icon: "\u{1F310}", color: "border-blue-500/30 bg-blue-500/5", check: stats.produtos > 0 },
            { step: "2", label: "Interesse", sub: "Depoimentos + FAQ", icon: "\u{1F4AC}", color: "border-purple-500/30 bg-purple-500/5", check: stats.depoimentos >= 3 && stats.faq >= 5 },
            { step: "3", label: "Configurador", sub: "Modelo + Aditivos", icon: "\u2699\uFE0F", color: "border-brasa-orange/30 bg-brasa-orange/5", check: stats.aditivos >= 6 && stats.cores >= 2 },
            { step: "4", label: "Checkout", sub: "Mercado Pago", icon: "\u{1F4B3}", color: "border-yellow-500/30 bg-yellow-500/5", check: false },
            { step: "5", label: "Conversao", sub: "Venda realizada", icon: "\u{1F389}", color: "border-green-500/30 bg-green-500/5", check: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex-1 border rounded-lg p-3 sm:p-4 text-center ${item.color} relative`}>
                <span className="text-xl sm:text-2xl">{item.icon}</span>
                <p className="font-mono text-[10px] xs:text-xs text-brasa-white mt-1.5 font-medium">{item.label}</p>
                <p className="font-mono text-[8px] xs:text-[9px] text-brasa-gray">{item.sub}</p>
                <div className="absolute top-2 right-2">
                  {item.check ? (
                    <span className="text-green-400 text-xs">\u2713</span>
                  ) : (
                    <span className="text-brasa-gray text-xs">\u25CB</span>
                  )}
                </div>
              </div>
              {i < 4 && (
                <span className="text-brasa-gray px-1 sm:px-2 text-lg hidden sm:block">\u2192</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-brasa-bg border border-brasa-border">
          <p className="font-mono text-[10px] text-brasa-gray">
            <strong className="text-brasa-orange">TRACKING DE CONVERSAO:</strong> GA4 rastreia cada etapa automaticamente via eventos (page_view, add_to_cart, purchase). Configure o GTM_ID no <code>.env</code> para ativar. Meta Pixel rastreia PageView, AddToCart e Purchase para retargeting.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="font-bebas text-xl xs:text-2xl tracking-wider text-brasa-white mb-4">
          ACESSO RAPIDO
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card rounded-lg px-4 py-3 flex items-center gap-3 font-mono text-sm text-brasa-gray hover:text-brasa-white hover:border-brasa-orange/30 transition-colors"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Environment Status */}
      <div className="glass-card rounded-xl p-5 xs:p-6">
        <h2 className="font-bebas text-xl xs:text-2xl tracking-wider text-brasa-white mb-4">
          CONFIGURACAO DO AMBIENTE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "ADMIN_PASSWORD", status: "ok" as const, detail: "Configurado" },
            { label: "EMAILJS_SERVICE_ID", status: "warn" as const, detail: "Nao configurado" },
            { label: "EMAILJS_TEMPLATE_ID", status: "warn" as const, detail: "Nao configurado" },
            { label: "EMAILJS_PUBLIC_KEY", status: "warn" as const, detail: "Nao configurado" },
            { label: "MP_PUBLIC_KEY", status: "error" as const, detail: "Aguardando credenciais" },
            { label: "GTM_ID", status: "warn" as const, detail: "Nao configurado" },
          ].map((env) => (
            <div key={env.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brasa-bg border border-brasa-border">
              <StatusDot status={env.status} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] text-brasa-white truncate">{env.label}</p>
                <p className="font-mono text-[9px] text-brasa-gray">{env.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
