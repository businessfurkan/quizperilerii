import { getPollById } from "@/lib/db";
import { ArrowLeft, BarChart2, Calendar, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PollResultsPage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPollById(id);

  if (!poll) {
    notFound();
  }

  const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/polls"
          className="p-2 hover:bg-[#1e3a8a]/10 rounded-xl transition-colors text-[#1e3a8a]/60 hover:text-[#1e3a8a] border-2 border-transparent hover:border-[#1e3a8a]/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1e3a8a] tracking-tight">Anket Sonuçları</h1>
          <p className="text-[#1e3a8a]/60 font-bold">{poll.question}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STATS CARD */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#8bb9e0] border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] rounded-2xl p-6 text-[#1e3a8a]">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="font-bold">Toplam Oy</span>
                </div>
                <div className="text-4xl font-black">{totalVotes}</div>
            </div>
            <div className="bg-white border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] rounded-2xl p-6 text-[#1e3a8a]">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-bold">Başlangıç</span>
                </div>
                <div className="text-xl font-bold">{new Date(poll.startDate).toLocaleDateString('tr-TR')}</div>
            </div>
            <div className="bg-white border-4 border-[#1e3a8a] shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] rounded-2xl p-6 text-[#1e3a8a]">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-5 h-5" />
                    <span className="font-bold">Durum</span>
                </div>
                <div className="text-xl font-bold">
                    {poll.isActive ? "Aktif" : "Pasif"}
                </div>
            </div>
        </div>

        {/* RESULTS LIST */}
        <div className="md:col-span-3 bg-white border-4 border-[#1e3a8a] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-black text-[#1e3a8a] mb-6">Oy Dağılımı</h2>
            
            <div className="space-y-6">
                {poll.options.map((option: any) => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    
                    return (
                        <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between font-bold text-[#1e3a8a]">
                                <div className="flex items-center gap-3">
                                    {option.image && (
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-[#1e3a8a]">
                                            <Image src={option.image} alt={option.text} fill className="object-cover" />
                                        </div>
                                    )}
                                    <span>{option.text}</span>
                                </div>
                                <div className="text-right">
                                    <div>{option.votes} Oy</div>
                                    <div className="text-xs opacity-60">%{percentage.toFixed(1)}</div>
                                </div>
                            </div>
                            
                            <div className="h-4 bg-blue-100 rounded-full overflow-hidden border-2 border-[#1e3a8a]/20">
                                <div 
                                    className="h-full bg-[#1e3a8a] transition-all duration-1000 ease-out relative overflow-hidden"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {totalVotes === 0 && (
                <div className="text-center py-8 text-[#1e3a8a]/40 font-bold">
                    Henüz oy kullanılmamış.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
