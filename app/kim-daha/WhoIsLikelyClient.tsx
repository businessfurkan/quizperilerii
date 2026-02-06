"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, RefreshCw, Trophy, Heart, Sparkles, AlertCircle, Settings, Plus, Trash2, Edit2, Save, X, ChevronUp, ChevronDown } from "lucide-react";
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
  // State for questions
  const [questions, setQuestions] = useState<string[]>([]);

  // Initialize questions on mount
  useEffect(() => {
    const saved = localStorage.getItem("customQuestions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved questions", e);
      }
    }
    
    // Fallback to initial props or default list
    setQuestions(initialQuestions.length > 0 
      ? initialQuestions.map(q => q.text)
      : FALLBACK_QUESTIONS);
  }, [initialQuestions]);

  const [step, setStep] = useState<"names" | "game" | "result" | "manage">("names");
  
  // Question Manager State
  const [newQuestion, setNewQuestion] = useState("");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      const updatedQuestions = [...questions, newQuestion.trim()];
      setQuestions(updatedQuestions);
      localStorage.setItem("customQuestions", JSON.stringify(updatedQuestions));
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem("customQuestions", JSON.stringify(updatedQuestions));
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setEditingQuestionText(questions[index]);
  };

  const handleSaveEdit = () => {
    if (editingQuestionIndex !== null && editingQuestionText.trim()) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = editingQuestionText.trim();
      setQuestions(updatedQuestions);
      localStorage.setItem("customQuestions", JSON.stringify(updatedQuestions));
      setEditingQuestionIndex(null);
      setEditingQuestionText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
    setEditingQuestionText("");
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
    localStorage.setItem("customQuestions", JSON.stringify(updatedQuestions));
  };
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
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
    setScores({ p1: 0, p2: 0 });
    setCurrentQuestionIndex(0);
    setStep("game");
  };

  const handleNextQuestion = (selected: "p1" | "p2" | null) => {
    // Update score if a player is selected
    if (selected) {
      setScores(prev => ({ ...prev, [selected]: prev[selected] + 1 }));
    }

    // Check if game should end (25 questions or end of list)
    const limit = Math.min(25, shuffledQuestions.length);
    
    if (currentQuestionIndex + 1 >= limit) {
      setStep("result");
    } else {
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setDirection(0);
      }, 300);
    }
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
              className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <button
                onClick={() => setStep("manage")}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors z-20"
                title="Soruları Düzenle"
              >
                <Settings className="w-6 h-6" />
              </button>

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
          ) : step === "game" ? (
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
                  onClick={() => handleNextQuestion("p1")}
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
                  onClick={() => handleNextQuestion("p2")}
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
                  onClick={() => handleNextQuestion(null)}
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
          ) : step === "manage" ? (
            <motion.div
              key="manage-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Soruları Düzenle
                </h2>
                <button
                  onClick={() => setStep("names")}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Add New Question */}
              <form onSubmit={handleAddQuestion} className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Yeni soru ekle..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/50"
                />
                <button
                  type="submit"
                  disabled={!newQuestion.trim()}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {questions.map((q, index) => (
                  <div key={index} className="group bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => handleReorder(index, index - 1)}
                        disabled={index === 0}
                        className="text-white/30 hover:text-white disabled:opacity-0 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReorder(index, index + 1)}
                        disabled={index === questions.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-0 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1">
                      {editingQuestionIndex === index ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingQuestionText}
                            onChange={(e) => setEditingQuestionText(e.target.value)}
                            className="flex-1 px-2 py-1 bg-white/10 rounded text-white border border-white/20 focus:outline-none"
                            autoFocus
                          />
                          <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300">
                            <Save className="w-5 h-5" />
                          </button>
                          <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-white font-medium block">{q}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditQuestion(index)}
                        className="p-2 text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center text-white/40 text-sm">
                Toplam {questions.length} soru
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
            >
              <div className="mb-8">
                 <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                 <h2 className="text-3xl font-black text-white mb-2">Oyun Bitti!</h2>
                 <p className="text-white/60 text-lg">Ve işte sonuçlar...</p>
              </div>

              <div className="mb-12">
                <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">En Çok Seçilen</div>
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 animate-gradient-x mb-6">
                  {scores.p1 > scores.p2 ? names.p1 : scores.p2 > scores.p1 ? names.p2 : "Berabere!"}
                </div>
                {scores.p1 !== scores.p2 && (
                  <p className="text-white/80 font-medium italic">
                    "Bu ilişkinin baskın karakteri belli oldu! 😏"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                   <div className="text-[#3b82f6] font-black text-3xl mb-1">{scores.p1}</div>
                   <div className="text-white/50 text-xs font-bold uppercase">{names.p1}</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                   <div className="text-[#ec4899] font-black text-3xl mb-1">{scores.p2}</div>
                   <div className="text-white/50 text-xs font-bold uppercase">{names.p2}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-white text-[#491799] rounded-xl font-black text-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tekrar Oyna
                </button>
                <Link 
                  href="/"
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Ana Sayfa
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
