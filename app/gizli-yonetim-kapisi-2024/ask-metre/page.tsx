import { getLoveMeterQuestions } from "@/app/actions/love-meter";
import LoveMeterAdminClient from "./LoveMeterAdminClient";

export default async function LoveMeterAdminPage() {
  const { data: questions } = await getLoveMeterQuestions();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2a0d59]">Aşk Metre Soruları</h1>
        <p className="text-[#2a0d59]/70 font-medium">Çiftlerin uyumunu test eden soruları yönetin.</p>
      </div>
      
      <LoveMeterAdminClient questions={questions || []} />
    </div>
  );
}
