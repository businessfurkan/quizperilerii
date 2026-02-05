import { getPopularQuizzes } from "@/lib/db";
import PopularClient from "./PopularClient";

export default async function PopularPage() {
  const popularQuizzes = await getPopularQuizzes();

  return <PopularClient initialQuizzes={popularQuizzes} />;
}
