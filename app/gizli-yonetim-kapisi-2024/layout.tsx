"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileQuestion, FolderTree, LogOut, Sparkles, Vote, Box, Shirt, ScrollText } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/gizli-yonetim-kapisi-2024", icon: LayoutDashboard },
  { name: "Quizler", href: "/gizli-yonetim-kapisi-2024/quizzes", icon: FileQuestion },
  { name: "Kategoriler", href: "/gizli-yonetim-kapisi-2024/categories", icon: FolderTree },
  { name: "Anketler", href: "/gizli-yonetim-kapisi-2024/polls", icon: Vote },
  { name: "Box Night", href: "/gizli-yonetim-kapisi-2024/box-night", icon: Box },
  { name: "Kombin", href: "/gizli-yonetim-kapisi-2024/kombin", icon: Shirt },
  { name: "Sistem Logları", href: "/gizli-yonetim-kapisi-2024/logs", icon: ScrollText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-purple-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#d8b4fe] border-r-4 border-purple-900 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 shadow-[4px_0px_0px_0px_rgba(42,13,89,0.1)]">
        <div className="p-6 border-b-2 border-purple-900/10 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-900 text-white shadow-sm">
             <Sparkles className="w-5 h-5" />
          </div>
          <Link href="/gizli-yonetim-kapisi-2024" className="text-xl font-bold text-purple-900 tracking-tight">
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold border-2",
                  isActive
                    ? "bg-purple-900 text-white border-purple-900 shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)]"
                    : "text-purple-900/70 border-transparent hover:bg-purple-900/10 hover:text-purple-900 hover:border-purple-900/20"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-purple-900/60 group-hover:text-purple-900")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-purple-900/10">
          <button
            onClick={() => signOut({ callbackUrl: "/gizli-yonetim-kapisi-2024/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold border-2 border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
        {children}
      </main>
    </div>
  );
}
