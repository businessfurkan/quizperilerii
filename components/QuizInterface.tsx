"use client";

import { useState, useEffect, useRef } from "react";
import { Quiz, TournamentItem } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCcw, Home, Trophy, Twitter, MessageCircle, Sparkles, Clock, Zap, Volume2, VolumeX, Share2, CheckCircle2, Crown, Flame } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import confetti from "canvas-confetti";
import QuizCard from "@/components/QuizCard";
import { DotPattern } from "@/components/ui/background-patterns";

type QuizWithItems = Quiz & { items: TournamentItem[] };

export default function QuizInterface({ quiz, similarQuizzes = [] }: { quiz: QuizWithItems, similarQuizzes?: Quiz[] }) {
  const [roundItems, setRoundItems] = useState<TournamentItem[]>(() => {
    return [...quiz.items].sort(() => Math.random() - 0.5);
  });
  const [nextRoundWinners, setNextRoundWinners] = useState<TournamentItem[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [winner, setWinner] = useState<TournamentItem | null>(null);
  const [roundName, setRoundName] = useState("Başlangıç Turu");
  const [roundNumber, setRoundNumber] = useState(1);
  const [direction, setDirection] = useState(0); 
  const [copied, setCopied] = useState(false);
  
  // Gamification States
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);

  // Audio refs
  const selectSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    selectSound.current = new Audio("/sounds/pop.mp3"); // Placeholder
    winSound.current = new Audio("/sounds/win.mp3"); // Placeholder
  }, []);

  const playSound = (type: 'select' | 'win') => {
    if (!soundEnabled) return;
    // In a real app, you'd play the sound here.
    // if (type === 'select' && selectSound.current) selectSound.current.play().catch(() => {});
    // if (type === 'win' && winSound.current) winSound.current.play().catch(() => {});
  };

  // Timer Effect
  useEffect(() => {
    if (!isTimerActive || winner) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Just reset for now to keep game flow smooth
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, winner, currentPairIndex]);

  const handleShare = async (platform: 'twitter' | 'whatsapp' | 'copy') => {
    const text = `Bu quizde şampiyonum: ${winner?.text}! Sen de dene: ${quiz.title}`;
    const url = window.location.href;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const currentItem1 = roundItems[currentPairIndex];
  const currentItem2 = roundItems[currentPairIndex + 1];

  // Calculate Progress
  const totalPairsInRound = roundItems.length / 2;
  const progress = ((currentPairIndex / 2) / totalPairsInRound) * 100;

  const handleSelect = (selected: TournamentItem, selectedIndex: number) => {
    playSound('select');
    setDirection(selectedIndex === 0 ? -1 : 1);
    
    // Add Score (Time Bonus)
    const timeBonus = timeLeft * 10;
    setScore(prev => prev + 100 + timeBonus);
    setCombo(prev => prev + 1);
    
    // Reset Timer
    setTimeLeft(10);
    setIsTimerActive(false);

    setTimeout(() => {
      const newWinners = [...nextRoundWinners, selected];
      
      if (currentPairIndex + 2 >= roundItems.length) {
        if (newWinners.length === 1) {
          setWinner(newWinners[0]);
          playSound('win');
          triggerConfetti();
        } else {
          setRoundItems(newWinners);
          setNextRoundWinners([]);
          setCurrentPairIndex(0);
          setRoundNumber(prev => prev + 1);
          setCombo(0); 
          
          if (newWinners.length === 8) setRoundName("Çeyrek Final");
          else if (newWinners.length === 4) setRoundName("Yarı Final");
          else if (newWinners.length === 2) setRoundName("Büyük Final");
        }
      } else {
        setNextRoundWinners(newWinners);
        setCurrentPairIndex(currentPairIndex + 2);
      }
      setIsTimerActive(true);
    }, 400);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8bb9e0', '#1e3a8a', '#facc15']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8bb9e0', '#1e3a8a', '#facc15']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (winner) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
         <DotPattern className="absolute inset-0 text-[#1e3a8a]/[0.05]" cx={1} cy={1} cr={1} width={20} height={20} />
         
         <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border-[6px] border-[#1e3a8a] shadow-[16px_16px_0px_0px_rgba(30,58,138,1)] text-center relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#8bb9e0]/20 to-transparent" />
             <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#facc15]/20 rounded-full blur-3xl" />
             
             <div className="relative z-10 space-y-8">
               <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 bg-[#1e3a8a] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-lg transform -rotate-2"
               >
                 <Crown className="w-6 h-6 text-[#facc15] fill-current animate-bounce" />
                 <span>Şampiyon Seçildi</span>
               </motion.div>

               <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto group perspective-1000">
                  <motion.div 
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-[6px] border-[#1e3a8a] shadow-[12px_12px_0px_0px_rgba(30,58,138,0.3)] bg-white"
                  >
                    <Image
                      src={winner.image || "/fallback-quiz.jpg"}
                      alt={winner.text}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6">
                       <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-md leading-none mb-2">{winner.text}</h2>
                    </div>
                  </motion.div>
                  {/* Floating Elements */}
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#facc15] rounded-full flex items-center justify-center border-4 border-[#1e3a8a] shadow-lg animate-bounce">
                    <Trophy className="w-10 h-10 text-[#1e3a8a] fill-current" />
                  </div>
               </div>

               <div className="space-y-2">
                 <p className="text-xl font-bold text-[#1e3a8a]/60">Toplam Puanın</p>
                 <div className="text-6xl font-black text-[#1e3a8a] tracking-tighter flex items-center justify-center gap-2">
                   <Zap className="w-8 h-8 text-[#facc15] fill-current" />
                   {score.toLocaleString()}
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
                 <Button onClick={() => handleShare('twitter')} className="w-full bg-[#1DA1F2] hover:bg-[#0c85d0] text-white border-b-4 border-[#0c85d0] active:border-b-0 active:translate-y-1 h-14 rounded-2xl text-lg font-bold transition-all">
                   <Twitter className="w-5 h-5 mr-2 fill-current" />
                   Twitter'da Paylaş
                 </Button>
                 <Button onClick={() => handleShare('whatsapp')} className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white border-b-4 border-[#1ebc57] active:border-b-0 active:translate-y-1 h-14 rounded-2xl text-lg font-bold transition-all">
                   <MessageCircle className="w-5 h-5 mr-2 fill-current" />
                   WhatsApp'ta Paylaş
                 </Button>
               </div>

               <div className="flex items-center justify-center gap-6 pt-6 border-t-2 border-[#1e3a8a]/10 mt-8">
                 <Link href="/" className="flex items-center gap-2 text-[#1e3a8a]/60 hover:text-[#1e3a8a] font-bold transition-colors">
                   <Home className="w-5 h-5" />
                   Ana Sayfa
                 </Link>
                 <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-[#1e3a8a] hover:text-blue-600 font-black transition-colors">
                   <RefreshCcw className="w-5 h-5" />
                   Tekrar Oyna
                 </button>
               </div>
             </div>
          </div>
         </motion.div>

         {similarQuizzes.length > 0 && (
            <div className="mt-16 w-full max-w-6xl">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <Sparkles className="w-6 h-6 text-[#1e3a8a]" />
                <h3 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-wide">
                  Bunları da Seveceksin
                </h3>
                <Sparkles className="w-6 h-6 text-[#1e3a8a]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarQuizzes.map((q, idx) => (
                  <div key={q.id} className="h-auto">
                    <QuizCard quiz={q as QuizWithItems} index={idx} />
                  </div>
                ))}
              </div>
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-hidden relative font-sans">
      <DotPattern className="absolute inset-0 text-[#1e3a8a]/[0.03]" cx={1} cy={1} cr={1} width={24} height={24} />
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 w-full h-[500px] bg-gradient-to-b from-[#8bb9e0]/10 to-transparent -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 py-6 flex flex-col h-full flex-grow relative z-10 max-w-7xl">
        {/* Header Stats */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-4 md:p-6 border-[3px] border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] mb-6 md:mb-10 flex flex-col md:flex-row items-center justify-between gap-6 sticky top-4 z-50"
        >
           {/* Left: Round Info */}
           <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white shadow-md">
                 <Trophy className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-bold text-[#1e3a8a]/50 uppercase tracking-wider">Şu Anki Tur</p>
                 <h2 className="text-lg font-black text-[#1e3a8a] leading-none">{roundName}</h2>
               </div>
             </div>
             
             {/* Mobile Timer */}
             <div className="md:hidden">
               <div className={cn(
                 "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 transition-all",
                 timeLeft <= 3 ? "bg-red-500 border-red-600 text-white animate-pulse" : "bg-[#facc15] border-[#1e3a8a] text-[#1e3a8a]"
               )}>
                 {timeLeft}
               </div>
             </div>
           </div>

           {/* Center: Progress & Score */}
           <div className="flex-1 w-full md:max-w-xl flex flex-col gap-2">
             <div className="flex justify-between items-end px-1">
               <span className="text-xs font-bold text-[#1e3a8a]/60 uppercase">İlerleme</span>
               <div className="flex items-center gap-1 text-[#1e3a8a] font-black">
                 <Zap className="w-4 h-4 text-[#facc15] fill-current" />
                 <span>{score} Puan</span>
               </div>
             </div>
             <div className="h-4 bg-[#1e3a8a]/10 rounded-full overflow-hidden border border-[#1e3a8a]/20">
               <motion.div 
                 className="h-full bg-[#1e3a8a] relative"
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
               >
                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
               </motion.div>
             </div>
           </div>

           {/* Right: Controls & Timer */}
           <div className="flex items-center gap-3 hidden md:flex">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className="w-12 h-12 rounded-xl border-2 border-[#1e3a8a]/20 flex items-center justify-center text-[#1e3a8a] hover:bg-blue-50 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <div className={cn(
                 "px-5 py-2.5 rounded-xl border-2 font-black flex items-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]",
                 timeLeft <= 3 ? "bg-red-500 border-red-600 text-white animate-pulse scale-110" : "bg-[#facc15] border-[#1e3a8a] text-[#1e3a8a]"
               )}>
                 <Clock className="w-5 h-5" />
                 <span className="text-xl w-6 text-center">{timeLeft}s</span>
              </div>
           </div>
        </motion.div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 relative min-h-[500px]">
          {/* VS Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <motion.div 
              key={currentPairIndex}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 md:w-28 md:h-28 bg-[#facc15] border-[6px] border-[#1e3a8a] rounded-full flex items-center justify-center shadow-[0px_0px_30px_rgba(250,204,21,0.6)]"
            >
              <span className="font-black text-3xl md:text-5xl text-[#1e3a8a] italic -skew-x-12">VS</span>
            </motion.div>
          </div>

          <AnimatePresence mode="popLayout" custom={direction}>
            {currentItem1 && currentItem2 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 w-full h-full">
                  <ChoiceCard 
                    key={`left-${currentItem1.id}`}
                    item={currentItem1} 
                    onClick={() => handleSelect(currentItem1, 0)}
                    direction={-1}
                    disabled={!isTimerActive}
                  />
                  <ChoiceCard 
                    key={`right-${currentItem2.id}`}
                    item={currentItem2} 
                    onClick={() => handleSelect(currentItem2, 1)}
                    direction={1}
                    disabled={!isTimerActive}
                  />
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({ item, onClick, direction, disabled }: { item: TournamentItem, onClick: () => void, direction: number, disabled: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 100, rotate: direction * 5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.3 } }}
      whileHover={!disabled ? { scale: 1.03, y: -10 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative group cursor-pointer h-[350px] md:h-[600px] w-full touch-manipulation",
        disabled && "pointer-events-none grayscale-[0.5]"
      )}
    >
      {/* Card Shadow/Border Layer */}
      <div className="absolute inset-0 bg-[#1e3a8a] rounded-[2.5rem] transform translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300" />
      
      {/* Main Card Content */}
      <div className="absolute inset-0 bg-white border-[5px] border-[#1e3a8a] rounded-[2.5rem] overflow-hidden shadow-inner flex flex-col">
        {/* Image Container */}
        <div className="relative flex-grow overflow-hidden bg-gray-100">
           <Image
             src={item.image}
             alt={item.text}
             fill
             className="object-cover transition-transform duration-700 group-hover:scale-110"
             priority
           />
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-transparent to-transparent opacity-80" />
           
           {/* Selection Overlay */}
           <div className="absolute inset-0 bg-[#1e3a8a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="bg-[#facc15] text-[#1e3a8a] px-8 py-3 rounded-2xl font-black text-xl uppercase tracking-widest border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] transform scale-0 group-hover:scale-100 transition-transform duration-300">
                 Bunu Seç
              </div>
           </div>
        </div>

        {/* Text Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center bg-gradient-to-t from-[#1e3a8a] to-transparent pt-20">
          <h3 className="text-2xl md:text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] leading-tight">
            {item.text}
          </h3>
        </div>
      </div>
      
      {/* Mobile Touch Indicator */}
      <div className="absolute top-4 right-4 md:hidden">
        <div className="bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30">
           <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
