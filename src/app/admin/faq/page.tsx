"use client";

import { useState, useEffect, useCallback } from "react";

interface FaqItem {
  id?: number | string;
  question: string;
  answer: string;
}

const EMPTY: FaqItem = { question: "", answer: "" };

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

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<FaqItem>(EMPTY);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faq");
      if (!res.ok) throw new Error("Erro ao carregar FAQ");
      setItems(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setForm({ ...EMPTY }); setEditIndex(-1); setModalMode("create"); };
  const openEdit = (item: FaqItem, index: number) => { setForm({ ...item }); setEditIndex(index); setModalMode("edit"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/faq", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...form, index: editIndex } : form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast(isEdit ? "Pergunta atualizada!" : "Pergunta adicionada!");
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
      const res = await fetch("/api/admin/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, index }),
      });
      if (!res.ok) throw new Error("Erro");
      setToast("Pergunta removida!");
      setConfirmDelete(null);
      setModalMode(null);
      fetchItems();
    } catch {
      setToast("Erro ao remover.");
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
            <span className="text-brasa-orange">05.</span> FAQ
          </h1>
          <p className="font-mono text-xs text-brasa-gray mt-1">{items.length} perguntas cadastradas</p>
        </div>
        <button onClick={openCreate} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors">
          + NOVA PERGUNTA
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const expanded = expandedId === index;
          return (
            <div key={item.id || index} className="glass-card rounded-xl border border-brasa-border overflow-hidden">
              <div
                className="p-4 xs:p-5 cursor-pointer hover:bg-brasa-bg-light/30 transition-colors flex items-start gap-3"
                onClick={() => setExpandedId(expanded ? null : index)}
              >
                <span className="font-mono text-xs text-brasa-orange shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-sm text-brasa-white flex-1">{item.question}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(item, index); }}
                    className="text-brasa-gray hover:text-brasa-orange transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <svg
                    className={`w-4 h-4 text-brasa-gray transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expanded && (
                <div className="px-4 xs:px-5 pb-4 xs:pb-5 border-t border-brasa-border pt-3 animate-fade-in">
                  <p className="font-mono text-xs text-brasa-gray leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-10">
          <p className="font-mono text-sm text-brasa-gray">Nenhuma pergunta cadastrada.</p>
        </div>
      )}

      {modalMode && (
        <Modal title={modalMode === "create" ? "Nova Pergunta" : "Editar Pergunta"} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Pergunta</label>
              <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Resposta</label>
              <textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={inputCls + " resize-none"} />
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
