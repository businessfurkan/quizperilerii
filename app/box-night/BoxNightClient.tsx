"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertTriangle, Check, Box as BoxIcon, Gift, Skull, Heart, Zap, RefreshCw, Bomb } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { ModernGridPattern } from "@/components/ui/background-patterns";
import Image from "next/image";
import { BoxNightTask } from "@prisma/client";

// Fallback data if DB is empty
const FALLBACK_TASKS = [
  { id: "f1", text: "Partnerine 1 dakika boyunca masaj yap.", type: "reward", icon: "Heart" },
  { id: "f2", text: "Partnerin sana bir ceza belirlesin.", type: "risk", icon: "Skull" },
  { id: "f3", text: "Partnerini 10 saniye boyunca öp.", type: "reward", icon: "Heart" },
  { id: "f4", text: "Partnerine en sevdiğin özelliğini söyle.", type: "fun", icon: "Gift" },
  { id: "f5", text: "Bir şarkı aç ve partnerinle dans et.", type: "fun", icon: "Zap" },
  { id: "f6", text: "Partnerin telefonunu 1 dakika boyunca karıştırabilir.", type: "risk", icon: "Lock" },
  { id: "f7", text: "Partnerine seksi bir poz ver.", type: "fun", icon: "Zap" },
  { id: "f8", text: "Partnerin sana bir soru sorsun, dürüstçe cevapla.", type: "risk", icon: "AlertTriangle" },
];

// Icon mapping
const ICON_MAP: Record<string, any> = {
  Heart,
  Lock,
  Skull,
  Zap,
  Gift,
  AlertTriangle,
  Bomb,
};

type BoxNightClientProps = {
  initialTasks: BoxNightTask[];
};

