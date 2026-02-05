"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertTriangle, Check, Box as BoxIcon, Gift, Skull, Heart, Zap, RefreshCw, Bomb } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { DotPattern } from "@/components/ui/background-patterns";
import Image from "next/image";
import { BoxNightTask } from "@prisma/client";

// Fallback data if DB is empty
const FALLBACK_TASKS = [
  { id: "1", text: "Diğer oyuncuya 1 dakika masaj yap.", type: "reward", icon: "Heart", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
  { id: "2", text: "Telefonunu 5 dakika diğer oyuncuya ver.", type: "risk", icon: "Lock", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
  { id: "3", text: "Diğer oyuncunun seçtiği bir şarkıyı söyle.", type: "fun", icon: "Zap", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80" },
  { id: "4", text: "Bir sonraki tura kadar tek ayak üzerinde dur.", type: "risk", icon: "Skull", image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800&q=80" },
  { id: "5", text: "Diğer oyuncuya en sevdiğin özelliğini söyle.", type: "reward", icon: "Heart", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80" },
  { id: "6", text: "Diğer oyuncunun istediği bir içeceği hazırla.", type: "fun", icon: "Gift", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80" },
  { id: "7", text: "10 şınav çek.", type: "risk", icon: "Zap", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
  { id: "8", text: "Diğer oyuncuya dürüstçe bir sırrını anlat.", type: "risk", icon: "Lock", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80" },
  { id: "9", text: "Gözlerin kapalıyken diğer oyuncunun eline dokunarak onu tanı.", type: "fun", icon: "Heart", image: "https://images.unsplash.com/photo-1615751072497-5f5169febe33?w=800&q=80" },
  { id: "10", text: "Diğer oyuncunun seçtiği bir şeyi ye (limon, acı biber vb.).", type: "risk", icon: "Skull", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80" },
  { id: "11", text: "Diğer oyuncuya romantik bir iltifat et.", type: "reward", icon: "Heart", image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&q=80" },
  { id: "12", text: "Bir sonraki tur boyunca konuşmak yasak.", type: "risk", icon: "Lock", image: "https://images.unsplash.com/photo-1576764402988-7143f6cca974?w=800&q=80" },
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
      // Sırayı diğer oyuncuya geçir
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <DotPattern className="absolute inset-0 text-white/[0.1]" cx={1} cy={1} cr={1} width={20} height={20} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-900 border-2 border-red-900/50 p-8 rounded-3xl text-center space-y-8 relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
        >
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter">
              DİKKAT <span className="text-red-500">18+</span>
            </h1>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Bu oyun sadece yetişkin çiftler içindir. İçerisinde sürpriz cezalar ve görevler bulunur. Devam etmek için yaşınızı doğrulayın.
            </p>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => setIsVerified(true)}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              18 Yaşından Büyüğüm
            </button>
            <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all">
              Geri Dön
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex flex-col">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
      <DotPattern className="absolute inset-0 text-white/[0.05]" cx={1} cy={1} cr={1} width={32} height={32} />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg">
            <BoxIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">BOX NIGHT</h1>
            <p className="text-xs text-red-500 font-bold tracking-widest uppercase">Çiftlere Özel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300",
            (gameState === "selection" && currentPlayer === 1) || (gameState === "playing" && currentPlayer === 1)
              ? "bg-blue-600 text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
              : "bg-zinc-800 text-zinc-500 scale-90 opacity-50"
          )}>
            1. Oyuncu
          </div>
          <div className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300",
            (gameState === "selection" && currentPlayer === 2) || (gameState === "playing" && currentPlayer === 2)
              ? "bg-pink-600 text-white scale-110 shadow-[0_0_20px_rgba(219,39,119,0.5)]" 
              : "bg-zinc-800 text-zinc-500 scale-90 opacity-50"
          )}>
            2. Oyuncu
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center">
        
        {/* Instructions / Status */}
        <div className="mb-12 text-center space-y-2 h-20">
          <AnimatePresence mode="wait">
            {gameState === "selection" && (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="inline-block bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-full"
              >
                <span className={cn(
                  "font-bold text-lg",
                  currentPlayer === 1 ? "text-blue-500" : "text-pink-500"
                )}>
                  {currentPlayer}. Oyuncu: Bir tuzak kutusu seç! (GİZLİ)
                </span>
              </motion.div>
            )}
            
            {gameState === "playing" && (
               <motion.div 
                 key="playing"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex flex-col items-center gap-2"
               >
                  <h2 className={cn(
                    "text-3xl font-black",
                    currentPlayer === 1 ? "text-blue-500" : "text-pink-500"
                  )}>
                    SIRA {currentPlayer}. OYUNCUDA!
                  </h2>
                  <p className="text-zinc-400 font-medium">Bir kutu aç...</p>
               </motion.div>
            )}

            {gameState === "result" && resultData?.type === "clean" && (
              <motion.div 
                key="clean"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-500/20 border-2 border-green-500 px-8 py-3 rounded-2xl"
              >
                <h2 className="text-3xl font-black text-green-400">
                  TEMİZ!
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Boxes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl w-full perspective-1000">
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
                    ? { scale: 1.05, y: -5 } 
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
                  "relative aspect-square rounded-2xl transition-all duration-300 cursor-pointer [perspective:1000px]",
                  // Seçim aşamasında kendi seçimini gör
                  isSelectedByCurrentPlayer && currentPlayer === 1 && "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.6)] z-20",
                  isSelectedByCurrentPlayer && currentPlayer === 2 && "ring-4 ring-pink-500 shadow-[0_0_30px_rgba(219,39,119,0.6)] z-20",
                  
                  // Açılmış temiz kutu
                  isCleanOpened && "cursor-default z-0"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Box Front (Closed) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <div className={cn(
                        "w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden border-2",
                        // Normal Box Style
                        "bg-gradient-to-b from-zinc-800 to-zinc-950 border-zinc-700 shadow-xl",
                        // Hover glow
                        !isOpened && "group-hover:border-zinc-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                    )}>
                        {/* Metallic/Texture overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-20" />
                        
                        {/* Box Lid Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/50 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
                        
                        {/* Icon */}
                        <div className="relative z-10 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300">
                             {isExploding ? (
                                <Bomb className="w-20 h-20 text-red-600 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                             ) : (
                                <BoxIcon className="w-16 h-16 stroke-[1.5]" />
                             )}
                        </div>

                        {/* Selection Badges */}
                        {isSelectedByCurrentPlayer && (
                            <div className={cn(
                                "absolute top-3 right-3 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-20 flex items-center gap-1",
                                currentPlayer === 1 ? "bg-blue-600" : "bg-pink-600"
                            )}>
                                {currentPlayer === 1 ? <Lock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                SEÇİLDİ
                            </div>
                        )}
                    </div>
                </div>

                {/* Box Back (Opened - CLEAN) */}
                <div 
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                    <div className={cn(
                        "w-full h-full rounded-2xl flex flex-col items-center justify-center p-2 text-center border-2 border-green-500/30",
                        "bg-gradient-to-b from-green-900/30 to-zinc-900 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]"
                    )}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-green-500/20 p-3 rounded-full mb-2 ring-1 ring-green-500/50"
                        >
                            <Check className="w-8 h-8 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-wider"
                        >
                            TEMİZ
                        </motion.p>
                    </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 h-20">
          {gameState === "selection" && (
            (currentPlayer === 1 && player1Selection !== null) || 
            (currentPlayer === 2 && player2Selection !== null)
          ) && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={confirmSelection}
              className="px-10 py-4 bg-white text-black font-black text-xl rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95 shadow-xl"
            >
              {currentPlayer === 1 ? "GİZLE & DEVAM ET" : "GİZLE & BAŞLAT"}
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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
            
            {/* Animated Particles/Glow in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full"
            >
                {/* Card Container */}
                <div className="relative bg-zinc-900/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-md">
                    
                    {/* Header Image Section */}
                    <div className="relative h-72 w-full group">
                        <Image 
                            src={resultData.box.image!}
                            alt="Penalty"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 3 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="bg-red-600 text-white font-black px-6 py-2 rounded-2xl shadow-lg border-2 border-white/20 text-lg uppercase tracking-wider transform rotate-3 flex items-center gap-2"
                            >
                                <Skull className="w-5 h-5" />
                                {resultData.player}. OYUNCU YANDI!
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 pb-10 -mt-12 relative z-10 flex flex-col items-center text-center">
                        
                        {/* Icon Circle */}
                        <div className="w-24 h-24 bg-zinc-800 rounded-3xl border-4 border-zinc-900 shadow-2xl flex items-center justify-center mb-6 transform rotate-45 group hover:rotate-0 transition-all duration-500">
                            <div className="transform -rotate-45 group-hover:rotate-0 transition-all duration-500">
                                <resultData.box.icon className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 mb-8">
                            <h2 className="text-red-500 font-black tracking-[0.2em] uppercase text-xs border border-red-500/30 py-1 px-3 rounded-full inline-block">
                                GÖREVİN & CEZAN
                            </h2>
                            <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 leading-[1.1]">
                                "{resultData.box.text}"
                            </p>
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={resetGame}
                            className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-2xl text-xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                        >
                            <RefreshCw className="w-6 h-6 group-hover/btn:rotate-180 transition-transform duration-700" />
                            YENİ TUR BAŞLAT
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
