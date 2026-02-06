"use client";

import { useState } from "react";
import { submitOutfit } from "@/app/actions/outfit";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Sparkles, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { ModernGridPattern } from "@/components/ui/background-patterns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SubmissionPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitOutfit(formData);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      (e.target as HTMLFormElement).reset();
      setPreview(null);
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative bg-[#120526] overflow-hidden py-12 px-4 font-nunito selection:bg-pink-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#120526] to-[#0a0216]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      <ModernGridPattern className="absolute inset-0 text-white/[0.03]" width={40} height={40} />
      
      {/* Floating Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="mb-8">
            <Link href="/kombin-yarismasi" className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Yarışmaya Dön</span>
            </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-bounce">
            <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Kombin Yarışması
          </h1>
          <p className="text-lg text-purple-200/80 font-medium max-w-lg mx-auto leading-relaxed">
            Tarzını göster, oyları topla! <span className="text-pink-300">Her gün</span> en iyi kombinler yarışıyor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
                <Upload className="w-6 h-6 text-pink-400" />
            </div>
            Başvuru Formu
          </h2>

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={cn(
                "p-4 rounded-xl mb-6 flex items-center gap-3 border",
                message.type === "success" 
                  ? "bg-green-500/20 border-green-500/30 text-green-200" 
                  : "bg-red-500/20 border-red-500/30 text-red-200"
              )}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="font-medium">{message.text}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-purple-200 uppercase tracking-wider pl-1">
                  Ad Soyad (Opsiyonel)
                </label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Rumuz da olabilir"
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-medium text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-purple-200 uppercase tracking-wider pl-1">
                  E-posta Adresi
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="iletisim@ornek.com"
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-medium text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-purple-200 uppercase tracking-wider block pl-1">
                Kombin Fotoğrafı
              </label>
              <div className="relative group">
                <input
                  name="file"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                    "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300",
                    preview 
                        ? "border-pink-500/50 bg-pink-500/5" 
                        : "border-white/10 bg-black/20 group-hover:border-pink-500/30 group-hover:bg-pink-500/5"
                )}>
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="h-full w-full object-contain rounded-xl p-2"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform border border-white/10">
                        <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-pink-400 transition-colors" />
                      </div>
                      <p className="text-white/60 font-medium group-hover:text-pink-200 transition-colors">
                        Fotoğraf yüklemek için tıkla veya sürükle
                      </p>
                      <p className="text-xs text-white/30 mt-2">
                        Yüz görünmemeli • Max 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <input
                name="ageConfirmed"
                type="checkbox"
                required
                id="ageConfirmed"
                className="mt-1 w-5 h-5 text-pink-600 rounded border-white/20 bg-black/20 focus:ring-pink-500 focus:ring-offset-0"
              />
              <label htmlFor="ageConfirmed" className="text-sm text-yellow-100/90 leading-snug cursor-pointer select-none">
                <span className="font-bold block mb-1 text-yellow-100">Katılım Şartlarını Onaylıyorum</span>
                18 yaşından büyüğüm ve yüklediğim fotoğrafın bana ait olduğunu, yüzümün görünmediğini ve yayınlanmasına izin verdiğimi beyan ederim.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black rounded-xl shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg relative overflow-hidden group/btn"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <>Loading...</>
              ) : (
                <div className="relative flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Başvuruyu Gönder
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
