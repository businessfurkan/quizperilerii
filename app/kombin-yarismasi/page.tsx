import { getActiveCompetition } from "@/app/actions/outfit";
import VotingInterface from "./VotingInterface";
import { Sparkles, Trophy, Star } from "lucide-react";
import { ModernGridPattern } from "@/components/ui/background-patterns";

export const revalidate = 60; // Revalidate every minute

export default async function CompetitionPage() {
  const competition = await getActiveCompetition();

  return (
    <div className="min-h-screen bg-[#120526] text-white relative overflow-hidden font-nunito selection:bg-pink-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#120526] to-[#0a0216]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      <ModernGridPattern className="absolute inset-0 text-white/[0.03]" width={40} height={40} />
      
      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[128px] mix-blend-screen animate-pulse delay-1000" />

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-24 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-bounce hover:scale-105 transition-transform duration-300 group">
          <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)] group-hover:rotate-12 transition-transform" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-sm">
            Günün Kombini
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-purple-200/80 font-medium max-w-2xl mx-auto leading-relaxed">
          En tarz kombini seç, oyunu kullan! <br/>
          <span className="text-pink-300">Her gün yenilenen</span> yarışmada favorini belirle.
        </p>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 hidden lg:block opacity-20 rotate-12">
          <Trophy className="w-24 h-24 text-yellow-500" />
        </div>
        <div className="absolute top-1/2 right-10 hidden lg:block opacity-20 -rotate-12">
          <Star className="w-24 h-24 text-pink-500" />
        </div>
      </div>

      <div className="container mx-auto -mt-10 relative z-20 px-4 pb-20">
        <VotingInterface competition={competition} />
      </div>
    </div>
  );
}
