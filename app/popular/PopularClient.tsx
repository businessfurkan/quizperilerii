"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Home, Clock, Calendar, Star, Flame } from "lucide-react";
import Link from "next/link";
import QuizCard from "@/components/QuizCard";
import { ModernGridPattern } from "@/components/ui/background-patterns";
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
    <div className="min-h-screen bg-[#0f0720] relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <ModernGridPattern
        className="absolute inset-0 text-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        width={32}
        height={32}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 text-white border border-white/10 backdrop-blur-md shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-default">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
            <span className="font-bold tracking-wider text-sm uppercase">Trend Listesi</span>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight leading-tight">
              Popüler Quizler
            </h1>
            {/* Floating Icons around Title */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-12 hidden md:block text-yellow-400"
            >
              <Star className="w-12 h-12 fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-12 hidden md:block text-purple-400"
            >
              <Trophy className="w-10 h-10 fill-current drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </motion.div>
          </div>
          
          <p className="text-white/60 font-medium text-lg max-w-2xl leading-relaxed">
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
                "group relative px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 flex items-center gap-2 overflow-hidden",
                filter === item.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("w-4 h-4", filter === item.id ? "text-yellow-300" : "text-white/40 group-hover:text-white/80")} />
              <span className="relative z-10">{item.label}</span>
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
              <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 backdrop-blur-xl text-center space-y-8 transform hover:-translate-y-2 transition-transform duration-300 shadow-2xl">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-white/10 relative">
                  <Clock className="w-16 h-16 text-purple-300" />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full border-2 border-[#0f0720] animate-bounce shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white">
                    Henüz Quiz Yok
                  </h3>
                  <p className="text-white/50 font-medium leading-relaxed">
                    Seçtiğin zaman aralığında popüler olan bir quiz bulunamadı. Filtreyi değiştirerek şansını tekrar dene!
                  </p>
                </div>

                <button 
                  onClick={() => setFilter("all")}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-3 group"
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
