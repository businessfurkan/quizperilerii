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
          "relative h-full flex flex-col bg-white rounded-[2rem] overflow-hidden",
          "border-[3px] border-[#1e3a8a] shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] transition-all duration-300",
          "hover:shadow-[10px_10px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-1.5"
        )}>
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-[#1e3a8a] bg-slate-100">
            <Image 
              src={quiz.image || "/fallback-quiz.jpg"} 
              alt={quiz.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/90 via-[#1e3a8a]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <span className={cn(
                "px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg border-2 border-[#1e3a8a] shadow-[2px_2px_0px_0px_rgba(30,58,138,1)] flex items-center gap-1",
                quiz.difficulty === "Kolay" ? "bg-[#4ade80] text-[#1e3a8a]" :
                quiz.difficulty === "Orta" ? "bg-[#8bb9e0] text-[#1e3a8a]" :
                "bg-[#f87171] text-[#1e3a8a]"
              )}>
                <Trophy className="w-3 h-3" />
                {quiz.difficulty}
              </span>
            </div>

            {/* Floating Category Icon */}
            <div className="absolute -bottom-6 right-4 z-20">
               <div className="w-12 h-12 rounded-2xl bg-[#8bb9e0] border-[3px] border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] flex items-center justify-center text-[#1e3a8a] transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                 <Icon className="w-6 h-6" />
               </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-5 pt-8 space-y-4 bg-gradient-to-b from-white to-blue-50/50">
             {/* Title & Description */}
             <div className="flex-grow space-y-2">
               <h3 className="text-xl font-black text-[#1e3a8a] group-hover:text-[#2563eb] transition-colors leading-tight line-clamp-2">
                 {quiz.title}
               </h3>
               <p className="text-[#1e3a8a]/60 text-xs font-bold leading-relaxed line-clamp-2">
                 {quiz.description}
               </p>
             </div>

             {/* Footer Info */}
             <div className="flex items-center justify-between pt-2 border-t-2 border-[#1e3a8a]/10">
                <div className="flex items-center gap-3 text-xs font-bold text-[#1e3a8a]/60">
                   <div className="flex items-center gap-1.5 bg-blue-100/50 px-2 py-1 rounded-md">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{itemCount} Soru</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-black text-[#1e3a8a] group/btn">
                  <span className="group-hover:underline decoration-2 underline-offset-2">Çöz</span>
                  <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-[-15deg]">
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
