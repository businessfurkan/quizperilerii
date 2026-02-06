import { getAdminSubmissions } from "@/app/actions/outfit";
import SubmissionList from "./SubmissionList";
import { Sparkles } from "lucide-react";

export default async function AdminKombinPage() {
  const submissions = await getAdminSubmissions();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-800">Kombin Yönetimi</h1>
          <p className="text-gray-500 font-medium">Başvuruları yönetin ve yarışmaları başlatın.</p>
        </div>
      </div>

      <SubmissionList initialSubmissions={submissions} />
    </div>
  );
}
