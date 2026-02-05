import { getActivePoll } from "@/lib/db";
import PollClient from "./PollClient";

export const metadata = {
  title: "Günün Anketi | QuizPerileri",
  description: "Her gün yeni bir konu, senin fikrin Türkiye'nin sesi!",
};

export default async function PollPage() {
  const poll = await getActivePoll();
  
  return <PollClient poll={poll} />;
}
