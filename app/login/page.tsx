"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { ModernGridPattern } from "@/components/ui/background-patterns";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
        setLoading(false);
      } else {
        router.push("/kombin-yarismasi");
        router.refresh();
      }
    } else {
      const result = await registerUser(null, formData);
      if (result.success) {
        setSuccess(result.message);
        setIsLogin(true);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative bg-[#491799] overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <ModernGridPattern 
        className="absolute inset-0 text-white/[0.1] mask-image:radial-gradient(ellipse_at_center,white,transparent)"
         width={24} height={24}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </h1>
          <p className="text-purple-100">
            {isLogin 
              ? "Kombin yarışmasına katılmak ve oy vermek için giriş yapın." 
              : "Hesap oluşturarak yarışmaya katılın."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-200" />
              <input
                name="email"
                type="email"
                required
                placeholder="E-posta Adresi"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-200" />
              <input
                name="password"
                type="password"
                required
                placeholder="Şifre"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm font-medium text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-[#491799] rounded-xl font-black text-xl hover:bg-purple-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-purple-100 hover:text-white font-medium text-sm transition-colors underline decoration-purple-300/50 underline-offset-4"
          >
            {isLogin ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
