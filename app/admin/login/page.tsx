"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Giriş bilgileri hatalı.");
      } else if (result?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
         setError("Bilinmeyen bir hata oluştu.");
      }
    } catch (error) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-[#8bb9e0] border-4 border-blue-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(30,58,138,1)] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-900 text-white mb-4 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-blue-900 mb-2">Admin Girişi</h1>
          <p className="text-blue-900/70 font-medium">Quiz Perileri Yönetim Paneli</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-900 rounded-xl text-red-900 text-sm text-center font-bold shadow-[4px_4px_0px_0px_rgba(127,29,29,0.2)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Email Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-900/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-10 py-3 text-blue-900 placeholder:text-blue-900/30 focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all font-medium"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-900/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-blue-900 rounded-xl px-10 py-3 text-blue-900 placeholder:text-blue-900/30 focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-950 text-white font-black py-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-transparent hover:border-white/20"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
