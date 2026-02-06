"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, ChevronRight, Zap, Home, Activity, Flame, Grid, Trophy, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Anasayfa", href: "/", icon: Home },
  { name: "Günün Anketi", href: "/poll", icon: Activity },
  { name: "Popüler", href: "/popular", badge: "HOT", icon: Flame },
  { name: "Kategoriler", href: "/categories", icon: Grid },
  { name: "Yarışma", href: "/kombin-yarismasi", badge: "YENİ", icon: Trophy },
  { name: "Box Night", href: "/box-night", badge: "18+", icon: Box },
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
      <nav 
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300 font-sans",
          "bg-white/95 backdrop-blur-xl shadow-xl shadow-purple-900/5 py-3 border-b border-gray-100"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-[0_4px_0_#581c87]",
              "bg-purple-600 text-white border-2 border-purple-800"
            )}>
              <Zap className="w-6 h-6 fill-current" />
              <div className="absolute inset-x-2 top-1 h-[2px] bg-white/30 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-2xl font-black tracking-tight leading-none transition-colors drop-shadow-sm",
                "text-gray-900 group-hover:text-purple-600"
              )}>
                QuizPerileri
              </span>
              <span className={cn(
                "text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5",
                "text-purple-600"
              )}>
                Modern Quiz
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2.5 rounded-2xl text-sm font-black tracking-wide transition-all duration-200 flex items-center gap-2 group overflow-hidden",
                    // 3D Base Styles - Borders & Shadows
                    "border-b-[4px] border-2",
                    
                    // Active State (Selected Tab)
                    isActive 
                      ? "bg-gradient-to-b from-purple-500 to-purple-600 border-purple-700 border-b-purple-800 text-white shadow-[0_2px_10px_rgba(168,85,247,0.3)]" 
                      : "bg-white border-slate-200 border-b-slate-300 text-slate-600 hover:bg-purple-50/50",
                    
                    // Hover Effects: "Pressing" feel
                    // Normal state is "Lifted". Hover moves it down (translate-y) and reduces border-bottom width visually? 
                    // Actually, simpler 3D button logic:
                    // Default: border-b-[4px]
                    // Hover: border-b-[2px] + translate-y-[2px]
                    // Active: border-b-[0px] + translate-y-[4px]
                    
                    isActive 
                      ? "hover:border-b-[2px] hover:translate-y-[2px] hover:brightness-110" 
                      : "hover:border-b-[2px] hover:translate-y-[2px] hover:border-purple-300 hover:border-b-purple-400 hover:text-purple-600",

                    // Click Effects
                    "active:border-b-0 active:translate-y-[4px] active:shadow-none"
                  )}
                >
                  {/* Glossy Highlight */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-white/20" />
                  
                  <Icon className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-purple-500")} />
                  <span className="relative z-10">{item.name}</span>
                  {item.badge && (
                    <span className={cn(
                      "relative z-10 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide ml-1 shadow-sm border-b-2",
                      isActive ? "bg-white text-purple-700 border-black/10" : "bg-purple-600 text-white border-purple-800"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden relative z-50 p-2 rounded-xl transition-all duration-200 border-2 border-b-[4px]",
              "bg-white text-gray-700 border-slate-200 border-b-slate-300",
              "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 hover:border-b-purple-300",
              "hover:border-b-[2px] hover:translate-y-[2px]",
              "active:border-b-0 active:translate-y-[4px]"
            )}
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-2 p-6 mt-20">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl transition-all active:scale-98 border-2",
                      pathname === item.href
                        ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
                        : "bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-lg">{item.name}</span>
                      {item.badge && (
                        <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 transition-transform",
                      pathname === item.href ? "text-purple-600" : "text-gray-400"
                    )} />
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl text-white text-center shadow-xl shadow-purple-200"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black mb-1">QuizPerileri</h3>
                <p className="text-purple-100 text-sm font-medium mb-4">Her gün yeni eğlence!</p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
                >
                  Kapat
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
