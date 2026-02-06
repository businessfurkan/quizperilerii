"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Category, Quiz, TournamentItem } from "@/lib/db";
import { Save, Upload, X, Image as ImageIcon, Zap, AlignLeft, HelpCircle, Palette } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type QuizWithItems = Quiz & { items: TournamentItem[] };

type FormItem = {
  id: string;
  text: string;
  image: string;
  order?: number;
  quizId?: string;
};

type QuizFormProps = {
  categories: Category[];
  initialData?: QuizWithItems | null;
  isPopular?: boolean;
  action: (formData: FormData) => Promise<void>;
};

export default function QuizForm({ categories, initialData, isPopular = false, action }: QuizFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [items, setItems] = useState<FormItem[]>(initialData?.items || []);
  const [coverImage, setCoverImage] = useState<string>(initialData?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(Array.from(e.target.files));
    }
  };

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return `${file.name}: Geçersiz dosya türü. Sadece JPG, PNG, WEBP ve GIF yükleyebilirsiniz.`;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return `${file.name}: Dosya boyutu çok yüksek (Max 5MB).`;
    }
    return null;
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        setLoading(true);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Upload failed");
        }
        
        const data = await res.json();
        setCoverImage(data.files[0].url);
      } catch (err: any) {
        console.error(err);
        alert(`Kapak görseli yüklenemedi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFiles = async (files: File[]) => {
    // 1. Client-side Validation
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(`Bazı dosyalar yüklenemedi:\n${errors.join("\n")}`);
    }

    if (validFiles.length === 0) return;

    try {
      setLoading(true);
      setUploadProgress({ current: 0, total: validFiles.length });

      // Upload one by one to show progress
      const newItems: FormItem[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
           const errorData = await response.json();
           console.error(`Failed to upload ${file.name}: ${errorData.error}`);
           // Continue with other files but log error
           continue; 
        }

        const data = await response.json();
        if (data.files && data.files.length > 0) {
          const uploadedFile = data.files[0];
          newItems.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            text: uploadedFile.originalName.replace(/\.[^/.]+$/, ""),
            image: uploadedFile.url
          });
        }

        setUploadProgress({ current: i + 1, total: validFiles.length });
      }

      setItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Görseller yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const removeUniqueItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (items.length < 16) {
      alert(`En az 16 görsel yüklemelisiniz. Şu anki sayı: ${items.length}`);
      return;
    }

    setLoading(true);
    
    // Shuffle and pick 16 items if more than 16
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 16);
    
    const formData = new FormData(e.currentTarget);
    formData.append("items", JSON.stringify(selectedItems));
    
    try {
      await action(formData);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* 1. TEMEL BİLGİLER */}
      <div className="bg-[#8bb9e0] border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-black text-[#1e3a8a] mb-4 tracking-tight">1. Temel Bilgiler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a]">Quiz Başlığı</label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
              placeholder="Örn: Hangi 90'lar Şarkısısın?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a]">Kategori</label>
            <select
              name="categorySlug"
              defaultValue={initialData?.categorySlug}
              required
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
            >
              <option value="">Kategori Seçiniz...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1e3a8a]" />
              Kapak Görseli
            </label>
            <input type="hidden" name="image" value={coverImage} required />
            
            <div className="flex gap-4 items-start">
              {coverImage && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-[#1e3a8a] group flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
                  <Image 
                    src={coverImage} 
                    alt="Kapak" 
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 border-2 border-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div 
                onClick={() => coverInputRef.current?.click()}
                className={cn(
                  "flex-1 bg-white border-2 border-dashed border-[#1e3a8a]/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a] transition-colors gap-2",
                  coverImage ? "h-32" : "h-32"
                )}
              >
                <input 
                  ref={coverInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverImageChange} 
                  className="hidden" 
                />
                <Upload className="w-8 h-8 text-[#1e3a8a]/40" />
                <span className="text-[#1e3a8a]/60 text-sm font-bold">Görsel seçmek için tıklayın</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1e3a8a]" />
              Zorluk Seviyesi
            </label>
            <select
              name="difficulty"
              defaultValue={initialData?.difficulty}
              required
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
            >
              <option value="Kolay">Kolay</option>
              <option value="Orta">Orta</option>
              <option value="Zor">Zor</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)]">
             <input
               type="checkbox"
               name="isPopular"
               defaultChecked={isPopular}
               id="isPopular"
               className="w-5 h-5 rounded-md border-[#1e3a8a] text-[#1e3a8a] focus:ring-[#1e3a8a]"
             />
             <label htmlFor="isPopular" className="text-sm font-bold text-[#1e3a8a] select-none cursor-pointer">
               Popüler Quizlere Ekle
             </label>
          </div>

          {/* Hidden fields for default values */}
          <input type="hidden" name="icon" value={initialData?.icon || "star"} />
          <input type="hidden" name="gradient" value={initialData?.gradient || "from-[#1e3a8a] to-pink-500"} />
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-[#1e3a8a]">Kısa Açıklama (Opsiyonel)</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              rows={2}
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all resize-none font-bold"
              placeholder="Quiz hakkında kısa bilgi..."
            />
          </div>
        </div>
      </div>

      {/* 2. TOPLU GÖRSEL YÜKLEME */}
      <div className="bg-[#8bb9e0] border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#1e3a8a] tracking-tight">2. Görselleri Yükle</h2>
          <span className={cn(
            "px-4 py-2 rounded-full text-sm font-black transition-colors border-2",
            items.length >= 16 ? "bg-green-100 text-green-800 border-green-600" : "bg-red-100 text-red-800 border-red-600"
          )}>
            {items.length} / 16+ Görsel
          </span>
        </div>

        <div 
          className={cn(
            "relative border-4 border-dashed rounded-3xl p-12 transition-all text-center group cursor-pointer bg-white",
            dragActive ? "border-[#1e3a8a] bg-[#1e3a8a]/5" : "border-[#1e3a8a]/30 hover:border-[#1e3a8a] hover:bg-[#1e3a8a]/5"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-[#1e3a8a]/20">
              <Upload className="w-10 h-10 text-[#1e3a8a]/60 group-hover:text-[#1e3a8a] transition-colors" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#1e3a8a] mb-2">Görselleri Sürükle ve Bırak</p>
              <p className="text-[#1e3a8a]/60 font-medium">veya dosya seçmek için tıklayın</p>
            </div>
            <p className="text-sm text-[#1e3a8a]/40 font-bold max-w-md mx-auto">
              En az 16 görsel yüklemelisiniz. Sistem otomatik olarak turnuva eşleşmelerini ayarlayacaktır.
            </p>
          </div>
          
          {/* Progress Bar Overlay */}
          {loading && uploadProgress && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-[#1e3a8a] font-bold">
                  <span>Yükleniyor...</span>
                  <span>{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <div className="h-4 bg-[#1e3a8a]/10 rounded-full overflow-hidden border-2 border-[#1e3a8a]">
                  <div 
                    className="h-full bg-[#1e3a8a] transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Previews */}
        {items.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8">
            {items.map((item, index) => (
              <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-[#1e3a8a] bg-white shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)]">
                <Image 
                  src={item.image} 
                  alt={item.text} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                />
                <button
                  type="button"
                  onClick={() => removeUniqueItem(item.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 border border-white"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/95 backdrop-blur-sm border-t-2 border-[#1e3a8a]">
                  <p className="text-[10px] text-[#1e3a8a] truncate font-black">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SONUÇ AYARI (OPSİYONEL) */}
      <div className="bg-[#8bb9e0] border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-black text-[#1e3a8a] mb-4 tracking-tight">3. Sonuç Ayarları (Opsiyonel)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a]">Sonuç Başlığı</label>
            <input
              name="resultTitle"
              defaultValue={initialData?.resultTitle || ""}
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
              placeholder="Varsayılan: ŞAMPİYON"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1e3a8a]">Sonuç Açıklaması</label>
            <input
              name="resultDescription"
              defaultValue={initialData?.resultDescription || ""}
              className="w-full bg-white border-2 border-[#1e3a8a] rounded-xl px-4 py-3 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all font-bold"
              placeholder="Varsayılan: Senin favorin seçildi!"
            />
          </div>
        </div>
      </div>

      {/* 5. SUBMIT BUTTON */}
      <div className="sticky bottom-6 z-50">
        <button
          type="submit"
          disabled={loading || items.length < 16}
          className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-6 rounded-2xl font-black text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform border-2 border-transparent hover:border-white/20 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Quiz Oluştur ve Yayınla
            </>
          )}
        </button>
      </div>
    </form>
  );
}
