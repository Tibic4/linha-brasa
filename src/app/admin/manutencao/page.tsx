"use client";

import { useState, useEffect, useCallback } from "react";

interface MaintenanceStep {
  id?: number | string;
  icon: string;
  title: string;
  description: string;
  frequency: string;
  order: number;
}

const EMPTY: MaintenanceStep = { icon: "", title: "", description: "", frequency: "", order: 0 };

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-brasa-green/90 text-white px-6 py-3 rounded-lg font-mono text-sm animate-fade-in shadow-lg">{message}</div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative glass-card rounded-2xl border border-brasa-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
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

const FREQ_COLORS: Record<string, string> = {
  "diario": "text-brasa-orange bg-brasa-orange/10",
  "semanal": "text-brasa-gold bg-brasa-gold/10",
  "mensal": "text-brasa-green bg-brasa-green/10",
  "trimestral": "text-blue-400 bg-blue-400/10",
  "anual": "text-purple-400 bg-purple-400/10",
};

export default function ManutencaoPage() {
  const [items, setItems] = useState<MaintenanceStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<MaintenanceStep>(EMPTY);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/maintenance");
      if (!res.ok) throw new Error("Erro ao carregar guia");
      const data = await res.json();
      setItems(Array.isArray(data) ? data.sort((a: MaintenanceStep, b: MaintenanceStep) => (a.order || 0) - (b.order || 0)) : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setForm({ ...EMPTY, order: items.length + 1 });
    setEditIndex(-1);
    setModalMode("create");
  };

  const openEdit = (item: MaintenanceStep, index: number) => {
    setForm({ ...item });
    setEditIndex(index);
    setModalMode("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/maintenance", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...form, index: editIndex } : form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast(isEdit ? "Etapa atualizada!" : "Etapa adicionada!");
      setModalMode(null);
      fetchItems();
    } catch {
      setToast("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string | undefined, index: number) => {
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, index }),
      });
      if (!res.ok) throw new Error("Erro");
      setToast("Etapa removida!");
      setConfirmDelete(null);
      setModalMode(null);
      fetchItems();
    } catch {
      setToast("Erro ao remover.");
    }
  };

  const getFreqColor = (freq: string) => {
    const key = freq.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return FREQ_COLORS[key] || "text-brasa-gray bg-brasa-bg";
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
        <button onClick={fetchItems} className="btn-brasa mt-4">TENTAR NOVAMENTE</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-2xl xs:text-3xl text-brasa-white tracking-wider">
            <span className="text-brasa-orange">06.</span> GUIA DE MANUTENCAO
          </h1>
          <p className="font-mono text-xs text-brasa-gray mt-1">{items.length} etapas cadastradas</p>
        </div>
        <button onClick={openCreate} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors">
          + NOVA ETAPA
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="glass-card rounded-xl border border-brasa-border p-4 xs:p-5 cursor-pointer hover:border-brasa-orange/30 transition-colors"
            onClick={() => openEdit(item, index)}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-brasa-orange/50">
                  {String(item.order || index + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bebas text-lg text-brasa-white tracking-wider">{item.title}</h3>
                  {item.frequency && (
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase ${getFreqColor(item.frequency)}`}>
                      {item.frequency}
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-brasa-gray mt-1 line-clamp-2">{item.description}</p>
              </div>
              <svg className="w-4 h-4 text-brasa-gray shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-10">
          <p className="font-mono text-sm text-brasa-gray">Nenhuma etapa cadastrada.</p>
        </div>
      )}

      {modalMode && (
        <Modal title={modalMode === "create" ? "Nova Etapa" : "Editar Etapa"} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Icone</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls + " text-center text-xl"} placeholder="🔧" />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Titulo</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Descricao</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Frequencia</label>
                <input value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={inputCls} placeholder="Diario, Semanal, Mensal..." />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Ordem</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brasa-border">
              {modalMode === "edit" ? (
                confirmDelete === editIndex ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-red-400">Confirmar?</span>
                    <button onClick={() => handleDelete(form.id, editIndex)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded font-mono text-xs">SIM</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-brasa-gray font-mono text-xs">NAO</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(editIndex)} className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-mono text-xs hover:bg-red-500/30 transition-colors">EXCLUIR</button>
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
