"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Poll, PollOption } from "@/lib/db";
import { Save, Upload, X, Image as ImageIcon, Plus, Trash2, Calendar, Link as LinkIcon, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type PollWithOptions = Poll & { options: PollOption[] };

type PollFormProps = {
  initialData?: PollWithOptions | null;
  action: (formData: FormData) => Promise<void>;
};

type OptionItem = {
  id: string; // temp id for key
  text: string;
  image?: string;
};

export default function PollForm({ initialData, action }: PollFormProps) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionItem[]>(
    initialData?.options.map((opt: PollOption) => ({ id: opt.id, text: opt.text, image: opt.image || undefined })) || 
    [{ id: "1", text: "" }, { id: "2", text: "" }]
  );
  
  // Format date for datetime-local input
  const formatDate = (date?: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert(`${file.name}: Geçersiz dosya türü.`);
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name}: Dosya boyutu çok yüksek (Max 5MB).`);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.files[0].url;
    } catch (err) {
      console.error(err);
      alert("Görsel yüklenemedi.");
      return null;
    }
  };

  const handleOptionImageChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await handleImageUpload(e.target.files[0]);
      if (url) {
        setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, image: url } : opt));
      }
    }
  };

  const addOption = () => {
    setOptions(prev => [...prev, { id: Date.now().toString(), text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      alert("En az 2 seçenek olmalıdır.");
      return;
    }
    setOptions(prev => prev.filter(opt => opt.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (options.length < 2) {
      alert("En az 2 seçenek gereklidir.");
      return;
    }

    if (options.some(opt => !opt.text.trim())) {
      alert("Tüm seçeneklerin metni dolu olmalıdır.");
      return;
    }

    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("options", JSON.stringify(options));
    
    try {
      await action(formData);
    } catch (error) {
      console.error("Error submitting poll:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* 1. TEMEL BİLGİLER */}
      <div className="bg-[#8bb9e0] border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-black text-blue-900 mb-4 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            1. Anket Detayları
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Soru</label>
            <input
              name="question"
              defaultValue={initialData?.question}
              required
              className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 placeholder:text-blue-900/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold text-lg"
              placeholder="Örn: En sevdiğiniz renk hangisi?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Açıklama (İsteğe bağlı)</label>
            <textarea
              name="description"
              defaultValue={initialData?.description || ""}
              rows={3}
              className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 placeholder:text-blue-900/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-medium resize-none"
              placeholder="Anket hakkında kısa bir açıklama..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Slug (URL)
                </label>
                <input
                name="slug"
                defaultValue={initialData?.slug}
                required
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 placeholder:text-blue-900/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold font-mono text-sm"
                placeholder="en-sevdiginiz-renk"
                />
            </div>
            
            <div className="flex items-center gap-4 pt-8">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-blue-900 w-full">
                    <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={initialData?.isActive ?? true}
                        id="isActive"
                        className="w-6 h-6 accent-blue-900 rounded-lg cursor-pointer"
                    />
                    <label htmlFor="isActive" className="font-bold text-blue-900 cursor-pointer select-none">
                        Anket Aktif
                    </label>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Başlangıç Tarihi
                </label>
                <input
                    type="datetime-local"
                    name="startDate"
                    defaultValue={formatDate(initialData?.startDate)}
                    className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Bitiş Tarihi (Opsiyonel)
                </label>
                <input
                    type="datetime-local"
                    name="endDate"
                    defaultValue={formatDate(initialData?.endDate)}
                    className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
                />
             </div>
          </div>
        </div>
      </div>

      {/* 2. SEÇENEKLER */}
      <div className="bg-white border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-blue-900 tracking-tight flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                2. Seçenekler
            </h2>
            <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-xl font-bold border-2 border-blue-900 hover:bg-blue-200 transition-colors"
            >
                <Plus className="w-5 h-5" />
                Seçenek Ekle
            </button>
        </div>

        <div className="space-y-4">
            {options.map((option, index) => (
                <div key={option.id} className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl border-2 border-blue-900/20 group hover:border-blue-900 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold">
                        {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <input
                            value={option.text}
                            onChange={(e) => updateOptionText(option.id, e.target.value)}
                            placeholder={`Seçenek ${index + 1}`}
                            className="w-full bg-white border-2 border-blue-900/20 rounded-lg px-3 py-2 text-blue-900 font-bold focus:border-blue-900 focus:outline-none transition-colors"
                        />
                        
                        <div className="flex items-center gap-3">
                             {option.image && (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-900 flex-shrink-0">
                                    <Image src={option.image} alt="Option" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setOptions(prev => prev.map(o => o.id === option.id ? { ...o, image: undefined } : o))}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                             )}
                             <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-blue-900/20 rounded-lg text-xs font-bold text-blue-900 hover:border-blue-900 transition-colors">
                                <ImageIcon className="w-3 h-3" />
                                {option.image ? "Görseli Değiştir" : "Görsel Ekle"}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleOptionImageChange(option.id, e)} />
                             </label>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-20">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-900"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-6 h-6" />
              Anketi Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
}
