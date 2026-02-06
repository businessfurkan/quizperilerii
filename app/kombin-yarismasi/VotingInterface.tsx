"use client";

import { useState } from "react";
import { castVote } from "@/app/actions/outfit";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Trophy, AlertCircle, CheckCircle, Share2, Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface VotingInterfaceProps {
  competition: any; // Using any to avoid deep Prisma type issues for now
}

export default function VotingInterface({ competition }: VotingInterfaceProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [votingId, setVotingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleVote = async (entryId: string) => {
    if (!session) {
      router.push("/login");
      return;
    }

    setVotingId(entryId);
    setMessage(null);

    const result = await castVote(entryId);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "Oyunuz kaydedildi!" });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#ffffff']
      });
    } else {
      setMessage({ type: "error", text: result.message || "Bir hata oluştu." });
    }
    setVotingId(null);
  };

  if (!competition) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center px-4"
      >
        <div className="w-32 h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-pulse">
          <Clock className="w-16 h-16 text-purple-300" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">Şu Anda Aktif Yarışma Yok</h2>
        <p className="text-purple-200/70 max-w-lg mx-auto mb-10 text-xl leading-relaxed">
          Yeni yarışma çok yakında başlayacak! Hazırlıklarını yap ve takipte kal.
        </p>
        <Link href="/kombin-yarismasi/basvuru">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-3 hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all border border-white/20"
          >
            <Sparkles className="w-6 h-6" />
            Hemen Başvur
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  const timeLeft = new Date(competition.endDate).getTime() - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

  return (
    <div className="space-y-12 pb-24">
      {/* Header Info */}
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-purple-200 font-bold text-sm shadow-lg hover:bg-white/10 transition-colors"
        >
          <Clock className="w-5 h-5 text-pink-400" />
          <span className="tracking-wide">KALAN SÜRE: <span className="text-white text-lg">{hoursLeft} SAAT</span></span>
        </motion.div>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={cn(
                "px-6 py-4 rounded-2xl flex items-center gap-3 text-center font-bold shadow-2xl backdrop-blur-md border",
                message.type === "success" 
                  ? "bg-green-500/20 border-green-500/30 text-green-200" 
                  : "bg-red-500/20 border-red-500/30 text-red-200"
              )}
            >
              {message.type === "success" ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {competition.entries.map((entry: any, index: number) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] opacity-50 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative bg-[#1a0b2e] rounded-[1.8rem] overflow-hidden border border-white/10 h-full flex flex-col">
              
              {/* Image Container */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={entry.submission.imageUrl}
                  alt="Outfit"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent opacity-80" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4">
                   <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                      #{index + 1}
                   </div>
                </div>
              </div>

              {/* Vote Action Area */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pt-0">
                <button
                  onClick={() => handleVote(entry.id)}
                  disabled={votingId !== null}
                  className="w-full py-4 relative overflow-hidden group/btn rounded-xl font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-transform duration-300 group-hover/btn:scale-110" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {votingId === entry.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="w-6 h-6 fill-white/20 group-hover/btn:fill-white transition-colors" />
                    )}
                    <span className="tracking-wider">OY VER</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/kombin-yarismasi/basvuru">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-[#1a0b2e] rounded-2xl font-black shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] border border-purple-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-0.5">Yarışmaya Katıl</span>
                <div className="flex items-center gap-1 text-white text-lg leading-none">
                  Başvuru Yap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
