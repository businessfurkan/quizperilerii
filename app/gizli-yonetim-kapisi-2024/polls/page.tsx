import Link from "next/link";
import { getPolls, Poll, PollOption } from "@/lib/db";
import { deletePollAction } from "@/app/actions";
import { Edit, Trash2, Plus, BarChart2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PollsPage() {
  const polls = await getPolls();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-purple-900 mb-2">Anket Yönetimi</h1>
          <p className="text-purple-900/70 font-medium">Anketleri oluştur, düzenle ve sonuçları görüntüle.</p>
        </div>
        <Link
          href="/admin/polls/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl transition-all font-bold shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 border-2 border-transparent hover:border-white/20"
        >
          <Plus className="w-5 h-5" />
          Yeni Anket Ekle
        </Link>
      </div>

      <div className="bg-[#d8b4fe] border-4 border-purple-900 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-purple-900/20 bg-purple-900/10">
              <th className="p-4 text-purple-900 font-bold">Soru</th>
              <th className="p-4 text-purple-900 font-bold">Slug</th>
              <th className="p-4 text-purple-900 font-bold">Durum</th>
              <th className="p-4 text-purple-900 font-bold">Tarih</th>
              <th className="p-4 text-purple-900 font-bold text-center">Oylar</th>
              <th className="p-4 text-purple-900 font-bold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll: Poll & { options: PollOption[] }) => {
              const totalVotes = poll.options.reduce((acc: number, opt: PollOption) => acc + opt.votes, 0);
              const isActive = poll.isActive && (!poll.endDate || new Date(poll.endDate) > new Date());
              
              return (
                <tr key={poll.id} className="border-b-2 border-purple-900/10 hover:bg-purple-900/5 transition-colors group">
                  <td className="p-4">
                    <div className="text-purple-900 font-bold">{poll.question}</div>
                    <div className="text-purple-900/60 text-xs line-clamp-1 font-semibold">{poll.description}</div>
                  </td>
                  <td className="p-4 text-purple-900">
                    <span className="px-2 py-1 rounded-lg bg-white border-2 border-purple-900 text-xs font-bold text-purple-900">
                      {poll.slug}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black border-2 w-fit",
                      isActive ? "bg-green-100 text-green-800 border-green-600" : "bg-red-100 text-red-800 border-red-600"
                    )}>
                      {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="p-4 text-purple-900 text-sm font-medium">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {new Date(poll.startDate).toLocaleDateString('tr-TR')}
                    </div>
                    {poll.endDate && (
                        <div className="text-xs opacity-70 mt-1">
                            Bitiş: {new Date(poll.endDate).toLocaleDateString('tr-TR')}
                        </div>
                    )}
                  </td>
                  <td className="p-4 text-center font-bold text-purple-900">
                    {totalVotes}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/polls/${poll.id}/results`}
                        className="p-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border-2 border-purple-900 hover:shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]"
                        title="Sonuçlar"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/polls/${poll.id}/edit`}
                        className="p-2 bg-white text-purple-900 hover:bg-purple-100 rounded-lg transition-colors border-2 border-purple-900 hover:shadow-[2px_2px_0px_0px_rgba(42,13,89,1)]"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deletePollAction.bind(null, poll.id)}>
                        <button 
                          className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-purple-900 hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {polls.length === 0 && (
          <div className="p-8 text-center text-purple-900/40 font-bold">
            Henüz hiç anket eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}
