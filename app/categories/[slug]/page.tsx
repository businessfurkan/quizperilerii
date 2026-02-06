import { getQuizzes, getCategories, type Category, type Quiz } from "@/lib/db";
import QuizCard from "@/components/QuizCard";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModernGridPattern } from "@/components/ui/background-patterns";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories: Category[] = await getCategories();
  return categories.map((category: Category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories: Category[] = await getCategories();
  const category = categories.find((c: Category) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const quizzes = await getQuizzes();
  const categoryQuizzes = quizzes.filter((q: Quiz) => q.categorySlug === slug);

  return (
    <main className="min-h-screen relative bg-[#491799]">
      <ModernGridPattern 
        className="absolute inset-0 text-white/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={24} height={24}
      />
      
      {/* Modern Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Dynamic Gradient Background based on category color if possible, else default blue */}
        <div className={cn(
          "absolute inset-0 opacity-20 pointer-events-none blur-3xl",
          `bg-gradient-to-r ${category.gradient}`
        )} />
        
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
            <Link 
                href="/categories" 
                className="inline-flex items-center text-purple-100 hover:text-white transition-colors mb-8 font-medium group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 hover:shadow-sm"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Tüm Koleksiyonlar
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
                <div className="space-y-4 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                        <Layers className="w-3 h-3" />
                        Kategori
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                        {category.name}
                    </h1>
                    <p className="text-lg md:text-xl text-purple-100 leading-relaxed font-medium">
                        {category.description}
                    </p>
                </div>
                
                {/* Stats Pill */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg flex items-center gap-4 min-w-[180px]">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md border border-white/20",
                        `bg-gradient-to-br ${category.gradient}`
                    )}>
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{categoryQuizzes.length}</div>
                        <div className="text-xs font-semibold text-purple-200 uppercase tracking-wide">Toplam Quiz</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20 relative z-10">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">İçerikler</h2>
            <div className="text-sm font-medium text-purple-200">({categoryQuizzes.length})</div>
        </div>

        {categoryQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryQuizzes.map((quiz: Quiz, index: number) => (
                <QuizCard key={quiz.id} quiz={quiz} index={index} />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/5 rounded-3xl border border-white/10 shadow-sm backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-purple-200" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Henüz içerik yok</h3>
                <p className="text-purple-200 max-w-sm mx-auto">
                    Bu kategoride henüz yayınlanmış bir quiz bulunmuyor. Daha sonra tekrar kontrol et!
                </p>
            </div>
        )}
      </div>
    </main>
  );
}