export default function BoxNightClient({ initialTasks }: BoxNightClientProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [gameState, setGameState] = useState<"selection" | "playing" | "result">("selection");
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Selection, setPlayer1Selection] = useState<string | null>(null);
  const [player2Selection, setPlayer2Selection] = useState<string | null>(null);
  
  // Transform DB tasks to Game tasks (add mapped icon)
  const [gameTasks, setGameTasks] = useState(() => {
    // Ensure we have at least 12 items (duplicate if needed)
    // Use fallback if empty
    let sourceTasks = initialTasks.length > 0 ? [...initialTasks] : [...FALLBACK_TASKS];
    
    // Safety check if even fallback is empty (unlikely)
    if (sourceTasks.length === 0) return []; 
    
    const result = [];
    let i = 0;
    while (result.length < 12) {
      // Cast to any because FALLBACK_TASKS items don't have createdAt/updatedAt
      const task = sourceTasks[i % sourceTasks.length] as any;
      result.push({
        ...task,
        id: `${task.id}-${result.length}`, // Ensure unique ID for React keys
        icon: ICON_MAP[task.icon] || Heart // Fallback icon
      });
      i++;
    }
    return result;
  });

  const [shuffledBoxes, setShuffledBoxes] = useState(gameTasks);
  const [openedBoxIds, setOpenedBoxIds] = useState<string[]>([]); // Track all opened boxes
  const [resultData, setResultData] = useState<{ type: "clean" | "penalty", box: typeof gameTasks[0], player?: 1 | 2 } | null>(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  // Başlangıçta ve her turda kutuları karıştır
  useEffect(() => {
    shuffleBoxes();
  }, []);

  const shuffleBoxes = () => {
    setShuffledBoxes([...gameTasks].sort(() => Math.random() - 0.5));
  };

  const handleBoxSelect = (boxId: string) => {
    // 1. AŞAMA: GİZLİ SEÇİM
    if (gameState === "selection") {
      // Zaten seçilmişse işlem yapma
      if (boxId === player1Selection || boxId === player2Selection) return;

      if (currentPlayer === 1) {
        setPlayer1Selection(boxId);
      } else {
        setPlayer2Selection(boxId);
      }
      return;
    }

    // 2. AŞAMA: OYUN (KUTU AÇMA)
    if (gameState === "playing") {
      // Açılmış kutuyu tekrar açamazsın
      if (openedBoxIds.includes(boxId)) return;

      handleBoxOpen(boxId);
    }
  };

  const confirmSelection = () => {
    if (currentPlayer === 1 && player1Selection !== null) {
      setCurrentPlayer(2);
    } else if (currentPlayer === 2 && player2Selection !== null) {
      setGameState("playing");
      setCurrentPlayer(1); // Oyun başlayınca sıra 1. oyuncuda
    }
  };

  const handleBoxOpen = (boxId: string) => {
    setOpenedBoxIds(prev => [...prev, boxId]);
    
    const selectedBox = shuffledBoxes.find(b => b.id === boxId);
    if (!selectedBox) return;

    // KAZANMA/KAYBETME MANTIĞI:
    // Eğer açılan kutu birinin "Tuzağı" ise -> O tuzağı kuran kazanır, basan kaybeder.
    // Ya da: Basan kişi "Yakalandı" olur.
    
    if (boxId === player1Selection) {
      // 1. Oyuncunun kutusu açıldı!
      setGameState("result");
      setResultData({ type: "penalty", box: selectedBox, player: currentPlayer });
      
      // Patlama animasyonu bitince modalı aç (1.2sn sonra)
      setTimeout(() => {
        setShowPenaltyModal(true);
      }, 1200);
      
      triggerBadConfetti();

    } else if (boxId === player2Selection) {
      // 2. Oyuncunun kutusu açıldı!
      setGameState("result");
      setResultData({ type: "penalty", box: selectedBox, player: currentPlayer });
      
      setTimeout(() => {
        setShowPenaltyModal(true);
      }, 1200);
      
      triggerBadConfetti();

    } else {
      // TEMİZ KUTU
      setResultData({ type: "clean", box: selectedBox, player: currentPlayer });
      triggerGoodConfetti();
      
      // Sırayı diğer oyuncuya geçir (Kısa bir gecikme ile)
      setTimeout(() => {
        setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      }, 500);
    }
  };

  const resetGame = () => {
    setGameState("selection");
    setCurrentPlayer(1);
    setPlayer1Selection(null);
    setPlayer2Selection(null);
    setOpenedBoxIds([]);
    setResultData(null);
    setShowPenaltyModal(false);
    shuffleBoxes();
  };

  const triggerGoodConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#ffffff']
    });
  };

  const triggerBadConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#ef4444', '#000000'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4 relative overflow-hidden font-nunito">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-[#1a0b2e] to-[#0f0518]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <ModernGridPattern className="absolute inset-0 text-white/[0.05]"  width={40} height={40} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#2a1b3d]/90 border border-white/10 p-10 rounded-[2.5rem] text-center space-y-8 relative z-10 shadow-[0_0_80px_rgba(168,85,247,0.2)] backdrop-blur-xl ring-1 ring-white/10"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 shadow-inner animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">
              DİKKAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">18+</span>
            </h1>
            <p className="text-zinc-300 font-medium leading-relaxed">
              Bu oyun sadece yetişkin çiftler içindir. İçerisinde sürpriz cezalar ve görevler bulunur. Devam etmek için yaşınızı doğrulayın.
            </p>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => setIsVerified(true)}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 group"
            >
              <Check className="w-6 h-6 group-hover:scale-125 transition-transform" />
              18 Yaşından Büyüğüm
            </button>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold rounded-2xl transition-all border border-white/5 hover:border-white/10">
              Geri Dön
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-white relative overflow-hidden flex flex-col font-nunito selection:bg-purple-500/30">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#1a0b2e] to-[#0f0518]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      <ModernGridPattern className="absolute inset-0 text-white/[0.03]" width={40} height={40} />

      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[128px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[128px] mix-blend-screen animate-pulse delay-1000" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-2xl shadow-2xl shadow-purple-900/20">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
            <BoxIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">BOX NIGHT</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase">ÇİFTLERE ÖZEL</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
          <div className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-2",
            (gameState === "selection" && currentPlayer === 1) || (gameState === "playing" && currentPlayer === 1)
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-white/20" 
              : "text-white/40 hover:text-white/60 hover:bg-white/5"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              (gameState === "selection" && currentPlayer === 1) || (gameState === "playing" && currentPlayer === 1)
               ? "bg-white animate-pulse" : "bg-zinc-700"
            )} />
            1. Oyuncu
          </div>
          <div className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-2",
            (gameState === "selection" && currentPlayer === 2) || (gameState === "playing" && currentPlayer === 2)
              ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/25 ring-1 ring-white/20" 
              : "text-white/40 hover:text-white/60 hover:bg-white/5"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              (gameState === "selection" && currentPlayer === 2) || (gameState === "playing" && currentPlayer === 2)
               ? "bg-white animate-pulse" : "bg-zinc-700"
            )} />
            2. Oyuncu
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center">
        
        {/* Instructions / Status */}
        <div className="mb-16 text-center space-y-2 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {gameState === "selection" && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-white/5 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md shadow-2xl">
                    <span className={cn(
                      "font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
                      currentPlayer === 1 ? "from-purple-400 to-indigo-400" : "from-pink-400 to-rose-400"
                    )}>
                      {currentPlayer}. Oyuncu: Bir tuzak kutusu seç! (GİZLİ)
                    </span>
                </div>
              </motion.div>
            )}
            
            {gameState === "playing" && (
               <motion.div 
                 key="playing"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex flex-col items-center gap-3"
               >
                  <div className={cn(
                    "text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br drop-shadow-sm",
                    currentPlayer === 1 ? "from-purple-400 to-indigo-400" : "from-pink-400 to-rose-400"
                  )}>
                    SIRA {currentPlayer}. OYUNCUDA!
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 font-medium text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                    Bir kutu aç...
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feedback Text (Top) */}
        <div className="h-20 flex items-center justify-center mb-8 relative z-50">
          <AnimatePresence mode="wait">
            {resultData?.type === "clean" && (
              <motion.div 
                key="clean"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/50 px-10 py-4 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <h2 className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  TEMİZ!
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Boxes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full [perspective:1000px]">
          {shuffledBoxes.map((box) => {
            // Görünürlük Mantığı:
            // 1. Seçim aşamasında: Sadece o anki oyuncu KENDİ seçimini görür.
            // 2. Oyun aşamasında: Kimse seçimleri göremez, sadece açılanları görür.
            
            const isSelectedByCurrentPlayer = 
              gameState === "selection" && 
              ((currentPlayer === 1 && player1Selection === box.id) || 
               (currentPlayer === 2 && player2Selection === box.id));

            const isOpened = openedBoxIds.includes(box.id);
            const isExploding = gameState === "result" && resultData?.type === "penalty" && resultData.box.id === box.id;
            
            // Temiz açılan kutu: Açılmış ama patlamamış
            const isCleanOpened = isOpened && !isExploding && !(gameState === "result" && resultData?.type === "penalty" && resultData.box.id === box.id);

            return (
              <motion.button
                key={box.id}
                layout
                onClick={() => handleBoxSelect(box.id)}
                disabled={
                  (gameState === "selection" && isSelectedByCurrentPlayer) ||
                  (gameState === "playing" && isOpened) ||
                  (gameState === "result")
                }
                whileHover={
                  !isOpened && gameState !== "result" 
                    ? { scale: 1.05, y: -5, rotateX: 5 } 
                    : {}
                }
                whileTap={!isOpened && gameState !== "result" ? { scale: 0.95 } : {}}
                animate={isExploding ? { 
                    scale: [1, 1.2, 0], 
                    rotate: [0, 10, -10, 20, 0], 
                    opacity: [1, 1, 0] 
                } : {
                    scale: 1,
                    opacity: 1,
                    rotateY: isCleanOpened ? 180 : 0
                }}
                transition={isExploding ? { duration: 0.6 } : { type: "spring", stiffness: 260, damping: 20 }}
                className={cn(
                  "relative aspect-square rounded-[2rem] transition-all duration-300 cursor-pointer group",
                  // Seçim aşamasında kendi seçimini gör
                  isSelectedByCurrentPlayer && currentPlayer === 1 && "ring-4 ring-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] z-20 scale-105",
                  isSelectedByCurrentPlayer && currentPlayer === 2 && "ring-4 ring-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.4)] z-20 scale-105",
                  
                  // Açılmış temiz kutu
                  isCleanOpened && "cursor-default z-0"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Box Front (Closed) */}
                <div 
                    className="absolute inset-0 w-full h-full"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className={cn(
                        "w-full h-full rounded-[2rem] flex items-center justify-center relative overflow-hidden border",
                        // Modern Box Style
                        "bg-[#2a1b3d]/80 backdrop-blur-sm border-white/10 shadow-2xl",
                        "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1),_transparent_40%)]",
                        // Hover glow
                        !isOpened && "group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:bg-[#322046] transition-all duration-500"
                    )}>
                        {/* Metallic/Texture overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                        
                        {/* Box Lid Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 group-hover:bg-purple-500/30 transition-colors duration-500" />
                        
                        {/* Icon */}
                        <div className="relative z-10 text-white/20 group-hover:text-white/80 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                             {isExploding ? (
                                <Bomb className="w-24 h-24 text-red-500 animate-pulse drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                             ) : (
                                <BoxIcon className="w-16 h-16 stroke-[1]" />
                             )}
                        </div>

                        {/* Selection Badges */}
                        {isSelectedByCurrentPlayer && (
                            <div className={cn(
                                "absolute top-4 right-4 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5 backdrop-blur-md border border-white/20",
                                currentPlayer === 1 ? "bg-purple-600/80" : "bg-pink-600/80"
                            )}>
                                <Lock className="w-3 h-3" />
                                SEÇİLDİ
                            </div>
                        )}
                    </div>
                </div>

                {/* Box Back (Opened - CLEAN) */}
                {isCleanOpened && (
                  <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ 
                          backfaceVisibility: "hidden", 
                          transform: "rotateY(180deg)" 
                      }}
                  >
                      <div className={cn(
                          "w-full h-full rounded-[2rem] flex flex-col items-center justify-center p-4 text-center border-2 border-emerald-500/30",
                          "bg-gradient-to-b from-emerald-900/40 to-[#1a0b2e] shadow-[inset_0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-xl"
                      )}>
                          <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="bg-emerald-500/20 p-4 rounded-full mb-3 ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                          >
                              <Check className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                          </motion.div>
                          <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 tracking-wider"
                          >
                              TEMİZ
                          </motion.p>
                      </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-16 h-24 flex items-center justify-center">
          {gameState === "selection" && (
            (currentPlayer === 1 && player1Selection !== null) || 
            (currentPlayer === 2 && player2Selection !== null)
          ) && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={confirmSelection}
              className="relative group px-12 py-5 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 ring-2 ring-white/20 rounded-2xl" />
              
              <span className="relative flex items-center gap-3 text-white font-black text-xl tracking-wide">
                {currentPlayer === 1 ? "GİZLE & DEVAM ET" : "GİZLE & BAŞLAT"}
                <div className="bg-white/20 p-1 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
              </span>
            </motion.button>
          )}
        </div>
      </main>

      {/* Penalty Modal */}
      <AnimatePresence>
        {showPenaltyModal && resultData?.type === "penalty" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Dark/Blur Backdrop */}
            <div className="absolute inset-0 bg-[#0f0518]/90 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            {/* Animated Particles/Glow in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[128px] animate-pulse mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[128px] animate-pulse delay-700 mix-blend-screen" />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full"
            >
                {/* Card Container */}
                <div className="relative bg-[#1a0b2e] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.4)] ring-1 ring-white/10">
                    
                    {/* Header Image Section */}
                    <div className="relative h-80 w-full group">
                        {resultData.box.image ? (
                            <Image 
                                src={resultData.box.image}
                                alt="Penalty"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-900 to-zinc-900 flex items-center justify-center">
                                <Skull className="w-32 h-32 text-red-500/50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-[#1a0b2e]/60 to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 3 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="bg-red-600 text-white font-black px-6 py-2.5 rounded-2xl shadow-xl border-2 border-red-400/30 text-lg uppercase tracking-wider transform rotate-3 flex items-center gap-2"
                            >
                                <Skull className="w-5 h-5" />
                                {resultData.player}. OYUNCU YANDI!
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 pb-12 -mt-16 relative z-10 flex flex-col items-center text-center">
                        
                        {/* Icon Circle */}
                        <div className="w-28 h-28 bg-[#2a1b3d] rounded-[2rem] border-4 border-[#1a0b2e] shadow-2xl flex items-center justify-center mb-8 transform rotate-45 group hover:rotate-0 transition-all duration-500 ring-1 ring-white/10">
                            <div className="transform -rotate-45 group-hover:rotate-0 transition-all duration-500">
                                <resultData.box.icon className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 mb-10 w-full">
                            <h2 className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] border border-red-500/30 py-1.5 px-4 rounded-full inline-block bg-red-500/10">
                                GÖREVİN & CEZAN
                            </h2>
                            <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 leading-[1.2] drop-shadow-sm">
                                "{resultData.box.text}"
                            </p>
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={resetGame}
                            className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-2xl text-xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <RefreshCw className="w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-700 relative z-10" />
                            <span className="relative z-10">YENİ TUR BAŞLAT</span>
                        </button>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
