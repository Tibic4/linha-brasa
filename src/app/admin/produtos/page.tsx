"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  poolSize: string;
  power: string;
  price: number;
  description: string;
  features: string[];
  active?: boolean;
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-brasa-green/90 text-white px-6 py-3 rounded-lg font-mono text-sm animate-fade-in shadow-lg">
      {message}
    </div>
  );
}

function Toggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`w-10 h-5 rounded-full relative transition-colors ${
        active ? "bg-brasa-green" : "bg-brasa-border"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          active ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, Partial<Product>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      const data = await res.json();
      setProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    const p = products.find((x) => x.id === id)!;
    setEditData((prev) => ({
      ...prev,
      [id]: {
        name: p.name,
        subtitle: p.subtitle,
        price: p.price,
        description: p.description,
        features: [...p.features],
      },
    }));
    setExpandedId(id);
  };

  const updateField = (id: string, field: string, value: unknown) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData[id] }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast("Produto atualizado com sucesso!");
      setExpandedId(null);
      fetchProducts();
    } catch {
      setToast("Erro ao salvar produto.");
    } finally {
      setSaving(null);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      if (!res.ok) throw new Error("Erro");
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active } : p))
      );
      setToast(active ? "Produto ativado" : "Produto desativado");
    } catch {
      setToast("Erro ao atualizar status.");
    }
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(v);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brasa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="font-mono text-red-400 text-sm">{error}</p>
        <button onClick={fetchProducts} className="btn-brasa mt-4">
          TENTAR NOVAMENTE
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      <div>
        <h1 className="font-bebas text-2xl xs:text-3xl text-brasa-white tracking-wider">
          <span className="text-brasa-orange">01.</span> PRODUTOS
        </h1>
        <p className="font-mono text-xs text-brasa-gray mt-1">
          4 modelos fixos - edite precos, descricoes e status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const expanded = expandedId === p.id;
          const ed = editData[p.id] || {};
          return (
            <div
              key={p.id}
              className="glass-card rounded-xl border border-brasa-border overflow-hidden transition-all"
            >
              {/* Card header */}
              <div
                className="p-4 xs:p-5 cursor-pointer hover:bg-brasa-bg-light/30 transition-colors"
                onClick={() => handleExpand(p.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-xl text-brasa-white tracking-wider">
                      {p.name}
                    </h3>
                    <p className="font-mono text-xs text-brasa-gray mt-0.5">
                      {p.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Toggle
                      active={p.active !== false}
                      onChange={(v) => {
                        // prevent expand toggle
                        handleToggle(p.id, v);
                      }}
                    />
                    <svg
                      className={`w-4 h-4 text-brasa-gray transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="font-mono text-xs text-brasa-gray bg-brasa-bg px-2 py-1 rounded">
                    {p.poolSize}
                  </span>
                  <span className="font-mono text-xs text-brasa-gray bg-brasa-bg px-2 py-1 rounded">
                    {p.power}
                  </span>
                  <span className="font-mono text-sm text-brasa-orange font-bold">
                    {fmt(p.price)}
                  </span>
                </div>
              </div>

              {/* Expanded edit form */}
              {expanded && (
                <div className="border-t border-brasa-border p-4 xs:p-5 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">
                        Nome
                      </label>
                      <input
                        value={ed.name || ""}
                        onChange={(e) =>
                          updateField(p.id, "name", e.target.value)
                        }
                        className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">
                        Subtitulo
                      </label>
                      <input
                        value={ed.subtitle || ""}
                        onChange={(e) =>
                          updateField(p.id, "subtitle", e.target.value)
                        }
                        className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">
                      Preco (R$)
                    </label>
                    <input
                      type="number"
                      value={ed.price || 0}
                      onChange={(e) =>
                        updateField(p.id, "price", Number(e.target.value))
                      }
                      className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">
                      Descricao
                    </label>
                    <textarea
                      rows={3}
                      value={ed.description || ""}
                      onChange={(e) =>
                        updateField(p.id, "description", e.target.value)
                      }
                      className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">
                      Features (uma por linha)
                    </label>
                    <textarea
                      rows={4}
                      value={(ed.features || []).join("\n")}
                      onChange={(e) =>
                        updateField(
                          p.id,
                          "features",
                          e.target.value.split("\n")
                        )
                      }
                      className="w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-4 py-2 rounded-lg font-bebas tracking-wider text-brasa-gray border border-brasa-border hover:text-brasa-white transition-colors"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={() => handleSave(p.id)}
                      disabled={saving === p.id}
                      className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors disabled:opacity-50"
                    >
                      {saving === p.id ? "SALVANDO..." : "SALVAR"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
