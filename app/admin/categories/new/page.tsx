import { createCategory } from "@/app/actions";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-blue-900/10 rounded-xl transition-colors text-blue-900/60 hover:text-blue-900 border-2 border-transparent hover:border-blue-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Yeni Kategori Ekle</h1>
          <p className="text-blue-900/60 font-bold">Yeni bir kategori oluştur.</p>
        </div>
      </div>

      <form action={createCategory} className="space-y-8">
        <div className="bg-[#8bb9e0] border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900">Kategori Adı</label>
              <input
                name="name"
                required
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all placeholder:text-blue-900/40 font-bold"
                placeholder="Örn: Tarih"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900">Slug (URL)</label>
              <input
                name="slug"
                required
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all placeholder:text-blue-900/40 font-bold"
                placeholder="orn-tarih"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900">İkon (Lucide)</label>
              <input
                name="icon"
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all placeholder:text-blue-900/40 font-bold"
                placeholder="Örn: history"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-900">Gradient</label>
              <input
                name="gradient"
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all placeholder:text-blue-900/40 font-bold"
                placeholder="Örn: from-orange-500 to-red-500"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-blue-900">Açıklama</label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-4 py-3 text-blue-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] transition-all resize-none placeholder:text-blue-900/40 font-bold"
                placeholder="Kategori hakkında kısa bilgi..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-2 border-transparent hover:border-white/20"
          >
            <Save className="w-5 h-5" />
            Kategoriyi Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
