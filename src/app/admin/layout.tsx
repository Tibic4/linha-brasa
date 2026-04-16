"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "\u{1F4CA}" },
  { href: "/admin/produtos", label: "Produtos", icon: "\u{1F525}" },
  { href: "/admin/aditivos", label: "Aditivos", icon: "\u26A1" },
  { href: "/admin/cores", label: "Cores", icon: "\u{1F3A8}" },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: "\u{1F4AC}" },
  { href: "/admin/faq", label: "FAQ", icon: "\u2753" },
  { href: "/admin/manutencao", label: "Manuten\u00E7\u00E3o", icon: "\u{1F527}" },
];

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Senha incorreta.");
      }
    } catch {
      setError("Erro de conex\u00E3o.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brasa-bg flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-8 xs:p-10 w-full max-w-sm space-y-6"
      >
        <h1 className="font-bebas text-4xl xs:text-5xl text-center tracking-wider text-brasa-white">
          LINHA <span className="text-brasa-orange">BRASA</span>
        </h1>
        <p className="font-mono text-xs text-brasa-gray text-center uppercase tracking-widest">
          Painel Administrativo
        </p>

        <div className="space-y-2">
          <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:outline-none focus:border-brasa-orange transition-colors"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            autoFocus
          />
        </div>

        {error && (
          <p className="font-mono text-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-brasa w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "ENTRANDO..." : "ENTRAR"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      setAuthenticated(res.ok);
    } catch {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-brasa-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brasa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  // Authenticated layout
  return (
    <div className="min-h-screen bg-brasa-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 glass-card border-r border-brasa-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-brasa-border">
          <h2 className="font-bebas text-2xl tracking-wider text-brasa-white">
            LINHA <span className="text-brasa-orange">BRASA</span>
          </h2>
          <p className="font-mono text-[10px] text-brasa-gray uppercase tracking-widest mt-1">
            Admin
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                  active
                    ? "bg-brasa-orange/10 text-brasa-orange border border-brasa-orange/20"
                    : "text-brasa-gray hover:text-brasa-white hover:bg-brasa-bg-light"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-brasa-border space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-brasa-gray hover:text-brasa-white hover:bg-brasa-bg-light transition-colors"
          >
            <span className="text-lg">🌐</span>
            Ver Site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full text-left"
          >
            <span className="text-lg">🚪</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 bg-brasa-bg/80 backdrop-blur-md border-b border-brasa-border px-4 py-3 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-brasa-white hover:text-brasa-orange transition-colors"
            aria-label="Abrir menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bebas text-xl tracking-wider text-brasa-white">
            LINHA <span className="text-brasa-orange">BRASA</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 xs:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
