import { createQuiz } from "@/app/actions";
import { getCategories } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizForm from "../QuizForm";

export const dynamic = "force-dynamic";

export default async function NewQuizPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/gizli-yonetim-kapisi-2024/quizzes"
          className="p-2 hover:bg-purple-900/10 rounded-xl transition-colors text-purple-900/60 hover:text-purple-900 border-2 border-transparent hover:border-purple-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-purple-900 tracking-tight">Yeni Quiz Ekle</h1>
          <p className="text-purple-900/60 font-bold">Yeni bir quiz oluşturup yayınlayın.</p>
        </div>
      </div>

      <QuizForm categories={categories} action={createQuiz} />
    </div>
  );
}