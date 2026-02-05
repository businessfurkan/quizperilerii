"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Home, Clock, Calendar, Star, Flame } from "lucide-react";
import Link from "next/link";
import QuizCard from "@/components/QuizCard";
import { DotPattern } from "@/components/ui/background-patterns";
import { cn } from "@/lib/utils";

type FilterType = "all" | "week" | "month";

interface PopularClientProps {
  initialQuizzes: any[];
}

export default function PopularClient({ initialQuizzes }: PopularClientProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  // Client-side filtering logic
  const filteredQuizzes = initialQuizzes.filter((quiz) => {
    if (filter === "all") return true;
    
    const date = new Date(quiz.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (filter === "week") return diffDays <= 7;
    if (filter === "month") return diffDays <= 30;
    return true;
  });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <DotPattern
        className="absolute inset-0 text-[#1e3a8a]/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
        width={24}
        height={24}
      />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#8bb9e0]/20 to-transparent blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-[#8bb9e0]/10 to-transparent blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1e3a8a] text-white border-4 border-[#8bb9e0] shadow-[4px_4px_0px_0px_rgba(30,58,138,0.3)] transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-default">
            <Flame className="w-5 h-5 text-[#facc15] fill-current animate-pulse" />
            <span className="font-black tracking-wider text-sm uppercase">Trend Listesi</span>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black text-[#1e3a8a] drop-shadow-[4px_4px_0px_rgba(139,185,224,1)] tracking-tight leading-tight">
              Popüler Quizler
            </h1>
            {/* Floating Icons around Title */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-12 hidden md:block text-[#facc15]"
            >
              <Star className="w-12 h-12 fill-current drop-shadow-lg" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-12 hidden md:block text-[#8bb9e0]"
            >
              <Trophy className="w-10 h-10 fill-current drop-shadow-lg" />
            </motion.div>
          </div>
          
          <p className="text-[#1e3a8a]/70 font-bold text-lg max-w-2xl leading-relaxed">
            Topluluğumuzun en çok sevdiği, binlerce kişi tarafından çözülen ve viral olan içerikleri keşfet.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { id: "all", label: "Tüm Zamanlar", icon: Trophy },
            { id: "week", label: "Bu Hafta", icon: Star },
            { id: "month", label: "Bu Ay", icon: Calendar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as FilterType)}
              className={cn(
                "group relative px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-2",
                filter === item.id
                  ? "bg-[#1e3a8a] text-white shadow-[6px_6px_0px_0px_#8bb9e0] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white text-[#1e3a8a] border-2 border-[#1e3a8a]/10 hover:border-[#1e3a8a] hover:bg-blue-50"
              )}
            >
              <item.icon className={cn("w-4 h-4", filter === item.id ? "text-[#facc15]" : "text-[#1e3a8a]/40 group-hover:text-[#1e3a8a]")} />
              {item.label}
              {filter === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-[#1e3a8a] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {filteredQuizzes.length > 0 ? (
            <motion.div 
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20"
            >
              {filteredQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <QuizCard quiz={quiz} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto pt-10"
            >
              <div className="bg-white rounded-[2.5rem] p-10 border-[3px] border-[#1e3a8a] shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] text-center space-y-8 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-32 h-32 bg-[#8bb9e0]/20 rounded-full flex items-center justify-center mx-auto border-4 border-[#8bb9e0] relative">
                  <Clock className="w-16 h-16 text-[#1e3a8a]" />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#facc15] rounded-full border-2 border-[#1e3a8a] animate-bounce" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-[#1e3a8a]">
                    Henüz Quiz Yok
                  </h3>
                  <p className="text-[#1e3a8a]/60 font-bold leading-relaxed">
                    Seçtiğin zaman aralığında popüler olan bir quiz bulunamadı. Filtreyi değiştirerek şansını tekrar dene!
                  </p>
                </div>

                <button 
                  onClick={() => setFilter("all")}
                  className="w-full py-4 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_#8bb9e0] hover:shadow-[2px_2px_0px_0px_#8bb9e0] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3 group"
                >
                  <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Tüm Zamanları Gör
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
