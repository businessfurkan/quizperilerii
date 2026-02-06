"use client";

import { useState } from "react";
import { updateSubmissionStatus, getRandomApprovedSubmissions, createCompetition } from "@/app/actions/outfit";
import { OutfitSubmission } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trash, Play, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function SubmissionList({ initialSubmissions }: { initialSubmissions: OutfitSubmission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: string) => {
    setLoading(id);
    const result = await updateSubmissionStatus(id, status);
    if (result.success) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    }
    setLoading(null);
  };

  const handleCreateCompetition = async () => {
    if (!confirm("Rastgele 10 onaylı kombin seçilip yeni yarışma başlatılacak. Onaylıyor musunuz?")) return;
    
    setLoading("create-comp");
    try {
      const result = await getRandomApprovedSubmissions(10);
      if (!result.success || !result.ids) {
        alert(result.message || "Hata oluştu");
        setLoading(null);
        return;
      }

      const createResult = await createCompetition(result.ids);
      if (createResult.success) {
        alert(createResult.message);
        window.location.reload();
      } else {
        alert(createResult.message);
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu");
    }
    setLoading(null);
  };

  const approvedCount = submissions.filter(s => s.status === "APPROVED").length;

  return (
    <div className="space-y-8">
      {/* Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Onay Bekleyen</h3>
          <p className="text-3xl font-black text-yellow-500">
            {submissions.filter(s => s.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Onaylanmış</h3>
          <p className="text-3xl font-black text-green-500">
            {approvedCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-sm flex items-center justify-center">
          <button
            onClick={handleCreateCompetition}
            disabled={loading !== null || approvedCount < 10}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all p-4 font-bold"
          >
            {loading === "create-comp" ? (
              <RefreshCcw className="w-6 h-6 animate-spin" />
            ) : (
              <Play className="w-6 h-6" />
            )}
            Yarışmayı Başlat
            <span className="text-xs font-normal opacity-80">(Min. 10 Onaylı)</span>
          </button>
        </div>
      </div>

      {/* Filters can be added here if needed */}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {submissions.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={`bg-white rounded-2xl overflow-hidden border-2 shadow-sm transition-all ${
                sub.status === "APPROVED" ? "border-green-400 shadow-green-100" :
                sub.status === "REJECTED" ? "border-red-200 opacity-60" :
                sub.status === "SELECTED" ? "border-purple-500 ring-4 ring-purple-100" :
                "border-gray-200"
              }`}
            >
              <div className="relative aspect-[3/4] bg-gray-100 group">
                {sub.imageUrl ? (
                  <img
                    src={sub.imageUrl}
                    alt="Submission"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <p className="font-bold truncate">{sub.email}</p>
                  <p className="text-sm opacity-80">{format(new Date(sub.createdAt), "d MMMM HH:mm", { locale: tr })}</p>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-sm shadow-sm uppercase tracking-wide">
                  {sub.status === "PENDING" && <span className="text-yellow-600">Bekliyor</span>}
                  {sub.status === "APPROVED" && <span className="text-green-600">Onaylı</span>}
                  {sub.status === "REJECTED" && <span className="text-red-600">Red</span>}
                  {sub.status === "SELECTED" && <span className="text-purple-600">Yarışmada</span>}
                </div>
              </div>

              <div className="p-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusUpdate(sub.id, "APPROVED")}
                  disabled={loading === sub.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
                  title="Onayla"
                >
                  <Check className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Onayla</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate(sub.id, "REJECTED")}
                  disabled={loading === sub.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                  title="Reddet"
                >
                  <X className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Reddet</span>
                </button>
                <button
                  onClick={() => {
                    if(confirm("Silmek istediğinize emin misiniz?")) handleStatusUpdate(sub.id, "DELETED");
                  }}
                  disabled={loading === sub.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50"
                  title="Sil"
                >
                  <Trash className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1">Sil</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
