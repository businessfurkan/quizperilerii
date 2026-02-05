"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileQuestion, FolderTree, LogOut, Sparkles, Vote, Box } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Quizler", href: "/admin/quizzes", icon: FileQuestion },
  { name: "Kategoriler", href: "/admin/categories", icon: FolderTree },
  { name: "Anketler", href: "/admin/polls", icon: Vote },
  { name: "Box Night", href: "/admin/box-night", icon: Box },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-blue-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#8bb9e0] border-r-4 border-blue-900 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 shadow-[4px_0px_0px_0px_rgba(30,58,138,0.1)]">
        <div className="p-6 border-b-2 border-blue-900/10 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-900 text-white shadow-sm">
             <Sparkles className="w-5 h-5" />
          </div>
          <Link href="/admin" className="text-xl font-bold text-blue-900 tracking-tight">
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
                    ? "bg-blue-900 text-white border-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.5)]"
                    : "text-blue-900/70 border-transparent hover:bg-blue-900/10 hover:text-blue-900 hover:border-blue-900/20"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-blue-900/60 group-hover:text-blue-900")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-blue-900/10">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
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
