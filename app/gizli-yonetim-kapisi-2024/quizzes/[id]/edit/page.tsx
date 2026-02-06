import { updateQuiz } from "@/app/actions";
import { getQuizById, getCategories } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuizForm from "../../QuizForm";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = await getQuizById(id);
  const categories = await getCategories();

  if (!quiz) {
    notFound();
  }

  const quizIsPopular = quiz.isPopular;
  const updateAction = updateQuiz.bind(null, quiz.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/gizli-yonetim-kapisi-2024/quizzes"
          className="p-2 hover:bg-blue-900/10 rounded-xl transition-colors text-blue-900/60 hover:text-blue-900 border-2 border-transparent hover:border-blue-900/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Quizi Düzenle</h1>
          <p className="text-blue-900/60 font-bold">{quiz.title}</p>
        </div>
      </div>

      <QuizForm 
        categories={categories} 
        initialData={quiz} 
        isPopular={quizIsPopular}
        action={async (formData) => {
          "use server";
          await updateAction(formData);
        }} 
      />
    </div>
  );
}