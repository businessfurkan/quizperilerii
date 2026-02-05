import { getPopularQuizzes } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function Home() {
  const popularQuizzes = await getPopularQuizzes();

  return <HomeClient popularQuizzes={popularQuizzes} />;
}
