"use client";

import { motion } from "framer-motion";
import { Quiz, TournamentItem } from "@/lib/db";
import { Play, TrendingUp, Star, Layers, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getIconByName } from "@/lib/utils";

type QuizWithRelations = Quiz & {
  items?: TournamentItem[];
  _count?: {
    items: number;
  };
};

export default function QuizCard({ quiz, index }: { quiz: QuizWithRelations; index: number }) {
  const Icon = getIconByName(quiz.icon);
  const itemCount = quiz.items?.length || quiz._count?.items || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full group"
    >
      <Link href={`/quiz/${quiz.id}`} className="block h-full">
        <div className={cn(
          "relative h-full flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden",
          "shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 transform hover:-translate-y-1",
          "border border-white/10 hover:border-purple-500/30"
        )}>
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-900/50">
            <Image 
              src={quiz.image || "/fallback-quiz.jpg"} 
              alt={quiz.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0720] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span className={cn(
                "px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full backdrop-blur-md shadow-sm flex items-center gap-1.5",
                quiz.difficulty === "Kolay" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                quiz.difficulty === "Orta" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                "bg-red-500/20 text-red-300 border border-red-500/30"
              )}>
                <Trophy className="w-3 h-3" />
                {quiz.difficulty}
              </span>
            </div>

            {/* Floating Category Icon */}
            <div className="absolute -bottom-5 right-4 z-20">
               <div className="w-10 h-10 rounded-full bg-[#1a103c] border border-white/10 shadow-lg flex items-center justify-center text-purple-400 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:border-purple-500/50">
                 <Icon className="w-5 h-5" />
               </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-5 pt-8 space-y-3">
             {/* Title & Description */}
             <div className="flex-grow space-y-2">
               <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-tight line-clamp-2">
                 {quiz.title}
               </h3>
               <p className="text-white/50 text-xs font-medium leading-relaxed line-clamp-2">
                 {quiz.description}
               </p>
             </div>

             {/* Footer Info */}
             <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs font-medium text-white/40">
                   <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{itemCount} Soru</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 group/btn">
                  <span className="group-hover:mr-1 transition-all">Çöz</span>
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center transition-all group-hover:bg-purple-500 group-hover:text-white border border-purple-500/20 group-hover:border-purple-500">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
