import WhoIsLikelyClient from "./WhoIsLikelyClient";
import { getWhoIsLikelyQuestions } from "@/app/actions/who-is-likely";

export const metadata = {
  title: "Kim Daha... - Quiz Perileri",
  description: "Arkadaşınla veya sevgilinle yüzleşme vakti! Kim daha kıskanç? Kim daha dağınık?",
};

export default async function KimDahaPage() {
  const { data: questions } = await getWhoIsLikelyQuestions();

  return <WhoIsLikelyClient initialQuestions={questions || []} />;
}
