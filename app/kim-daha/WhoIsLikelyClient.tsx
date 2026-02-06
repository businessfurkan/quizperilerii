"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, RefreshCw, Trophy, Heart, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModernGridPattern } from "@/components/ui/background-patterns";
import Link from "next/link";

// Define type manually
type WhoIsLikelyQuestion = {
  id: string;
  text: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// Fun questions list (Fallback)
const FALLBACK_QUESTIONS = [
  "Kim daha kıskanç?",
  "Kim daha dağınık?",
  "Zombi istilasında ilk kim ölür?",
  "Kim daha çok yemek yer?",
  "Kim daha çok uyur?",
  "Kim sabahları daha huysuzdur?",
  "Kim daha iyi yalan söyler?",
  "Kim daha çok para harcar?",
  "Kim daha romantik?",
  "Kim daha çabuk sinirlenir?",
  "Kim daha iyi araba kullanır?",
  "Kim daha çok telefonla oynar?",
  "Kim kavgayı başlatmaya daha meyillidir?",
  "Kim daha çok dedikodu yapar?",
  "Kim daha unutkandır?",
  "Kim daha çok ilgi bekler?",
  "Kim daha inatçıdır?",
  "Kim daha iyi yemek yapar?",
  "Kim daha çok konuşur?",
  "Kim daha sosyaldir?",
  "Issız bir adaya düşseniz kim hayatta kalır?",
  "Kim daha çok trip atar?",
  "Kim daha komik?",
  "Kim daha çok ağlar?",
  "Kim daha cesurdur?"
];

interface WhoIsLikelyClientProps {
  initialQuestions: WhoIsLikelyQuestion[];
}

export default function WhoIsLikelyClient({ initialQuestions }: WhoIsLikelyClientProps) {
  // Use database questions if available, otherwise use fallback
  const questions = initialQuestions.length > 0 
    ? initialQuestions.map(q => q.text)
    : FALLBACK_QUESTIONS;

  const [step, setStep] = useState<"names" | "game">("names");
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Shuffle questions on start
  const [shuffledQuestions, setShuffledQuestions] = useState<string[]>([]);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.p1.trim() || !names.p2.trim()) return;
    
    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setStep("game");
  };

  const handleNextQuestion = () => {
    setDirection(1);
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % shuffledQuestions.length);
      setDirection(0);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <main className="min-h-screen relative bg-[#491799] overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <ModernGridPattern 
        className="absolute inset-0 text-white/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={24} height={24}
      />
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === "names" ? (
            <motion.div
              key="names-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Kim Daha... ?</h1>
                <p className="text-purple-100 text-lg">
                  İsimlerinizi girin ve yüzleşmeye başlayın! Bakalım birbirinizi ne kadar tanıyorsunuz?
                </p>
              </div>

              <form onSubmit={handleStartGame} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2 uppercase tracking-wider">1. Oyuncu</label>
                    <input
                      type="text"
                      value={names.p1}
                      onChange={(e) => setNames({ ...names, p1: e.target.value })}
                      placeholder="Örn: Serhat"
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all text-lg font-bold text-center"
                      maxLength={15}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-bold text-xs">VS</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-200 mb-2 uppercase tracking-wider">2. Oyuncu</label>
                    <input
                      type="text"
                      value={names.p2}
                      onChange={(e) => setNames({ ...names, p2: e.target.value })}
                      placeholder="Örn: Beyza"
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all text-lg font-bold text-center"
                      maxLength={15}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!names.p1.trim() || !names.p2.trim()}
                  className="w-full py-4 bg-white text-[#491799] rounded-xl font-black text-xl hover:bg-purple-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Oyuna Başla
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="game-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center"
            >
              {/* Question Card */}
              <div className="w-full bg-white rounded-3xl p-8 md:p-12 shadow-[0px_20px_0px_0px_rgba(0,0,0,0.2)] mb-8 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-purple-400 to-pink-400" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-black text-[#491799] leading-tight mb-4">
                      {shuffledQuestions[currentQuestionIndex]}
                    </h2>
                  </motion.div>
                </AnimatePresence>
                
                <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-6">
                  Soru {currentQuestionIndex + 1} / {shuffledQuestions.length}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={handleNextQuestion}
                  className="group relative h-40 md:h-48 bg-[#3b82f6] hover:bg-[#2563eb] rounded-3xl border-b-8 border-[#1d4ed8] active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center p-4 shadow-xl"
                >
                  <span className="text-2xl md:text-4xl font-black text-white break-words text-center leading-tight group-hover:scale-110 transition-transform">
                    {names.p1}
                  </span>
                  <span className="absolute bottom-4 opacity-0 group-hover:opacity-100 text-white/60 text-xs font-bold uppercase tracking-wider transition-opacity">
                    Seçildi
                  </span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="group relative h-40 md:h-48 bg-[#ec4899] hover:bg-[#db2777] rounded-3xl border-b-8 border-[#be185d] active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center p-4 shadow-xl"
                >
                  <span className="text-2xl md:text-4xl font-black text-white break-words text-center leading-tight group-hover:scale-110 transition-transform">
                    {names.p2}
                  </span>
                  <span className="absolute bottom-4 opacity-0 group-hover:opacity-100 text-white/60 text-xs font-bold uppercase tracking-wider transition-opacity">
                    Seçildi
                  </span>
                </button>
              </div>

              {/* Navigation Footer */}
              <div className="mt-12 flex items-center gap-6">
                <button 
                  onClick={() => setCurrentQuestionIndex((prev) => (prev + 1) % shuffledQuestions.length)}
                  className="flex items-center gap-2 text-white/60 hover:text-white font-bold transition-colors bg-white/10 px-6 py-3 rounded-full hover:bg-white/20"
                >
                  <RefreshCw className="w-5 h-5" />
                  Pas Geç / Yeni Soru
                </button>
                
                <Link href="/" className="text-white/40 hover:text-white/80 font-medium text-sm transition-colors">
                  Ana Sayfaya Dön
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
