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
  const [showDetails, setShowDetails] = useState(false);

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

  const containerVariants: any = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 1.05, transition: { duration: 0.3 } }
  };

  const optionVariants: any = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <main className="min-h-screen relative bg-[#0f172a] overflow-hidden flex items-center justify-center p-4 selection:bg-rose-500/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950" />
      <ModernGridPattern 
        className="absolute inset-0 text-rose-500/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={32} height={32}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-rose-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

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
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500" />
              
              <div className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/30 ring-4 ring-white/10">
                <Heart className="w-12 h-12 text-white fill-current animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 text-center tracking-tight">
                Aşk Metre
              </h1>
              <p className="text-white/60 mb-10 text-center text-lg">
                İkiniz ne kadar uyumlusunuz? <br/>Testi çözün ve gerçeği öğrenin! 💘
              </p>
              
              <form onSubmit={handleStart} className="space-y-6">
                <div className="space-y-4">
                  <div className="group relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-rose-400 transition-colors" />
                    <input
                      type="text"
                      value={names.p1}
                      onChange={(e) => setNames({ ...names, p1: e.target.value })}
                      placeholder="Senin Adın"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-black/40 focus:ring-2 focus:ring-rose-500/20 transition-all font-bold text-lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center -my-2 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white/50 border border-white/5">
                      &
                    </div>
                  </div>

                  <div className="group relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      value={names.p2}
                      onChange={(e) => setNames({ ...names, p2: e.target.value })}
                      placeholder="Partnerinin Adı"
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 focus:ring-2 focus:ring-purple-500/20 transition-all font-bold text-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!names.p1.trim() || !names.p2.trim()}
                  className="w-full py-5 bg-gradient-to-r from-rose-600 to-purple-600 rounded-2xl text-white font-black text-xl hover:shadow-xl hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />

              <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-purple-500/30 rotate-3">
                <User className="w-10 h-10 text-purple-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Sıra Sende, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">{names.p1}</span>!
              </h2>
              
              <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5 text-left">
                <p className="text-white/80 text-lg leading-relaxed flex gap-3">
                  <span className="text-2xl">🤫</span>
                  <span>
                    Şimdi sana ilişkiyle ilgili sorular soracağız. 
                    <strong className="text-rose-400 block mt-1">{names.p2} lütfen ekrana bakmasın!</strong>
                  </span>
                </p>
              </div>

              <button
                onClick={() => setStep("p1_game")}
                className="w-full py-5 bg-white text-purple-900 rounded-2xl font-black text-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/20"
              >
                Tamam, Hazırım
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-rose-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-sm font-bold uppercase tracking-wider border border-white/5">
                    {step === "p1_game" ? names.p1 : names.p2}
                  </span>
                  <span className="text-white/40 font-mono font-bold">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                
                <div className="min-h-[120px] flex items-center justify-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center leading-snug">
                    {step === "p2_game" ? (
                       <span>
                         <span className="text-rose-400 border-b-2 border-rose-400/30">{names.p1}</span> sence buna ne cevap verdi?
                       </span>
                    ) : (
                      questions[currentQuestionIndex].text
                    )}
                    {step === "p2_game" && (
                      <div className="text-lg font-medium text-white/50 mt-4 bg-black/20 px-4 py-2 rounded-xl inline-block">
                        "{questions[currentQuestionIndex].text}"
                      </div>
                    )}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      custom={idx}
                      variants={optionVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleAnswer(idx)}
                      className="group relative w-full p-5 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/30 rounded-2xl text-white transition-all active:scale-[0.99] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <span className="font-bold text-lg text-white/90 group-hover:text-white">{option}</span>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
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
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-4">Cevaplar Kaydedildi!</h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-md mx-auto">
                Şimdi telefonu <span className="text-rose-400 font-bold text-xl">{names.p2}</span> kişisine ver. Bakalım seni ne kadar iyi tanıyor? 👀
              </p>
              
              <button
                onClick={() => setStep("p2_intro")}
                className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white font-black text-xl hover:shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-1"
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
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="w-20 h-20 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-rose-500/30 -rotate-3">
                <Heart className="w-10 h-10 text-rose-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Selam <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">{names.p2}</span>!
              </h2>
              
              <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5 text-left">
                <p className="text-white/80 text-lg leading-relaxed">
                  <span className="font-bold text-white">{names.p1}</span> soruları cevapladı. 
                  Şimdi sıra sende! Bakalım onun ne cevap verdiğini tahmin edebilecek misin?
                </p>
              </div>
              
              <button
                onClick={() => setStep("p2_game")}
                className="w-full py-5 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl text-white font-black text-xl hover:shadow-lg hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                Tahmin Etmeye Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              className="text-center relative z-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-rose-500 animate-pulse fill-current" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-2 animate-pulse">Hesaplanıyor...</h2>
              <p className="text-white/50">Kalpleriniz senkronize ediliyor ❤️</p>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <motion.div
              key="result"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-center max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500" />
              
              <div className="flex flex-col items-center pt-4">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full" />
                  <h2 className="relative text-2xl font-bold text-white tracking-widest uppercase opacity-90 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Aşk Uyumu
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </h2>
                </div>
                
                {/* Circular Progress */}
                <div className="relative w-64 h-64 mb-10 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="20"
                      fill="transparent"
                      className="text-black/30"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 691 }}
                      animate={{ strokeDashoffset: 691 - (691 * calculateScore()) / 100 }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="20"
                      fill="transparent"
                      strokeDasharray="691"
                      strokeLinecap="round"
                      className={cn(
                        "transition-colors duration-500",
                        calculateScore() >= 80 ? "text-emerald-400" : 
                        calculateScore() >= 50 ? "text-yellow-400" : "text-rose-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                        %{calculateScore()}
                      </span>
                      <div className={cn(
                        "flex items-center gap-1 mt-2 font-bold px-3 py-1 rounded-full text-sm bg-black/40 border border-white/10",
                        calculateScore() >= 80 ? "text-emerald-400" : 
                        calculateScore() >= 50 ? "text-yellow-400" : "text-rose-500"
                      )}>
                        <Heart className="w-4 h-4 fill-current" />
                        {calculateScore() >= 80 ? "Mükemmel" : calculateScore() >= 50 ? "İyi" : "Düşük"}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Result Message */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-6 w-full"
                >
                  <h3 className="text-3xl font-black text-white mb-3">
                    {calculateScore() === 100 ? "Ruh Eşisiniz! 💍" : 
                     calculateScore() >= 80 ? "Harika Çift! ❤️" : 
                     calculateScore() >= 50 ? "İyi Gidiyor! 😊" : 
                     "Biraz Daha Çaba! 🤔"}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    {calculateScore() === 100 ? "İnanılmaz! Birbirinizi tamamlıyorsunuz. Bu uyumu kaybetmeyin!" : 
                     calculateScore() >= 80 ? "Birbirinizi çok iyi tanıyorsunuz, aşkınız daim olsun." : 
                     calculateScore() >= 50 ? "Ortak noktalarınız var ama keşfedilecek daha çok şey var." : 
                     "Belki de birbirinizi tanımak için daha çok vakit geçirmelisiniz."}
                  </p>
                </motion.div>

                {/* Details Toggle */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full mb-6 group bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-all"
                >
                  <span className="font-bold text-white/80 group-hover:text-white transition-colors">Detaylı Analiz</span>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-white/80">
                    {showDetails ? "Gizle" : "Göster"}
                    <ArrowRight className={cn("w-4 h-4 transition-transform duration-300", showDetails ? "-rotate-90" : "rotate-90")} />
                  </div>
                </button>

                {/* Details List */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full mb-8 overflow-hidden"
                    >
                      <div className="space-y-3 text-left">
                        {questions.map((q, idx) => {
                          const isMatch = p1Answers[idx] === p2Answers[idx];
                          return (
                            <motion.div 
                              key={q.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={cn(
                                "p-4 rounded-2xl border flex items-start gap-4 transition-colors",
                                isMatch ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-lg",
                                isMatch ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                              )}>
                                {isMatch ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-base mb-2">{q.text}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div className="bg-black/20 rounded-lg px-3 py-2">
                                    <span className="text-white/40 block text-xs uppercase font-bold mb-1">{names.p1}</span>
                                    <span className="text-white/90">{q.options[p1Answers[idx]]}</span>
                                  </div>
                                  <div className="bg-black/20 rounded-lg px-3 py-2">
                                    <span className="text-white/40 block text-xs uppercase font-bold mb-1">{names.p2} (Tahmin)</span>
                                    <span className={cn("font-bold", isMatch ? "text-emerald-400" : "text-rose-400")}>
                                      {q.options[p2Answers[idx]]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-5 bg-white text-purple-900 rounded-2xl font-black text-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Tekrar Oyna
                  </button>
                  <Link 
                    href="/"
                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                  >
                    Ana Sayfa
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
