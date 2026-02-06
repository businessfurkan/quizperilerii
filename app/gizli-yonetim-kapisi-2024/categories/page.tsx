import { getCategories } from "@/lib/db";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCategoryAction } from "@/app/actions";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2a0d59] mb-2">Kategori Yönetimi</h1>
          <p className="text-[#2a0d59]/70 font-medium">Kategorileri görüntüle ve yönet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#d8b4fe] border-4 border-[#2a0d59] rounded-2xl p-6 group hover:translate-y-[-2px] transition-all relative shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 shadow-sm opacity-90 border-2 border-[#2a0d59]`}>
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-xl font-black text-[#2a0d59] mb-2">{category.name}</h3>
            <p className="text-[#2a0d59]/60 text-sm mb-4 line-clamp-2 font-medium">{category.description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-[#2a0d59]/10">
                <div className="text-xs font-mono text-[#2a0d59]/60 bg-white border-2 border-[#2a0d59] px-2 py-1 rounded inline-block font-bold">
                Slug: {category.slug}
                </div>
                
                <div className="flex items-center gap-2">
                    <Link
                        href={`/gizli-yonetim-kapisi-2024/categories/${category.id}/edit`}
                        className="p-2 bg-white text-[#2a0d59] hover:bg-purple-100 rounded-lg transition-colors border-2 border-[#2a0d59] hover:shadow-[2px_2px_0px_0px_rgba(42,13,89,1)]"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <form action={deleteCategoryAction.bind(null, category.id)}>
                        <button 
                            className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-[#2a0d59] hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
