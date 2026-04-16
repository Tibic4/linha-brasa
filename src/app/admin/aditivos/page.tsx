"use client";

import { useState, useEffect, useCallback } from "react";

interface Addon {
  id: string;
  name: string;
  emoji: string;
  description: string;
  badge?: string;
  price: number;
  models: string;
  active?: boolean;
}

const EMPTY_ADDON: Omit<Addon, "id"> = {
  name: "",
  emoji: "",
  description: "",
  badge: "",
  price: 0,
  models: "todos",
  active: true,
};

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

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!active); }}
      className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${active ? "bg-brasa-green" : "bg-brasa-border"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative glass-card rounded-2xl border border-brasa-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bebas text-xl text-brasa-white tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-brasa-gray hover:text-brasa-white text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors";

export default function AditivosPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Addon, "id"> & { id?: string }>(EMPTY_ADDON);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAddons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/addons");
      if (!res.ok) throw new Error("Erro ao carregar aditivos");
      setAddons(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAddons(); }, [fetchAddons]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(v);

  const openCreate = () => {
    setForm({ ...EMPTY_ADDON });
    setModalMode("create");
  };

  const openEdit = (a: Addon) => {
    setForm({ ...a });
    setModalMode("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/addons", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast(isEdit ? "Aditivo atualizado!" : "Aditivo criado!");
      setModalMode(null);
      fetchAddons();
    } catch {
      setToast("Erro ao salvar aditivo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/addons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erro");
      setToast("Aditivo removido!");
      setConfirmDelete(null);
      fetchAddons();
    } catch {
      setToast("Erro ao remover aditivo.");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch("/api/admin/addons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
      setToast(active ? "Aditivo ativado" : "Aditivo desativado");
    } catch {
      setToast("Erro ao atualizar.");
    }
  };

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
        <button onClick={fetchAddons} className="btn-brasa mt-4">TENTAR NOVAMENTE</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-2xl xs:text-3xl text-brasa-white tracking-wider">
            <span className="text-brasa-orange">02.</span> ADITIVOS
          </h1>
          <p className="font-mono text-xs text-brasa-gray mt-1">{addons.length} aditivos cadastrados</p>
        </div>
        <button onClick={openCreate} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors">
          + ADICIONAR ADITIVO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addons.map((a) => (
          <div
            key={a.id}
            className="glass-card rounded-xl border border-brasa-border p-4 xs:p-5 cursor-pointer hover:border-brasa-orange/30 transition-colors"
            onClick={() => openEdit(a)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{a.emoji}</span>
                <div className="min-w-0">
                  <h3 className="font-bebas text-lg text-brasa-white tracking-wider truncate">{a.name}</h3>
                  <p className="font-mono text-sm text-brasa-orange font-bold">{fmt(a.price)}</p>
                </div>
              </div>
              <Toggle active={a.active !== false} onChange={(v) => handleToggle(a.id, v)} />
            </div>
            <p className="font-mono text-xs text-brasa-gray mt-3 line-clamp-2">{a.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="font-mono text-[10px] text-brasa-gray bg-brasa-bg px-2 py-0.5 rounded">
                {a.models}
              </span>
              {a.badge && (
                <span className="font-mono text-[10px] text-brasa-gold bg-brasa-gold/10 px-2 py-0.5 rounded">
                  {a.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalMode && (
        <Modal
          title={modalMode === "create" ? "Novo Aditivo" : "Editar Aditivo"}
          onClose={() => setModalMode(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-[60px_1fr] gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Emoji</label>
                <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className={inputCls + " text-center text-xl"} />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Nome</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Descricao</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Badge (opcional)</label>
                <input value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Preco (R$)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Modelos</label>
              <input value={form.models} onChange={(e) => setForm({ ...form, models: e.target.value })} className={inputCls} placeholder="todos | 60,120,200 | sul-sudeste" />
            </div>
            <div className="flex items-center gap-3">
              <Toggle active={form.active !== false} onChange={(v) => setForm({ ...form, active: v })} />
              <span className="font-mono text-xs text-brasa-gray">Ativo</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brasa-border">
              {modalMode === "edit" ? (
                confirmDelete === form.id ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-red-400">Confirmar?</span>
                    <button onClick={() => handleDelete(form.id!)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded font-mono text-xs">
                      SIM
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="text-brasa-gray font-mono text-xs">
                      NAO
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(form.id!)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-mono text-xs hover:bg-red-500/30 transition-colors">
                    EXCLUIR
                  </button>
                )
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg font-bebas tracking-wider text-brasa-gray border border-brasa-border hover:text-brasa-white transition-colors">
                  CANCELAR
                </button>
                <button onClick={handleSave} disabled={saving} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors disabled:opacity-50">
                  {saving ? "SALVANDO..." : "SALVAR"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
