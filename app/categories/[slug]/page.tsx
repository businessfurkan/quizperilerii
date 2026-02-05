import { getQuizzes, getCategories, type Category, type Quiz } from "@/lib/db";
import QuizCard from "@/components/QuizCard";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutGrid, Sparkles, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/background-patterns";

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
    <main className="min-h-screen relative bg-background">
      <DotPattern 
        className="absolute inset-0 text-[#1e3a8a]/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
        cx={1} cy={1} cr={1} width={24} height={24}
      />
      
      {/* Hero Header with subtle gradient background */}
      <div className="relative w-full overflow-hidden bg-[#8bb9e0]/30 border-b border-[#1e3a8a]">
        <div className={cn(
          "absolute inset-0 opacity-[0.08] pointer-events-none",
          `bg-gradient-to-r ${category.gradient}`
        )} />
        
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
            <Link 
                href="/categories" 
                className="inline-flex items-center text-[#1e3a8a]/80 hover:text-[#1e3a8a] transition-colors mb-8 font-medium group px-4 py-2 rounded-full bg-[#8bb9e0] border-2 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                Tüm Koleksiyonlar
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:items-end">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1e3a8a] text-white text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                        <Layers className="w-3 h-3" />
                        Kategori
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#1e3a8a] tracking-tight leading-none">
                        {category.name}
                    </h1>
                    <p className="text-xl text-[#1e3a8a]/80 max-w-2xl leading-relaxed font-medium">
                        {category.description}
                    </p>
                </div>
                
                {/* Category Stats Card */}
                <div className="bg-[#8bb9e0] p-6 rounded-2xl border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] flex items-center gap-6 min-w-[200px]">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm border-2 border-[#1e3a8a]",
                        `bg-gradient-to-br ${category.gradient}`
                    )}>
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-[#1e3a8a]">{categoryQuizzes.length}</div>
                        <div className="text-sm font-semibold text-[#1e3a8a]/60">Toplam Quiz</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-[#1e3a8a] rounded-full" />
            <h2 className="text-2xl font-bold text-[#1e3a8a]">Popüler İçerikler</h2>
        </div>

        {categoryQuizzes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {categoryQuizzes.map((quiz: Quiz, index: number) => (
                <QuizCard key={quiz.id} quiz={quiz} index={index} />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-[#8bb9e0] rounded-full flex items-center justify-center mb-6 border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
                    <LayoutGrid className="w-10 h-10 text-[#1e3a8a]/40" />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">Henüz İçerik Yok</h3>
                <p className="text-[#1e3a8a]/70 max-w-md mx-auto text-lg">
                    Bu kategoride şu an için içerik bulunmuyor. Çok yakında harika testler eklenecek!
                </p>
            </div>
        )}
      </div>
    </main>
  );
}
