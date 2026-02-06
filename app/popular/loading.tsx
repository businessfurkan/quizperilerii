import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-[#491799]">
       <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-[#2a0d59] p-4 rounded-2xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] animate-bounce">
             <Loader2 className="w-8 h-8 text-[#d8b4fe] animate-spin" />
          </div>
       </div>
       <div className="space-y-2 text-center">
         <h3 className="text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(42,13,89,1)]">
            Yükleniyor...
         </h3>
         <p className="text-[#0f172a] font-bold animate-pulse">
            En popüler içerikler hazırlanıyor
         </p>
       </div>
    </div>
  );
}
