"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cities } from "@/lib/pollData";
import { 
  CheckCircle2, 
  User, 
  Users,
  Sparkles,
  Trophy,
  ArrowRight,
  Activity,
  MapPin,
  Baby,
  PersonStanding
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { submitPollVote } from "@/app/actions";
import { Poll, PollOption } from "@prisma/client";
import { ModernGridPattern } from "@/components/ui/background-patterns";

type DemographicData = {
  ageRange: string;
  gender: string;
  city: string;
};

type PollWithOptions = Poll & {
  options: PollOption[];
};

interface PollClientProps {
  poll: PollWithOptions | null;
}

export default function PollClient({ poll }: PollClientProps) {
  const [demographics, setDemographics] = useState<DemographicData>({
    ageRange: "",
    gender: "",
    city: "",
  });
  const [demographicResult, setDemographicResult] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [step, setStep] = useState<"demographics" | "vote" | "results">("demographics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticOptions, setOptimisticOptions] = useState<PollOption[]>([]);

  // Initialize options
  useEffect(() => {
    if (poll) {
      setOptimisticOptions(poll.options);
    }
  }, [poll]);

  // Load vote state
  useEffect(() => {
    if (!poll) return;
    const voted = localStorage.getItem(`poll_voted_${poll.id}`);
    if (voted) {
      setStep("results");
    }
  }, [poll]);

  const handleDemographicsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (demographics.ageRange && demographics.gender && demographics.city) {
      setIsSubmitting(true);
      // Simulate small delay for effect
      await new Promise(resolve => setTimeout(resolve, 500));
      setStep("vote");
      setIsSubmitting(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !poll) return;

    setIsSubmitting(true);
    
    // Save to localStorage immediately to prevent double voting
    localStorage.setItem(`poll_voted_${poll.id}`, "true");
    
    // Optimistic update
    setOptimisticOptions(prev => prev.map(opt => 
      opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
    ));

    try {
        const result = await submitPollVote(selectedOption, demographics);
        if (result) setDemographicResult(result);
    } catch (error) {
        console.error("Vote failed:", error);
    }

    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d8b4fe', '#2a0d59', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d8b4fe', '#2a0d59', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setStep("results");
    setIsSubmitting(false);
  };

  const totalVotes = optimisticOptions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative bg-[#0f0720] overflow-hidden font-sans">
       {/* Background Patterns */}
       <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
       </div>
       
       <ModernGridPattern 
        className="absolute inset-0 text-white/[0.03] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={32} height={32}
       />

       <div className="container mx-auto max-w-7xl relative z-10">
         
         {/* Header Section */}
         <div className="text-center mb-12 md:mb-20 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 mb-8 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Günün Anketi</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[1] drop-shadow-2xl"
            >
              Senin Fikrin,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x">
                Türkiye'nin Sesi!
              </span>
            </motion.h1>
            
            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Her gün yeni bir konu, binlerce farklı görüş. Katıl ve sonucu belirle.
            </motion.p>
         </div>

         {!poll ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center p-4"
            >
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl max-w-lg relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <Sparkles className="w-12 h-12 text-purple-300" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">Henüz Aktif Anket Yok</h2>
                        <p className="text-xl font-medium text-white/50">
                            Bugünün anketi hazırlanıyor. Birazdan burada olacak!
                        </p>
                    </div>
                </div>
            </motion.div>
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* LEFT SIDE: Poll Context Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 sticky top-24"
                >
                    <div className="relative rounded-[3rem] overflow-hidden bg-[#1a103c]/50 border border-white/10 backdrop-blur-xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between group hover:border-white/20 transition-all duration-500">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-pink-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-bold text-purple-200">
                                <Activity className="w-4 h-4" />
                                <span>Canlı Oylama</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
                                {poll.question}
                            </h2>
                            
                            {poll.description && (
                                <p className="text-xl text-white/70 font-medium leading-relaxed">
                                    {poll.description}
                                </p>
                            )}
                        </div>

                        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#1a103c] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white shadow-lg">
                                            <User className="w-6 h-6" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{totalVotes.toLocaleString()}</div>
                                    <div className="text-sm font-bold text-white/50 uppercase tracking-wider">Kişi Katıldı</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE: Interaction Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-7"
                >
                    <div className="bg-[#1a103c]/30 rounded-[3rem] border border-white/10 backdrop-blur-xl p-6 md:p-12 relative overflow-hidden shadow-2xl">
                        
                        {/* Step Progress */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-purple-300 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                                    Adım {step === "demographics" ? "1" : step === "vote" ? "2" : "3"} / 3
                                </span>
                                <span className="text-sm font-bold text-white/50">
                                    {step === "demographics" ? "Kimlik Bilgileri" : step === "vote" ? "Oylama" : "Sonuçlar"}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: "33%" }}
                                    animate={{ 
                                        width: step === "demographics" ? "33%" : step === "vote" ? "66%" : "100%" 
                                    }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* STEP 1: DEMOGRAPHICS */}
                            {step === "demographics" && (
                                <motion.form
                                    key="demographics"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleDemographicsSubmit}
                                    className="space-y-10"
                                >
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-black text-white mb-3">Seni Tanıyalım</h3>
                                        <p className="text-white/50 font-medium text-lg">Sonuçları daha doğru analiz edebilmemiz için.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Age Group */}
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-sm font-black text-purple-200 uppercase tracking-widest">
                                                <Baby className="w-4 h-4" /> Yaş Grubu
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {["18-24", "25-34", "35+"].map((age) => (
                                                    <button
                                                        key={age}
                                                        type="button"
                                                        onClick={() => setDemographics({ ...demographics, ageRange: age })}
                                                        className={cn(
                                                            "h-14 rounded-2xl border font-bold transition-all duration-200",
                                                            demographics.ageRange === age
                                                                ? "bg-purple-500 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                                                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                                        )}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-sm font-black text-purple-200 uppercase tracking-widest">
                                                <Users className="w-4 h-4" /> Cinsiyet
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { label: "Erkek", value: "Erkek", icon: User }, 
                                                    { label: "Kadın", value: "Kadın", icon: PersonStanding }, 
                                                    { label: "Diğer", value: "Belirtmek İstemiyorum", icon: Users }
                                                ].map((item) => (
                                                    <button
                                                        key={item.value}
                                                        type="button"
                                                        onClick={() => setDemographics({ ...demographics, gender: item.value })}
                                                        className={cn(
                                                            "h-14 rounded-2xl border font-bold transition-all duration-200 flex items-center justify-center gap-2",
                                                            demographics.gender === item.value
                                                                ? "bg-pink-500 text-white border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105"
                                                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                                        )}
                                                    >
                                                        <span className="hidden md:inline text-xs">{item.label}</span>
                                                        <span className="md:hidden text-xs">{item.label.slice(0,1)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-sm font-black text-purple-200 uppercase tracking-widest">
                                            <MapPin className="w-4 h-4" /> Şehir
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={demographics.city}
                                                onChange={(e) => setDemographics({ ...demographics, city: e.target.value })}
                                                className="w-full h-16 pl-6 pr-12 rounded-2xl border border-white/10 bg-white/5 text-white font-bold text-lg appearance-none focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer hover:bg-white/10"
                                            >
                                                <option value="" className="bg-[#1a103c]">Şehir Seçiniz</option>
                                                {cities.map((city) => (
                                                    <option key={city} value={city} className="bg-[#1a103c]">{city}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={!demographics.ageRange || !demographics.gender || !demographics.city || isSubmitting}
                                            className="w-full h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl tracking-wide hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                        >
                                            {isSubmitting ? (
                                                "İşleniyor..."
                                            ) : (
                                                <>
                                                    OYLAMAYA GEÇ <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}

                            {/* STEP 2: VOTE */}
                            {step === "vote" && (
                                <motion.div
                                    key="vote"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-black text-white mb-3">Oylarını Bekliyoruz!</h3>
                                        <p className="text-white/50 font-medium text-lg">Senin görüşün bizim için çok değerli.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {optimisticOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setSelectedOption(option.id)}
                                                className={cn(
                                                    "relative w-full p-6 rounded-2xl text-left transition-all duration-300 group border overflow-hidden",
                                                    selectedOption === option.id
                                                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                        selectedOption === option.id
                                                            ? "border-purple-400 bg-purple-500 text-white scale-110"
                                                            : "border-white/30 text-transparent group-hover:border-purple-400/50"
                                                    )}>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                    <span className={cn(
                                                        "text-xl font-bold transition-colors",
                                                        selectedOption === option.id ? "text-white" : "text-white/70 group-hover:text-white"
                                                    )}>
                                                        {option.text}
                                                    </span>
                                                </div>
                                                
                                                {selectedOption === option.id && (
                                                    <motion.div
                                                        layoutId="highlight"
                                                        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleVote}
                                        disabled={!selectedOption || isSubmitting}
                                        className="w-full h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl tracking-wide hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-8"
                                    >
                                        {isSubmitting ? (
                                            "Gönderiliyor..."
                                        ) : (
                                            <>
                                                OYU GÖNDER <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 3: RESULTS */}
                            {step === "results" && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-400 mb-6 ring-1 ring-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                                            <Trophy className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-3">Teşekkürler!</h3>
                                        <p className="text-white/50 font-medium text-lg">Oyun başarıyla kaydedildi. İşte güncel sonuçlar:</p>
                                    </div>

                                    <div className="space-y-6">
                                        {optimisticOptions
                                            .sort((a, b) => b.votes - a.votes)
                                            .map((option, index) => {
                                                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                                                const isWinner = index === 0;

                                                return (
                                                    <div key={option.id} className="relative group">
                                                        <div className="flex items-center justify-between mb-2 px-1">
                                                            <div className="flex items-center gap-3">
                                                                <span className={cn(
                                                                    "text-lg font-bold",
                                                                    isWinner ? "text-yellow-400" : "text-white/80"
                                                                )}>
                                                                    {option.text}
                                                                </span>
                                                                {isWinner && <Trophy className="w-4 h-4 text-yellow-400" />}
                                                            </div>
                                                            <span className="text-lg font-black text-white">{percentage}%</span>
                                                        </div>
                                                        
                                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 1, delay: index * 0.1, ease: "circOut" }}
                                                                className={cn(
                                                                    "h-full rounded-full shadow-lg relative overflow-hidden",
                                                                    isWinner 
                                                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                                                                        : "bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"
                                                                )}
                                                            >
                                                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                                                            </motion.div>
                                                        </div>
                                                        <div className="text-right mt-1 text-xs font-bold text-white/30">
                                                            {option.votes.toLocaleString()} oy
                                                        </div>
                                                    </div>
                                                );
                                        })}
                                    </div>

                                    {demographicResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm"
                                        >
                                            <p className="text-white/80 font-medium">
                                                {demographicResult}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
         )}
       </div>
    </main>
  );
}
