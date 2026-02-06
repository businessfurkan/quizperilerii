import Link from "next/link";
import Image from "next/image";
import { getQuizzes, Quiz } from "@/lib/db";
import { deleteQuizAction, togglePopularAction } from "@/app/actions";
import { Edit, Trash2, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-900 mb-2">Quiz Yönetimi</h1>
          <p className="text-blue-900/70 font-medium">Tüm quizleri görüntüle, düzenle veya sil.</p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl transition-all font-bold shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 border-2 border-transparent hover:border-white/20"
        >
          <Plus className="w-5 h-5" />
          Yeni Quiz Ekle
        </Link>
      </div>

      <div className="bg-[#8bb9e0] border-4 border-blue-900 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(30,58,138,1)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-blue-900/20 bg-blue-900/10">
              <th className="p-4 text-blue-900 font-bold">Quiz</th>
              <th className="p-4 text-blue-900 font-bold">Kategori</th>
              <th className="p-4 text-blue-900 font-bold">Zorluk</th>
              <th className="p-4 text-blue-900 font-bold text-center">Popüler</th>
              <th className="p-4 text-blue-900 font-bold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz: Quiz) => {
              const isPopular = quiz.isPopular;
              
              return (
                <tr key={quiz.id} className="border-b-2 border-blue-900/10 hover:bg-blue-900/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border-2 border-blue-900">
                        <Image
                          src={quiz.image}
                          alt={quiz.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="text-blue-900 font-bold">{quiz.title}</div>
                        <div className="text-blue-900/60 text-xs line-clamp-1 font-semibold">{quiz.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-blue-900">
                    <span className="px-2 py-1 rounded-lg bg-white border-2 border-blue-900 text-xs font-bold text-blue-900">
                      {quiz.categorySlug}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-xs font-black border-2",
                      quiz.difficulty === "Kolay" ? "bg-green-100 text-green-800 border-green-600" :
                      quiz.difficulty === "Orta" ? "bg-[#8bb9e0]/20 text-[#1e3a8a] border-[#8bb9e0]" :
                      "bg-red-100 text-red-800 border-red-600"
                    )}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <form action={togglePopularAction.bind(null, quiz.id)}>
                      <button className="p-2 hover:bg-blue-900/10 rounded-full transition-colors">
                        <Star className={cn("w-5 h-5 transition-colors", isPopular ? "fill-[#8bb9e0] text-[#8bb9e0] stroke-blue-900 stroke-2" : "text-blue-900/30")} />
                      </button>
                    </form>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/quizzes/${quiz.id}/edit`}
                        className="p-2 bg-white text-blue-900 hover:bg-blue-100 rounded-lg transition-colors border-2 border-blue-900 hover:shadow-[2px_2px_0px_0px_rgba(30,58,138,1)]"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteQuizAction.bind(null, quiz.id)}>
                        <button 
                          className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-blue-900 hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {quizzes.length === 0 && (
          <div className="p-8 text-center text-blue-900/40 font-bold">
            Henüz hiç quiz eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}
