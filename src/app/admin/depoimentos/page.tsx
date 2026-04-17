"use client";

import { useState, useEffect, useCallback } from "react";

interface Testimonial {
  id: number | string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
  model: string;
  poolSize: string;
  result: string;
  active?: boolean;
}

function resizeImage(file: File, maxSize: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize; }
        } else {
          if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("Falha ao converter imagem")),
          "image/jpeg",
          quality,
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File): Promise<string> {
  const resized = await resizeImage(file, 200, 0.85);
  const formData = new FormData();
  formData.append("file", resized, `${Date.now()}.jpg`);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Erro ao enviar imagem");
  const { url } = await res.json();
  return url;
}

const MODELS = ["brasa-30", "brasa-60", "brasa-120", "brasa-200"];

const EMPTY: Omit<Testimonial, "id"> = {
  name: "", location: "", rating: 5, text: "", model: "brasa-60", poolSize: "", result: "", active: true,
};

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-brasa-green/90 text-white px-6 py-3 rounded-lg font-mono text-sm animate-fade-in shadow-lg">{message}</div>
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

function Stars({ rating, onChange }: { rating: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          className={`text-lg transition-colors ${i <= rating ? "text-brasa-gold" : "text-brasa-border"} ${onChange ? "cursor-pointer hover:text-brasa-gold" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const inputCls = "w-full bg-brasa-bg border border-brasa-border rounded-lg px-4 py-3 text-brasa-white font-mono text-sm focus:border-brasa-orange outline-none transition-colors";

export default function DepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "id"> & { id?: number | string; image?: string }>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | string | null>(null);
  const [filterModel, setFilterModel] = useState<string>("all");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Erro ao carregar depoimentos");
      setItems(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setForm({ ...EMPTY }); setModalMode("create"); };
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setModalMode("edit"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = modalMode === "edit";
      const res = await fetch("/api/admin/testimonials", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setToast(isEdit ? "Depoimento atualizado!" : "Depoimento criado!");
      setModalMode(null);
      fetchItems();
    } catch {
      setToast("Erro ao salvar depoimento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erro");
      setToast("Depoimento removido!");
      setConfirmDelete(null);
      setModalMode(null);
      fetchItems();
    } catch {
      setToast("Erro ao remover.");
    }
  };

  const handleToggle = async (id: number | string, active: boolean) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active }),
      });
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, active } : t)));
      setToast(active ? "Depoimento ativado" : "Depoimento desativado");
    } catch {
      setToast("Erro ao atualizar.");
    }
  };

  const filtered = filterModel === "all" ? items : items.filter((t) => t.model === filterModel);
  const activeCount = items.filter((t) => t.active !== false).length;

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
            <span className="text-brasa-orange">04.</span> DEPOIMENTOS
          </h1>
          <p className="font-mono text-xs text-brasa-gray mt-1">
            {activeCount} ativos na landing | {items.length} total
          </p>
        </div>
        <button onClick={openCreate} className="bg-brasa-orange text-white px-6 py-2 rounded-lg font-bebas tracking-wider hover:bg-brasa-orange-dark transition-colors">
          + NOVO DEPOIMENTO
        </button>
      </div>

      {/* Info bar */}
      <div className="glass-card rounded-lg border border-brasa-border p-3 flex flex-col xs:flex-row xs:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-brasa-green">●</span>
          <span className="font-mono text-xs text-brasa-gray">
            Ativos aparecem na <strong className="text-brasa-white">landing page</strong>
          </span>
        </div>
        <span className="hidden xs:block text-brasa-border">|</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-brasa-orange">●</span>
          <span className="font-mono text-xs text-brasa-gray">
            No <strong className="text-brasa-white">configurador</strong>, filtrados por modelo
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterModel("all")}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${filterModel === "all" ? "bg-brasa-orange/20 text-brasa-orange border border-brasa-orange/30" : "text-brasa-gray border border-brasa-border hover:text-brasa-white"}`}
        >
          Todos ({items.length})
        </button>
        {MODELS.map((m) => {
          const count = items.filter((t) => t.model === m).length;
          return (
            <button
              key={m}
              onClick={() => setFilterModel(m)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${filterModel === m ? "bg-brasa-orange/20 text-brasa-orange border border-brasa-orange/30" : "text-brasa-gray border border-brasa-border hover:text-brasa-white"}`}
            >
              {m.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="glass-card rounded-xl border border-brasa-border p-4 xs:p-5 cursor-pointer hover:border-brasa-orange/30 transition-colors"
            onClick={() => openEdit(t)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brasa-orange/20 text-brasa-orange flex items-center justify-center font-bebas text-lg shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bebas text-lg text-brasa-white tracking-wider">{t.name}</h3>
                  <p className="font-mono text-xs text-brasa-gray">{t.location}</p>
                </div>
              </div>
              <Toggle active={t.active !== false} onChange={(v) => handleToggle(t.id, v)} />
            </div>
            <Stars rating={t.rating} />
            <p className="font-mono text-xs text-brasa-gray mt-2 line-clamp-2">{t.text}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="font-mono text-[10px] text-brasa-orange bg-brasa-orange/10 px-2 py-0.5 rounded">{t.model.toUpperCase()}</span>
              <span className="font-mono text-[10px] text-brasa-gray bg-brasa-bg px-2 py-0.5 rounded">{t.poolSize}</span>
              {t.result && <span className="font-mono text-[10px] text-brasa-green bg-brasa-green/10 px-2 py-0.5 rounded">{t.result}</span>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="font-mono text-sm text-brasa-gray">Nenhum depoimento encontrado.</p>
        </div>
      )}

      {modalMode && (
        <Modal title={modalMode === "create" ? "Novo Depoimento" : "Editar Depoimento"} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Nome</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Localizacao</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
              </div>
            </div>
            {/* Photo upload */}
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Foto</label>
              <div className="flex items-center gap-4">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-brasa-orange/30" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-brasa-orange/20 text-brasa-orange flex items-center justify-center font-bebas text-2xl border-2 border-dashed border-brasa-border">
                    {form.name ? form.name.charAt(0) : "?"}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <label className="block cursor-pointer">
                    <span className="inline-block bg-brasa-orange/10 text-brasa-orange border border-brasa-orange/30 px-4 py-2 rounded-lg font-mono text-xs hover:bg-brasa-orange/20 transition-colors">
                      {uploading ? "ENVIANDO..." : form.image ? "TROCAR FOTO" : "ENVIAR FOTO"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setUploading(true);
                          const url = await uploadImage(file);
                          setForm({ ...form, image: url });
                        } catch {
                          setToast("Erro ao enviar imagem.");
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                  </label>
                  <p className="font-mono text-[9px] text-brasa-gray">Redimensiona para 200x200px automaticamente. Qualquer tamanho aceito.</p>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: undefined })}
                      className="font-mono text-[10px] text-red-400 hover:text-red-300"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Avaliacao</label>
              <Stars rating={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div>
              <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Texto</label>
              <textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Modelo</label>
                <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={inputCls}>
                  {MODELS.map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Piscina</label>
                <input value={form.poolSize} onChange={(e) => setForm({ ...form, poolSize: e.target.value })} className={inputCls} placeholder="35.000L" />
              </div>
              <div>
                <label className="font-mono text-xs text-brasa-gray uppercase tracking-wider block mb-1">Resultado</label>
                <input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className={inputCls} placeholder="Aqueceu em 8h" />
              </div>
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
