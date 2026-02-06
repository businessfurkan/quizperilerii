import { getQuizzes, getCategories, getPopularQuizzes, Quiz, Category } from "@/lib/db";
import { FileQuestion, FolderTree, Star, TrendingUp, Plus, ArrowRight, Heart, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboard() {
  const quizzes = await getQuizzes();
  const categories = await getCategories();
  const popularQuizzes = await getPopularQuizzes();
  const popularCount = popularQuizzes.length;

  const stats = [
    {
      label: "Toplam Quiz",
      value: quizzes.length,
      icon: FileQuestion,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Kategoriler",
      value: categories.length,
      icon: FolderTree,
      color: "text-[#2a0d59]",
      bg: "bg-purple-100",
    },
    {
      label: "Popüler İçerik",
      value: popularCount,
      icon: Star,
      color: "text-[#2a0d59]",
      bg: "bg-white",
    },
    {
      label: "Toplam Görüntülenme",
      value: "0",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Kombin Başvuruları",
      value: "Yönet",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/gizli-yonetim-kapisi-2024/kombin"
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2a0d59] mb-1">Dashboard</h1>
          <p className="text-[#2a0d59]/70 font-medium">Site genel durum özeti ve hızlı işlemler.</p>
        </div>
        <Link href="/gizli-yonetim-kapisi-2024/quizzes/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2a0d59] text-white rounded-xl hover:bg-[#172554] transition-all shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 font-bold border-2 border-transparent hover:border-white/20">
            <Plus className="w-4 h-4" />
            Yeni Quiz Ekle
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div
              key={stat.label}
              className="bg-[#d8b4fe] border-4 border-[#2a0d59] p-6 rounded-2xl flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] hover:translate-y-[-2px] transition-transform cursor-pointer"
            >
              <div className={`p-4 rounded-xl ${stat.bg} border-2 border-[#2a0d59] shadow-sm`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[#2a0d59]/70 text-sm font-bold">{stat.label}</p>
                <p className="text-2xl font-black text-[#2a0d59]">{stat.value}</p>
              </div>
            </div>
          );

          return (stat as any).href ? (
            <Link key={stat.label} href={(stat as any).href}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quizzes */}
        <div className="bg-[#d8b4fe] border-4 border-[#2a0d59] rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#2a0d59]">Son Eklenen Quizler</h2>
            <Link href="/gizli-yonetim-kapisi-2024/quizzes" className="text-sm text-[#2a0d59] hover:text-[#172554] font-bold flex items-center gap-1 underline decoration-2 underline-offset-2">
              Tümünü Gör <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {quizzes.slice(-5).reverse().map((quiz: Quiz) => (
              <div key={quiz.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#2a0d59]/5 transition-colors border-2 border-transparent hover:border-[#2a0d59]/10 group">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border-2 border-[#2a0d59]">
                  <Image
                    src={quiz.image}
                    alt={quiz.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#2a0d59] font-bold line-clamp-1 group-hover:text-[#172554] transition-colors">{quiz.title}</h3>
                  <p className="text-[#2a0d59]/60 text-xs font-semibold">{quiz.difficulty}</p>
                </div>
                <Link
                  href={`/admin/quizzes/${quiz.id}/edit`}
                  className="px-3 py-1.5 text-xs bg-purple-100 hover:bg-purple-200 rounded-lg text-[#2a0d59] font-bold transition-colors border-2 border-[#2a0d59]"
                >
                  Düzenle
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions or Categories Placeholder */}
        <div className="bg-[#d8b4fe] border-4 border-[#2a0d59] rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#2a0d59]">Kategoriler</h2>
             <Link href="/admin/categories" className="text-sm text-[#2a0d59] hover:text-[#172554] font-bold flex items-center gap-1 underline decoration-2 underline-offset-2">
              Yönet <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
             {categories.slice(0, 5).map((cat: Category) => (
                <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#2a0d59]/20 hover:bg-[#2a0d59]/5 transition-colors bg-white/50">
                   <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.gradient} opacity-80 border-2 border-[#2a0d59] shadow-sm`} />
                   <div>
                      <h3 className="text-[#2a0d59] font-bold">{cat.name}</h3>
                      <p className="text-[#2a0d59]/60 text-xs font-semibold">{cat.slug}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Couple Games Management */}
        <div className="bg-[#d8b4fe] border-4 border-[#2a0d59] rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(42,13,89,1)] lg:col-span-2">
           <h2 className="text-xl font-black text-[#2a0d59] mb-6">Özel Oyun Yönetimi</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Love Meter */}
              <Link href="/gizli-yonetim-kapisi-2024/ask-metre" className="bg-white/50 border-2 border-[#2a0d59]/20 rounded-xl p-6 hover:bg-white hover:border-[#2a0d59] transition-all group flex items-start gap-4">
                 <div className="p-3 bg-rose-100 rounded-xl border-2 border-[#2a0d59] group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-rose-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-[#2a0d59] mb-1">Aşk Metre</h3>
                    <p className="text-[#2a0d59]/70 text-sm font-medium">Uyum testi sorularını düzenle, ekle veya sil.</p>
                 </div>
              </Link>

              {/* Who Is Likely */}
              <Link href="/gizli-yonetim-kapisi-2024/kim-daha" className="bg-white/50 border-2 border-[#2a0d59]/20 rounded-xl p-6 hover:bg-white hover:border-[#2a0d59] transition-all group flex items-start gap-4">
                 <div className="p-3 bg-purple-100 rounded-xl border-2 border-[#2a0d59] group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-purple-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-[#2a0d59] mb-1">Kim Daha...</h3>
                    <p className="text-[#2a0d59]/70 text-sm font-medium">Yüzleşme sorularını yönet.</p>
                 </div>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
