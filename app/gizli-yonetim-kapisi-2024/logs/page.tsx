import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";
import { AuditLog } from "@prisma/client";

export default async function LogsPage() {
  // Use a try-catch block to handle potential Prisma errors gracefully
  let logs: AuditLog[] = [];
  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  } catch (error) {
    console.error("Failed to fetch logs:", error);
  }

  return (
    <div className="space-y-6">
       {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border-2 border-purple-900 shadow-[4px_4px_0px_0px_rgba(42,13,89,1)]">
        <div className="p-3 bg-purple-100 rounded-xl border-2 border-purple-900">
          <ScrollText className="w-8 h-8 text-purple-900" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-purple-900 tracking-tight">Sistem Logları</h1>
          <p className="text-purple-900/60 font-medium">Sistem aktiviteleri ve güvenlik kayıtları</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border-2 border-purple-900 shadow-[4px_4px_0px_0px_rgba(42,13,89,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Zaman</th>
                <th className="px-6 py-4 text-left font-bold">İşlem</th>
                <th className="px-6 py-4 text-left font-bold">Açıklama</th>
                <th className="px-6 py-4 text-left font-bold">Kullanıcı / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-purple-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 text-purple-900 font-medium whitespace-nowrap">
                    {format(log.timestamp, "dd.MM.yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-purple-900/80 font-medium">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 text-purple-900/60 font-mono text-sm">
                    {log.userId || log.ip || "-"}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-purple-900/40 font-bold">
                    Henüz kayıt bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}