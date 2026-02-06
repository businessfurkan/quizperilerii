import { updateCategory } from "@/app/actions";
import { getCategoryById } from "@/lib/db";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-purple-900/10 rounded-xl transition-colors text-purple-900/60 hover:text-purple-900 border-2 border-transparent hover:border-purple-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-purple-900 tracking-tight">Kategoriyi Düzenle</h1>
          <p className="text-purple-900/60 font-bold">{category.name}</p>
        </div>
      </div>

      <form action={updateCategory.bind(null, category.id)} className="space-y-8">
        <div className="bg-[#d8b4fe] border-4 border-purple-900 shadow-[8px_8px_0px_0px_rgba(42,13,89,1)] rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-900">Kategori Adı</label>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="w-full bg-white border-2 border-purple-900 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] transition-all placeholder:text-purple-900/40 font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-900">Slug (URL)</label>
              <input
                name="slug"
                defaultValue={category.slug}
                required
                className="w-full bg-white border-2 border-purple-900 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] transition-all placeholder:text-purple-900/40 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-900">İkon (Lucide)</label>
              <input
                name="icon"
                defaultValue={category.icon}
                className="w-full bg-white border-2 border-purple-900 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] transition-all placeholder:text-purple-900/40 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-900">Gradient</label>
              <input
                name="gradient"
                defaultValue={category.gradient}
                className="w-full bg-white border-2 border-purple-900 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] transition-all placeholder:text-purple-900/40 font-bold"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-purple-900">Açıklama</label>
              <textarea
                name="description"
                defaultValue={category.description}
                required
                rows={3}
                className="w-full bg-white border-2 border-purple-900 rounded-xl px-4 py-3 text-purple-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] transition-all resize-none placeholder:text-purple-900/40 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-2 border-transparent hover:border-white/20"
          >
            <Save className="w-5 h-5" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
