import { getQuizById, getQuizzes } from "@/lib/db";
import QuizInterface from "@/components/QuizInterface";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const quizzes = await getQuizzes();
  return quizzes.map((quiz) => ({
    id: quiz.id,
  }));
}

export default async function QuizPage({ params }: PageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);
  const allQuizzes = await getQuizzes();

  if (!quiz) {
    notFound();
  }

  // Find similar quizzes (same category, excluding current)
  // If not enough same category, fill with others
  let similarQuizzes = allQuizzes
    .filter(q => q.categorySlug === quiz.categorySlug && q.id !== quiz.id)
    .slice(0, 3);
  
  if (similarQuizzes.length < 3) {
    const others = allQuizzes
      .filter(q => q.categorySlug !== quiz.categorySlug && q.id !== quiz.id)
      .sort(() => 0.5 - Math.random()) // Simple shuffle
      .slice(0, 3 - similarQuizzes.length);
    similarQuizzes = [...similarQuizzes, ...others];
  }

  return <QuizInterface quiz={quiz} similarQuizzes={similarQuizzes} />;
}
