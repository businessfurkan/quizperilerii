import { createPoll } from "@/app/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PollForm from "../PollForm";

export default function NewPollPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/polls"
          className="p-2 hover:bg-blue-900/10 rounded-xl transition-colors text-blue-900/60 hover:text-blue-900 border-2 border-transparent hover:border-blue-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Yeni Anket Ekle</h1>
          <p className="text-blue-900/60 font-bold">Yeni bir anket oluşturup yayınlayın.</p>
        </div>
      </div>

      <PollForm action={createPoll} />
    </div>
  );
}
