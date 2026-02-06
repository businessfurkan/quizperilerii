"use client";

import { useState, useRef } from "react";
import { BoxNightTask } from "@prisma/client";
import { createBoxNightTask, updateBoxNightTask, deleteBoxNightTask } from "@/app/actions/box-night";
import { Trash2, Plus, Save, Upload, X, Lock, Skull, Heart, Zap, Gift, AlertTriangle, Check, Box as BoxIcon, RefreshCw, Bomb, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BoxNightAdminClientProps = {
  initialTasks: BoxNightTask[];
};

const ICONS = [
  { name: "Heart", icon: Heart },
  { name: "Lock", icon: Lock },
  { name: "Skull", icon: Skull },
  { name: "Zap", icon: Zap },
  { name: "Gift", icon: Gift },
  { name: "AlertTriangle", AlertTriangle },
  { name: "Bomb", icon: Bomb },
];

const TYPES = [
  { value: "reward", label: "Ödül", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "risk", label: "Risk", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "fun", label: "Eğlence", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

export default function BoxNightAdminClient({ initialTasks }: BoxNightAdminClientProps) {
  const [tasks, setTasks] = useState<BoxNightTask[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    text: "",
    type: "fun",
    icon: "Heart",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({ text: "", type: "fun", icon: "Heart", image: "" });
    setEditingId(null);
  };

  const handleEdit = (task: BoxNightTask) => {
    setEditingId(task.id);
    setFormData({
      text: task.text,
      type: task.type,
      icon: task.icon,
      image: task.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    try {
      await deleteBoxNightTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("Silme işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text) return alert("Görev metni zorunludur.");

    setLoading(true);
    try {
      if (editingId) {
        const updated = await updateBoxNightTask(editingId, formData);
        setTasks(tasks.map(t => t.id === editingId ? updated : t));
      } else {
        const created = await createBoxNightTask(formData);
        setTasks([created, ...tasks]);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      alert("İşlem başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) return alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      
      const formData = new FormData();
      formData.append("file", file);

      try {
        setLoading(true);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.files[0].url }));
      } catch (err) {
        console.error(err);
        alert("Görsel yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl border-4 border-[#2a0d59] p-6 shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]">
        <h2 className="text-2xl font-black text-[#2a0d59] mb-6 flex items-center gap-3">
          {editingId ? <RefreshCw className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          {editingId ? "Görevi Düzenle" : "Yeni Görev Ekle"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2a0d59] mb-2">Görev/Ceza Metni</label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={e => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#2a0d59]/20 focus:border-[#2a0d59] outline-none font-bold text-[#2a0d59] placeholder:text-[#2a0d59]/40"
                  placeholder="Örn: 10 şınav çek..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2a0d59] mb-2">Tür</label>
                <div className="flex gap-2">
                  {TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-bold border-2 transition-all",
                        formData.type === type.value
                          ? "border-[#2a0d59] bg-[#2a0d59] text-white"
                          : "border-gray-200 text-gray-400 hover:border-[#2a0d59]/50"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2a0d59] mb-2">İkon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all",
                        formData.icon === name
                          ? "border-[#2a0d59] bg-[#2a0d59] text-white"
                          : "border-gray-200 text-gray-400 hover:border-[#2a0d59]/50"
                      )}
                    >
                      {/* @ts-ignore */}
                      <Icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2a0d59] mb-2">Görsel (Opsiyonel)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative aspect-video rounded-xl border-2 border-dashed border-[#2a0d59]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#2a0d59]/5 transition-colors overflow-hidden group",
                    formData.image && "border-solid border-[#2a0d59]"
                  )}
                >
                  {formData.image ? (
                    <>
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold flex items-center gap-2">
                          <RefreshCw className="w-5 h-5" /> Değiştir
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-[#2a0d59]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-6 h-6 text-[#2a0d59]" />
                      </div>
                      <p className="text-[#2a0d59] font-bold">Görsel Yükle</p>
                      <p className="text-xs text-[#2a0d59]/60 mt-1">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {formData.image && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, image: "" });
                    }}
                    className="mt-2 text-red-500 text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" /> Görseli Kaldır
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#2a0d59] text-white py-4 rounded-xl font-black text-lg hover:bg-[#2a0d59]/90 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  {editingId ? "Değişiklikleri Kaydet" : "Görevi Ekle"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
           const iconData = ICONS.find(i => i.name === task.icon) || ICONS[0];
           const Icon = iconData.icon;
           const typeData = TYPES.find(t => t.value === task.type) || TYPES[2];

           return (
            <div 
              key={task.id} 
              className="bg-white rounded-2xl border-4 border-[#2a0d59] overflow-hidden shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] hover:translate-y-[-2px] transition-all group"
            >
              <div className="relative h-48 bg-gray-100 border-b-4 border-[#2a0d59]">
                {task.image ? (
                  <Image src={task.image} alt={task.text} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#2a0d59]/20">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   <span className={cn("px-3 py-1 rounded-full text-xs font-black uppercase border-2", typeData.color, "bg-white border-current")}>
                      {typeData.label}
                   </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2a0d59]/10 flex items-center justify-center shrink-0 border-2 border-[#2a0d59]">
                    {/* @ts-ignore */}
                    <Icon className="w-6 h-6 text-[#2a0d59]" />
                  </div>
                  <p className="font-bold text-[#2a0d59] line-clamp-3">{task.text}</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t-2 border-[#2a0d59]/10">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex-1 py-2 bg-[#d8b4fe] text-[#2a0d59] rounded-lg font-bold hover:bg-[#d8b4fe]/80 transition-colors text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
           );
        })}

        {/* Empty State / Add Placeholders if less than 12 */}
        {tasks.length < 12 && (
          <div className="col-span-full py-12 text-center bg-white/50 rounded-2xl border-4 border-dashed border-[#2a0d59]/20 flex flex-col items-center justify-center gap-4">
             <div className="p-4 bg-[#2a0d59]/10 rounded-full">
               <AlertTriangle className="w-8 h-8 text-[#2a0d59]" />
             </div>
             <div>
               <p className="text-xl font-black text-[#2a0d59]">Yetersiz Görev Sayısı</p>
               <p className="text-[#2a0d59]/70 font-medium">Şu an {tasks.length} görev var. Oyunun düzgün çalışması için en az 12 görev önerilir.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
