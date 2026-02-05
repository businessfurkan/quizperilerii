"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn, getIconByName } from "@/lib/utils";
import { DotPattern } from "@/components/ui/background-patterns";
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react";

interface CategoryWithCount {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  quizCount: number;
}

interface CategoriesClientProps {
  categories: CategoryWithCount[];
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  return (
    <main className="min-h-screen relative bg-[#005d9c] overflow-hidden">
      {/* Background Pattern */}
      <DotPattern 
        className="absolute inset-0 text-[#1e3a8a]/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
        cx={1} cy={1} cr={1} width={24} height={24}
      />
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#8bb9e0]/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto relative z-10 py-16 px-4 md:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-8 relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1e3a8a] border-2 border-[#8bb9e0]/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] text-[#8bb9e0] text-sm font-black uppercase tracking-wider mb-4 transform -rotate-2 hover:rotate-0 transition-transform cursor-default"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tüm Koleksiyonlar</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[4px_4px_0px_rgba(30,58,138,1)] leading-[1.1]"
          >
            İlgi Alanını <br className="hidden md:block" />
            <span className="text-[#8bb9e0] inline-block transform hover:scale-105 transition-transform duration-300">
              Keşfetmeye Başla
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto font-bold leading-relaxed"
          >
            Senin için özenle hazırladığımız kategorilerde binlerce soru seni bekliyor.
            <span className="block text-[#8bb9e0] text-lg mt-2 font-semibold">Hemen bir kategori seç ve maceraya atıl!</span>
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
          {categories.map((category, index) => {
            const Icon = getIconByName(category.icon);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full group"
              >
                <Link href={`/categories/${category.slug}`} className="block h-full">
                  <div className={cn(
                    "relative h-full flex flex-col bg-white rounded-[2.5rem] overflow-hidden",
                    "border-[3px] border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] transition-all duration-300",
                    "hover:shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-2"
                  )}>
                    
                    {/* Header Color Bar */}
                    <div className={cn(
                      "h-32 w-full relative overflow-hidden bg-slate-100 border-b-[3px] border-[#1e3a8a]",
                      `bg-gradient-to-br ${category.gradient}`
                    )}>
                       <div className="absolute inset-0 bg-[#1e3a8a]/10" />
                       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                       
                       {/* Quiz Count Badge */}
                       <div className="absolute top-4 right-4 z-10">
                         <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-[#1e3a8a] text-[#1e3a8a] text-xs font-black tracking-wide shadow-sm flex items-center gap-1.5">
                           <Sparkles className="w-3 h-3 text-[#8bb9e0]" />
                           {category.quizCount} Quiz
                         </span>
                       </div>
                    </div>

                    {/* Floating Icon */}
                    <div className="absolute top-20 left-8">
                       <div className="w-20 h-20 rounded-[1.5rem] bg-[#8bb9e0] border-[3px] border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] flex items-center justify-center text-[#1e3a8a] transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                         <Icon className="w-10 h-10" />
                       </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-grow pt-14 p-8 space-y-4 bg-white">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-[#1e3a8a] group-hover:text-blue-600 transition-colors leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-[#1e3a8a]/60 text-sm font-bold leading-relaxed line-clamp-3">
                          {category.description}
                        </p>
                      </div>

                      {/* Action Footer */}
                      <div className="mt-auto pt-6 flex items-center justify-between border-t-2 border-[#1e3a8a]/10">
                        <span className="text-xs font-black text-[#1e3a8a]/40 uppercase tracking-wider group-hover:text-[#1e3a8a] transition-colors">
                          Koleksiyonu İncele
                        </span>
                        <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center transition-all duration-300 transform group-hover:rotate-[-45deg] group-hover:scale-110 shadow-[2px_2px_0px_0px_#8bb9e0]">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
