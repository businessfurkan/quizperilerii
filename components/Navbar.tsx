"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Anasayfa", href: "/" },
  { name: "Günün Anketi", href: "/poll" },
  { name: "Popüler Quizler", href: "/popular" },
  { name: "Tüm Kategoriler", href: "/categories" },
  { name: "Box Night 🔞", href: "/box-night" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#005d9c] border-b-4 border-primary h-[72px] transition-all">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight leading-none group-hover:text-[#1e3a8a] transition-colors drop-shadow-sm">
                QuizPerileri
              </span>
              <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase mt-0.5">
                Modern Quiz
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 active:scale-95 border-2",
                    isActive 
                      ? "text-white bg-primary border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1" 
                      : "text-white border-transparent hover:bg-white/20 hover:border-white/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2.5 text-white hover:text-[#1e3a8a] bg-primary hover:bg-white/20 border-2 border-white rounded-xl transition-all active:scale-95"
            aria-label={isOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#005d9c] pt-24 px-6 md:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-all border shadow-sm",
                      pathname === item.href
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    {item.name}
                    <ChevronRight className={cn("w-5 h-5 opacity-50", pathname === item.href && "text-white opacity-100")} />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile Footer Decor */}
            <div className="mt-auto mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-sm text-slate-500 font-medium">QuizPerileri &copy; {new Date().getFullYear()}</p>
                <p className="text-xs text-slate-400 mt-1">Türkiye'nin en eğlenceli quiz platformu</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
