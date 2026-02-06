"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, User, Sparkles, Check, X, Share2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModernGridPattern } from "@/components/ui/background-patterns";
import Link from "next/link";
import confetti from "canvas-confetti";

// Define type manually to avoid transient import errors
type LoveMeterQuestion = {
  id: string;
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// Fallback questions if database is empty
const FALLBACK_QUESTIONS = [
  {
    id: "1",
    text: "En sevdiğin film türü hangisi?",
    options: ["Korku / Gerilim", "Romantik / Komedi", "Bilim Kurgu / Fantastik", "Aksiyon / Macera"]
  },
  {
    id: "2",
    text: "Hafta sonu için ideal planın nedir?",
    options: ["Evde film keyfi", "Doğada yürüyüş", "Dışarıda eğlence", "Yeni yerler keşfetmek"]
  },
  {
    id: "3",
    text: "Bir tartışmada tepkin ne olur?",
    options: ["Hemen konuşup çözmek", "Sakinleşmek için zaman istemek", "Sessiz kalmak", "Özür dileyip kapatmak"]
  },
  {
    id: "4",
    text: "Sence ilişkide en önemlisi nedir?",
    options: ["Güven", "Tutku", "İletişim", "Eğlence"]
  },
  {
    id: "5",
    text: "Hangi hediye seni daha çok mutlu eder?",
    options: ["El yapımı bir şey", "Pahalı bir aksesuar", "Deneyim (konser, tatil)", "Düşünceli küçük bir not"]
  },
  {
    id: "6",
    text: "Sabah insanı mısın, gece kuşu mu?",
    options: ["Tam bir sabah insanıyım", "Gece kuşu, sabahları zor uyanırım", "Duruma göre değişir", "Uykuyu çok sevmem"]
  },
  {
    id: "7",
    text: "Kıskançlık seviyen nedir?",
    options: ["Hiç kıskanmam", "Azıcık kıskanırım", "Belli etmem ama kıskanırım", "Çok kıskancım"]
  },
  {
    id: "8",
    text: "Yemek yapmayı sever misin?",
    options: ["Bayılırım, şef gibiyim", "Arada sırada yaparım", "Sadece yemek yemeyi severim", "Hiç beceremem"]
  }
];

type GameStep = "names" | "p1_intro" | "p1_game" | "transition" | "p2_intro" | "p2_game" | "calculating" | "result";

interface LoveMeterClientProps {
  initialQuestions: LoveMeterQuestion[];
}

export default function LoveMeterClient({ initialQuestions }: LoveMeterClientProps) {
  // Use database questions if available, otherwise use fallback
  const questions = initialQuestions.length > 0 
    ? initialQuestions.map(q => ({
        id: q.id,
        text: q.text,
        options: [q.option1, q.option2, q.option3, q.option4]
      }))
    : FALLBACK_QUESTIONS;

  const [step, setStep] = useState<GameStep>("names");
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [p1Answers, setP1Answers] = useState<number[]>([]);
  const [p2Answers, setP2Answers] = useState<number[]>([]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.p1.trim() || !names.p2.trim()) return;
    setStep("p1_intro");
  };

  const handleAnswer = (optionIndex: number) => {
    if (step === "p1_game") {
      const newAnswers = [...p1Answers, optionIndex];
      setP1Answers(newAnswers);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep("transition");
        setCurrentQuestionIndex(0);
      }
    } else if (step === "p2_game") {
      const newAnswers = [...p2Answers, optionIndex];
      setP2Answers(newAnswers);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep("calculating");
        setTimeout(() => {
          setStep("result");
          triggerConfetti();
        }, 2000);
      }
    }
  };

  const calculateScore = () => {
    let matches = 0;
    p1Answers.forEach((ans, idx) => {
      if (ans === p2Answers[idx]) matches++;
    });
    return Math.round((matches / questions.length) * 100);
  };

  const triggerConfetti = () => {
    const score = calculateScore();
    if (score > 50) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#ec4899', '#ffffff']
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <main className="min-h-screen relative bg-[#0f172a] overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-purple-900/40" />
      <ModernGridPattern 
        className="absolute inset-0 text-white/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={24} height={24}
      />

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: NAMES */}
          {step === "names" && (
            <motion.div
              key="names"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30">
                <Heart className="w-10 h-10 text-white fill-current animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2">Aşk Metre</h1>
              <p className="text-white/60 mb-8">İkiniz ne kadar uyumlusunuz? Testi çözün ve öğrenin!</p>
              
              <form onSubmit={handleStart} className="space-y-4">
                <input
                  type="text"
                  value={names.p1}
                  onChange={(e) => setNames({ ...names, p1: e.target.value })}
                  placeholder="Senin Adın"
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-rose-500 focus:bg-black/40 transition-all font-bold text-center"
                />
                <input
                  type="text"
                  value={names.p2}
                  onChange={(e) => setNames({ ...names, p2: e.target.value })}
                  placeholder="Partnerinin Adı"
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-rose-500 focus:bg-black/40 transition-all font-bold text-center"
                />
                <button
                  type="submit"
                  disabled={!names.p1.trim() || !names.p2.trim()}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Teste Başla
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: P1 INTRO */}
          {step === "p1_intro" && (
            <motion.div
              key="p1_intro"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Sıra Sende, {names.p1}!</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Şimdi sana bazı sorular soracağız. <br />
                <span className="text-rose-400 font-bold">{names.p2}</span> lütfen ekrana bakmasın! 🤫
              </p>
              <button
                onClick={() => setStep("p1_game")}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-lg transition-all"
              >
                Tamam, Hazırım
              </button>
            </motion.div>
          )}

          {/* GAME SCREENS (P1 & P2) */}
          {(step === "p1_game" || step === "p2_game") && (
            <motion.div
              key="game"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
                  <span>{step === "p1_game" ? names.p1 : names.p2}</span>
                  <span>{currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center leading-snug">
                  {step === "p2_game" ? (
                     <span><span className="text-rose-400">{names.p1}</span> sence buna ne cevap verdi?</span>
                  ) : (
                    questions[currentQuestionIndex].text
                  )}
                  {step === "p2_game" && (
                    <div className="text-base font-normal text-white/50 mt-2 block">"{questions[currentQuestionIndex].text}"</div>
                  )}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full p-4 text-left bg-black/20 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-white/90 transition-all font-medium active:scale-[0.99]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TRANSITION */}
          {step === "transition" && (
            <motion.div
              key="transition"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Harika!</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Cevapların kaydedildi. Şimdi seri şekilde <span className="text-rose-400 font-bold">{names.p2}</span> gelip çözsün bakalım bilebilecek mi?
              </p>
              <button
                onClick={() => setStep("p2_intro")}
                className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold text-lg transition-all"
              >
                Telefonu Verdim
              </button>
            </motion.div>
          )}

          {/* P2 INTRO */}
          {step === "p2_intro" && (
            <motion.div
              key="p2_intro"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Selam {names.p2}!</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                {names.p1} soruları cevapladı. Şimdi senin görevin, onun ne cevap verdiğini tahmin etmek!
              </p>
              <button
                onClick={() => setStep("p2_game")}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-xl text-white font-bold text-lg transition-all"
              >
                Tahmin Etmeye Başla
              </button>
            </motion.div>
          )}

          {/* CALCULATING */}
          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin" />
                <Heart className="absolute inset-0 m-auto w-8 h-8 text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white animate-pulse">Uyumunuz Hesaplanıyor...</h2>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <motion.div
              key="result"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center max-w-xl w-full"
            >
              <div className="mb-8">
                <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Aşk Skoru</span>
                <div className="text-[6rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-purple-500 mt-2">
                  %{calculateScore()}
                </div>
              </div>

              <div className="mb-8 text-white/90 text-xl font-medium leading-relaxed">
                {calculateScore() === 100 ? (
                  "Mükemmel Uyum! Siz ruh eşisiniz! 💍"
                ) : calculateScore() >= 80 ? (
                  "Harika bir çiftsiniz! Birbirinizi çok iyi tanıyorsunuz. ❤️"
                ) : calculateScore() >= 50 ? (
                  "Güzel bir ilişkiniz var ama birbirinizi daha çok keşfetmelisiniz. 😊"
                ) : (
                  "Belki de daha çok konuşmaya ihtiyacınız var... 🤔"
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tekrar Oyna
                </button>
                <Link 
                  href="/"
                  className="py-3 px-6 bg-white text-rose-900 hover:bg-rose-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
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
