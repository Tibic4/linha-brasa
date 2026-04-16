"use client";

import { useState, useEffect, useCallback } from "react";

interface Color {
  id: string;
  name: string;
  hex: string;
  price: number;
  active?: boolean;
}

const EMPTY_COLOR: Omit<Color, "id"> = { name: "", hex: "#000000", price: 0, active: true };

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-brasa-green/90 text-white px-6 py-3 rounded-lg font-mono text-sm animate-fade-in shadow-lg">
      {message}
    </div>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onChange(!active); }}
      className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${active ? "bg-brasa-green" : "bg-brasa-border"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative glass-card rounded-2xl border border-brasa-border w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
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

export default function CoresPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Color, "id"> & { id?: string }>(EMPTY_COLOR);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/colors");
      if (!res.ok) throw new Error("Erro ao carregar cores");
      setColors(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchColors(); }, [fetchColors]);

  const fmt = (v: number) =>
    v === 0 ? "Incluso" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(v);

  const openCreate = () => { setForm({ ...EMPTY_COLOR }); setModalMode("create"); };
  const openEdit = (c: Color) => { setForm({ ...c }); setModalMode("edit"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/colors", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast(isEdit ? "Cor atualizada!" : "Cor criada!");
      setModalMode(null);
      fetchColors();
    } catch {
      setToast("Erro ao salvar cor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/colors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erro");
      setToast("Cor removida!");
      setConfirmDelete(null);
      setModalMode(null);
      fetchColors();
    } catch {
      setToast("Erro ao remover cor.");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await fetch("/api/admin/colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      setColors((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
      setToast(active ? "Cor ativada" : "Cor desativada");
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
        <button onClick={fetchColors} className="btn-brasa mt-4">TENTAR NOVAMENTE</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-2xl xs:text-3xl text-brasa-white tracking-wider">
            <span className="text-brasa-orange">03.</span> CORES
          </h1>
          <p className="font-mono text-xs text-brasa-gray mt-1">{colors.length} cores cadastradas</p>
        </div>
        <button onClick={openCreate} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors">
          + NOVA COR
        </button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((c) => (
          <div
            key={c.id}
            className="glass-card rounded-xl border border-brasa-border p-4 cursor-pointer hover:border-brasa-orange/30 transition-colors"
            onClick={() => openEdit(c)}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-brasa-border shadow-lg"
                style={{ backgroundColor: c.hex }}
              />
              <Toggle active={c.active !== false} onChange={(v) => handleToggle(c.id, v)} />
            </div>
            <h3 className="font-bebas text-lg text-brasa-white tracking-wider">{c.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs text-brasa-gray uppercase">{c.hex}</span>
              <span className={`font-mono text-xs ${c.price === 0 ? "text-brasa-green" : "text-brasa-orange"}`}>
                {fmt(c.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalMode && (
        <Modal title={modalMode === "create" ? "Nova Cor" : "Editar Cor"} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Cor</label>
                <input
                  type="color"
                  value={form.hex}
                  onChange={(e) => setForm({ ...form, hex: e.target.value })}
                  className="w-16 h-16 rounded-lg border border-brasa-border cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Nome</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Hex</label>
                <input value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Preco (R$)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Toggle active={form.active !== false} onChange={(v) => setForm({ ...form, active: v })} />
              <span className="font-mono text-xs text-brasa-gray">Ativa</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brasa-border">
              {modalMode === "edit" ? (
                confirmDelete === form.id ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-red-400">Confirmar?</span>
                    <button onClick={() => handleDelete(form.id!)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded font-mono text-xs">SIM</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-brasa-gray font-mono text-xs">NAO</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(form.id!)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-mono text-xs hover:bg-red-500/30 transition-colors">EXCLUIR</button>
                )
              ) : <div />}
              <div className="flex gap-3">
                <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-lg font-bebas tracking-wider text-brasa-gray border border-brasa-border hover:text-brasa-white transition-colors">CANCELAR</button>
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
