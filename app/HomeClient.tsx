"use client";

import { motion } from "framer-motion";
import QuizCard from "@/components/QuizCard";
import { Sparkles, Trophy, Brain, Rocket, ArrowRight, Star, Heart, Users } from "lucide-react";
import { ModernGridPattern } from "@/components/ui/background-patterns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Quiz } from "@prisma/client";

interface HomeClientProps {
  popularQuizzes: any[]; // using any for now to avoid complex type imports, but ideally should be QuizWithRelations
}

export default function HomeClient({ popularQuizzes }: HomeClientProps) {
  return (
    <main className="min-h-screen relative bg-[#491799] overflow-hidden">
      {/* Background Pattern */}
      <ModernGridPattern 
        className="absolute inset-0 text-[#2a0d59]/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={24} height={24}
      />
      
      {/* Decorative Gradients - REMOVED per user request */}
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center py-24 md:py-32 space-y-10 max-w-5xl mx-auto relative">
           
           {/* Floating Elements (Decorative) */}
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 left-0 md:left-20 hidden md:block text-[#d8b4fe]/20"
           >
             <Brain className="w-24 h-24" />
           </motion.div>
           <motion.div 
             animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 right-0 md:right-20 hidden md:block text-[#d8b4fe]/20"
           >
             <Trophy className="w-24 h-24" />
           </motion.div>

           {/* Badge */}
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2a0d59] border-2 border-[#d8b4fe]/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] text-[#d8b4fe] text-sm font-black uppercase tracking-wider transform -rotate-2 hover:rotate-0 transition-transform cursor-default"
           >
             <Sparkles className="w-4 h-4" />
             <span>Haftanın En Popüler Quizleri</span>
           </motion.div>

           {/* Title */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="relative"
           >
             <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[6px_6px_0px_rgba(42,13,89,1)] leading-[1.1]">
               <span className="text-[#2a0d59] inline-block transform hover:-rotate-2 transition-transform duration-300">QUIZ</span>
               <span className="ml-4 text-white inline-block transform hover:rotate-2 transition-transform duration-300">PERİLERİ</span>
             </h1>
             {/* Underline Decoration */}
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-[#d8b4fe] rounded-full skew-x-12 -z-10 opacity-80" />
           </motion.div>

           {/* Description */}
           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-white/90 max-w-2xl font-bold leading-relaxed"
           >
             Türkiye'nin en modern test platformuna hoş geldin!
             <br className="hidden md:block" />
             <span className="text-[#d8b4fe] mt-2 inline-block">Hazırsan, seni test edelim!</span> 🚀
           </motion.p>

           {/* Stats / Trust Badges */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap justify-center gap-4 mt-8"
           >
              {[
                { icon: Trophy, label: "100+ Quiz", color: "bg-[#facc15]" },
                { icon: Brain, label: "Zeka Testleri", color: "bg-[#d8b4fe]" },
                { icon: Star, label: "Favori İçerikler", color: "bg-[#f472b6]" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border-[3px] border-[#2a0d59] shadow-[6px_6px_0px_0px_rgba(42,13,89,1)] text-[#2a0d59] font-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(42,13,89,1)] transition-all group">
                  <div className={cn("p-2 rounded-lg border-2 border-[#2a0d59]", item.color)}>
                    <item.icon className="w-5 h-5 text-[#2a0d59]" />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
           </motion.div>

           {/* CTA Button */}
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
           >
             <Link href="/categories" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white transition-all duration-200 bg-[#2a0d59] border-[3px] border-[#d8b4fe] rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2a0d59] shadow-[6px_6px_0px_0px_#d8b4fe] hover:shadow-[3px_3px_0px_0px_#d8b4fe] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2">
               <span className="mr-3">Tüm Kategorileri Gör</span>
               <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </Link>
           </motion.div>
        </div>

        {/* COUPLE GAMES SECTION */}
        <div className="py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Love Meter Card */}
            <Link href="/ask-metre" className="flex-1 group relative overflow-hidden rounded-3xl bg-white border-[3px] border-[#2a0d59] shadow-[8px_8px_0px_0px_rgba(42,13,89,1)] hover:shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-50 opacity-50" />
                <div className="relative p-8 flex flex-col items-start h-full">
                    <div className="p-3 rounded-2xl bg-rose-500 border-2 border-[#2a0d59] shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] mb-6 group-hover:scale-110 transition-transform">
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h3 className="text-3xl font-black text-[#2a0d59] mb-2">Aşk Metre</h3>
                    <p className="text-[#2a0d59]/80 font-bold text-lg mb-8">Uyumunuzu test edin! Yüzde kaç aşıksınız?</p>
                    <div className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-[#2a0d59] text-white rounded-xl font-bold text-sm">
                        Şimdi Dene <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>

            {/* Who Is Likely Card */}
            <Link href="/kim-daha" className="flex-1 group relative overflow-hidden rounded-3xl bg-white border-[3px] border-[#2a0d59] shadow-[8px_8px_0px_0px_rgba(42,13,89,1)] hover:shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 opacity-50" />
                <div className="relative p-8 flex flex-col items-start h-full">
                    <div className="p-3 rounded-2xl bg-purple-500 border-2 border-[#2a0d59] shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] mb-6 group-hover:scale-110 transition-transform">
                        <Users className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h3 className="text-3xl font-black text-[#2a0d59] mb-2">Kim Daha...</h3>
                    <p className="text-[#2a0d59]/80 font-bold text-lg mb-8">Hanginiz daha kıskanç? Eğlenceli yüzleşme!</p>
                    <div className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-[#2a0d59] text-white rounded-xl font-bold text-sm">
                        Hemen Oyna <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
          </div>
        </div>

        {/* FEATURED GRID */}
        <div className="relative py-20">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-[#d8b4fe] font-black uppercase tracking-widest text-sm">
                   <Rocket className="w-5 h-5" />
                   <span>Editörün Seçimi</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[4px_4px_0px_rgba(42,13,89,1)] tracking-tight leading-none">
                  Öne Çıkanlar
                </h2>
             </div>
             
             <div className="hidden md:block h-1 flex-1 bg-[#2a0d59]/20 mx-8 rounded-full" />
             
             <Link href="/popular" className="text-white/80 font-bold hover:text-white flex items-center gap-2 group transition-colors">
               Tümünü Gör <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
            {popularQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} quiz={quiz} index={index} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
