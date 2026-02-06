import LoveMeterClient from "./LoveMeterClient";
import { getLoveMeterQuestions } from "@/app/actions/love-meter";

export const metadata = {
  title: "Aşk Metre - Quiz Perileri",
  description: "Sevgilinle ne kadar uyumlusun? Aşk Metre testi ile uyumunuzu ölçün!",
};

export default async function AskMetrePage() {
  const { data: questions } = await getLoveMeterQuestions();
  
  return <LoveMeterClient initialQuestions={questions || []} />;
}
