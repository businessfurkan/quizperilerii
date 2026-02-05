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
import { DotPattern } from "@/components/ui/background-patterns";

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
        colors: ['#8bb9e0', '#1e3a8a', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8bb9e0', '#1e3a8a', '#ffffff']
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
    <main className="min-h-screen pt-24 pb-12 px-4 relative bg-[#f8fafc] overflow-hidden font-sans">
       {/* Background Patterns */}
       <DotPattern 
        className="absolute inset-0 text-[#1e3a8a]/[0.05] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
        cx={1} cy={1} cr={1} width={24} height={24}
       />
       <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#8bb9e0]/20 to-transparent pointer-events-none" />

       <div className="container mx-auto max-w-7xl relative z-10">
         
         {/* Header Section */}
         <div className="text-center mb-12 md:mb-20 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] mb-8 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.2)]"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-black tracking-wider uppercase">Günün Anketi</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-[#1e3a8a] mb-6 tracking-tight leading-[1] drop-shadow-sm"
            >
              Senin Fikrin,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] to-[#8bb9e0]">
                Türkiye'nin Sesi!
              </span>
            </motion.h1>
            
            <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-xl md:text-2xl text-[#1e3a8a]/60 max-w-2xl mx-auto font-bold leading-relaxed"
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
                <div className="bg-white border-4 border-[#1e3a8a] rounded-[2.5rem] p-12 shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] max-w-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#8bb9e0]/10 group-hover:bg-[#8bb9e0]/20 transition-colors" />
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <Sparkles className="w-12 h-12 text-[#8bb9e0]" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1e3a8a] mb-4">Henüz Aktif Anket Yok</h2>
                        <p className="text-xl font-bold text-[#1e3a8a]/60">
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
                    <div className="relative rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(30,58,138,1)] bg-[#1e3a8a] border-4 border-[#1e3a8a] text-white p-8 md:p-12 min-h-[500px] flex flex-col justify-between group">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8bb9e0] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500 rounded-full blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold text-[#8bb9e0]">
                                <Activity className="w-4 h-4" />
                                <span>Canlı Oylama</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-white">
                                {poll.question}
                            </h2>
                            
                            {poll.description && (
                                <p className="text-xl text-[#8bb9e0] font-medium leading-relaxed">
                                    {poll.description}
                                </p>
                            )}
                        </div>

                        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#1e3a8a] bg-[#8bb9e0] flex items-center justify-center text-[#1e3a8a] shadow-lg">
                                            <User className="w-6 h-6" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{totalVotes.toLocaleString()}</div>
                                    <div className="text-sm font-bold text-[#8bb9e0] uppercase tracking-wider">Kişi Katıldı</div>
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
                    <div className="bg-white rounded-[3rem] border-4 border-[#1e3a8a] shadow-[12px_12px_0px_0px_rgba(139,185,224,1)] p-6 md:p-12 relative overflow-hidden">
                        
                        {/* Step Progress */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black text-[#1e3a8a] uppercase tracking-widest bg-[#8bb9e0]/20 px-3 py-1 rounded-lg">
                                    Adım {step === "demographics" ? "1" : step === "vote" ? "2" : "3"} / 3
                                </span>
                                <span className="text-sm font-bold text-[#1e3a8a]/60">
                                    {step === "demographics" ? "Kimlik Bilgileri" : step === "vote" ? "Oylama" : "Sonuçlar"}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#1e3a8a]"
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
                                        <h3 className="text-3xl font-black text-[#1e3a8a] mb-3">Seni Tanıyalım</h3>
                                        <p className="text-[#1e3a8a]/60 font-medium text-lg">Sonuçları daha doğru analiz edebilmemiz için.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Age Group */}
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-sm font-black text-[#1e3a8a] uppercase tracking-widest">
                                                <Baby className="w-4 h-4" /> Yaş Grubu
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {["18-24", "25-34", "35+"].map((age) => (
                                                    <button
                                                        key={age}
                                                        type="button"
                                                        onClick={() => setDemographics({ ...demographics, ageRange: age })}
                                                        className={cn(
                                                            "h-14 rounded-2xl border-2 font-bold transition-all duration-200",
                                                            demographics.ageRange === age
                                                                ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg scale-105"
                                                                : "bg-white border-slate-200 text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                                                        )}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-sm font-black text-[#1e3a8a] uppercase tracking-widest">
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
                                                            "h-14 rounded-2xl border-2 font-bold transition-all duration-200 flex items-center justify-center gap-2",
                                                            demographics.gender === item.value
                                                                ? "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg scale-105"
                                                                : "bg-white border-slate-200 text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
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
                                        <label className="flex items-center gap-2 text-sm font-black text-[#1e3a8a] uppercase tracking-widest">
                                            <MapPin className="w-4 h-4" /> Şehir
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={demographics.city}
                                                onChange={(e) => setDemographics({ ...demographics, city: e.target.value })}
                                                className="w-full h-16 pl-6 pr-12 rounded-2xl border-2 border-slate-200 bg-slate-50 text-[#1e3a8a] font-bold text-lg appearance-none focus:outline-none focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/10 transition-all cursor-pointer hover:bg-white"
                                            >
                                                <option value="">Şehir Seçiniz</option>
                                                {cities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#1e3a8a]">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={!demographics.ageRange || !demographics.gender || !demographics.city || isSubmitting}
                                            className="w-full h-20 rounded-2xl bg-[#1e3a8a] text-white font-black text-xl tracking-wide hover:bg-[#172554] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_8px_0px_0px_#172554] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3 group"
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="mb-8 text-center md:text-left">
                                        <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">Tarafını Seç</h3>
                                        <p className="text-[#1e3a8a]/60 font-medium text-lg">Görsele tıklayarak oyunu kullanabilirsin.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {poll.options.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setSelectedOption(option.id)}
                                                className={cn(
                                                    "group relative rounded-3xl overflow-hidden border-4 transition-all duration-300 h-[280px] w-full text-left",
                                                    selectedOption === option.id 
                                                        ? "border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] transform -translate-y-1" 
                                                        : "border-transparent hover:border-[#1e3a8a]/30 shadow-sm hover:shadow-md bg-slate-100"
                                                )}
                                            >
                                                {option.image ? (
                                                    <Image
                                                        src={option.image}
                                                        alt={option.text}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#8bb9e0]/20 flex items-center justify-center">
                                                        <span className="text-[#1e3a8a]/20 font-black text-6xl">?</span>
                                                    </div>
                                                )}
                                                
                                                <div className={cn(
                                                    "absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#1e3a8a]/40 to-transparent transition-opacity duration-300",
                                                    selectedOption === option.id ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                                                )} />

                                                {/* Selection Indicator */}
                                                <div className={cn(
                                                    "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                                    selectedOption === option.id 
                                                        ? "bg-[#8bb9e0] text-[#1e3a8a] scale-100 opacity-100 shadow-lg" 
                                                        : "bg-white/20 text-white scale-90 opacity-0"
                                                )}>
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>

                                                <div className="absolute bottom-0 left-0 w-full p-6">
                                                    <h4 className={cn(
                                                        "text-2xl font-black leading-tight drop-shadow-md transition-all duration-300",
                                                        selectedOption === option.id ? "text-[#8bb9e0] translate-x-2" : "text-white"
                                                    )}>
                                                        {option.text}
                                                    </h4>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={handleVote}
                                            disabled={!selectedOption || isSubmitting}
                                            className="w-full h-20 rounded-2xl bg-[#1e3a8a] text-[#8bb9e0] font-black text-xl tracking-wide hover:bg-[#172554] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_8px_0px_0px_#172554] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? "Oylanıyor..." : "OYU GÖNDER"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: RESULTS */}
                            {step === "results" && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8bb9e0] text-[#1e3a8a] mb-6 shadow-lg animate-bounce">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-4xl font-black text-[#1e3a8a] mb-2">Harikasın!</h3>
                                        <p className="text-[#1e3a8a]/60 font-medium text-lg">Oyun başarıyla kaydedildi. İşte anlık sonuçlar:</p>
                                    </div>

                                    <div className="space-y-6">
                                        {optimisticOptions.map((option) => {
                                            const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                                            const isWinner = Math.max(...optimisticOptions.map(o => o.votes)) === option.votes && option.votes > 0;

                                            return (
                                                <div key={option.id} className="group">
                                                    <div className="flex justify-between items-end mb-2 px-1">
                                                        <span className="font-bold text-[#1e3a8a] text-lg flex items-center gap-2">
                                                            {option.text}
                                                            {isWinner && <Trophy className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />}
                                                        </span>
                                                        <span className="font-black text-2xl text-[#1e3a8a]">{percentage}%</span>
                                                    </div>
                                                    
                                                    <div className="h-14 bg-slate-100 rounded-2xl p-2 relative overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1.5, ease: "circOut" }}
                                                            className={cn(
                                                                "h-full rounded-xl relative shadow-sm",
                                                                isWinner ? "bg-[#1e3a8a]" : "bg-[#8bb9e0]"
                                                            )}
                                                        >
                                                            {isWinner && (
                                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                                                            )}
                                                        </motion.div>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1e3a8a]/40">
                                                            {option.votes.toLocaleString()} oy
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-[#8bb9e0]/20 rounded-2xl p-6 border-2 border-[#1e3a8a]/10 flex items-start gap-4">
                                        <div className="p-3 bg-[#1e3a8a] text-white rounded-xl shadow-md shrink-0">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#1e3a8a] text-lg mb-1">Analiz</h4>
                                            <p className="text-[#1e3a8a]/80 font-medium leading-relaxed">
                                                Senin gibi <span className="font-black text-[#1e3a8a]">{demographics.ageRange}</span> yaş aralığındaki <span className="font-black text-[#1e3a8a]">{demographics.gender.toLowerCase()}</span> kullanıcılar genelde {demographicResult || "bu anketi"} tercih etti.
                                            </p>
                                        </div>
                                    </div>
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
