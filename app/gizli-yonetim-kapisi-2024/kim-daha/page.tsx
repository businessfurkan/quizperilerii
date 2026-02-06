import { getWhoIsLikelyQuestions } from "@/app/actions/who-is-likely";
import WhoIsLikelyAdminClient from "./WhoIsLikelyAdminClient";

export default async function WhoIsLikelyAdminPage() {
  const { data: questions } = await getWhoIsLikelyQuestions();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2a0d59]">Kim Daha... Soruları</h1>
        <p className="text-[#2a0d59]/70 font-medium">Arkadaş grupları ve çiftler için yüzleşme sorularını yönetin.</p>
      </div>
      
      <WhoIsLikelyAdminClient questions={questions || []} />
    </div>
  );
}
