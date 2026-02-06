import { updatePoll } from "@/app/actions";
import { getPollById } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PollForm from "../../PollForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPollPage({ params }: PageProps) {
  const { id } = await params;
  const poll = await getPollById(id);

  if (!poll) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/polls"
          className="p-2 hover:bg-purple-900/10 rounded-xl transition-colors text-purple-900/60 hover:text-purple-900 border-2 border-transparent hover:border-purple-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-purple-900 tracking-tight">Anketi Düzenle</h1>
          <p className="text-purple-900/60 font-bold">{poll.question}</p>
        </div>
      </div>

      <PollForm initialData={poll} action={updatePoll.bind(null, poll.id)} />
    </div>
  );
}
