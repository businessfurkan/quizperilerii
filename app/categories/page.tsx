import { getCategories, getQuizzes } from "@/lib/db";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const categories = await getCategories();
  const quizzes = await getQuizzes();

  // Calculate quiz counts for each category
  const categoriesWithCounts = categories.map(category => {
    const count = quizzes.filter(q => q.categorySlug === category.slug).length;
    return {
      ...category,
      quizCount: count
    };
  });
  
  return <CategoriesClient categories={categoriesWithCounts} />;
}
